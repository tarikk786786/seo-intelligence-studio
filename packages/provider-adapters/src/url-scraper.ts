import * as cheerio from 'cheerio';

export interface PageAuditResult {
  url: string;
  title: string;
  metaDescription: string;
  canonicalUrl: string;
  headings: {
    h1: string[];
    h2: string[];
    h3: string[];
  };
  wordCount: number;
  imageCount: number;
  imagesWithoutAlt: number;
  hasOpenGraph: boolean;
  cleanText: string;
  isAccessible: boolean;
  error?: string;
}

export function isSafeUrl(targetUrl: string): { safe: boolean; reason?: string } {
  try {
    const parsed = new URL(targetUrl);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { safe: false, reason: 'Invalid protocol: only http and https are permitted.' };
    }

    const host = parsed.hostname.toLowerCase();
    // SSRF checks
    if (
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host === '::1' ||
      host.startsWith('10.') ||
      host.startsWith('192.168.') ||
      host.startsWith('172.16.') ||
      host.startsWith('172.17.') ||
      host.startsWith('172.18.') ||
      host.startsWith('172.19.') ||
      host.startsWith('172.2') ||
      host.startsWith('172.30.') ||
      host.startsWith('172.31.') ||
      host === '169.254.169.254' ||
      host.endsWith('.internal') ||
      host.endsWith('.local')
    ) {
      return { safe: false, reason: 'SSRF blocked: Requests to internal network or private IP addresses are prohibited.' };
    }

    return { safe: true };
  } catch {
    return { safe: false, reason: 'Malformed URL provided.' };
  }
}

export async function auditPage(targetUrl: string): Promise<PageAuditResult> {
  const safety = isSafeUrl(targetUrl);
  if (!safety.safe) {
    return {
      url: targetUrl,
      title: '',
      metaDescription: '',
      canonicalUrl: '',
      headings: { h1: [], h2: [], h3: [] },
      wordCount: 0,
      imageCount: 0,
      imagesWithoutAlt: 0,
      hasOpenGraph: false,
      cleanText: '',
      isAccessible: false,
      error: safety.reason,
    };
  }

  try {
    const res = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 SEOIntelligenceStudio/1.0',
        'Accept': 'text/html,application/xhtml+xml',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      return {
        url: targetUrl,
        title: '',
        metaDescription: '',
        canonicalUrl: '',
        headings: { h1: [], h2: [], h3: [] },
        wordCount: 0,
        imageCount: 0,
        imagesWithoutAlt: 0,
        hasOpenGraph: false,
        cleanText: '',
        isAccessible: false,
        error: `HTTP error ${res.status}: ${res.statusText}`,
      };
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    // Remove script, style, svg, noscript tags
    $('script, style, svg, noscript, nav, footer, header').remove();

    const title = $('title').first().text().trim() || $('meta[property="og:title"]').attr('content') || '';
    const metaDescription = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || '';
    const canonicalUrl = $('link[rel="canonical"]').attr('href') || '';
    const hasOpenGraph = $('meta[property^="og:"]').length > 0;

    const h1: string[] = [];
    $('h1').each((_: any, el: any) => { const t = $(el).text().trim(); if (t) h1.push(t); });

    const h2: string[] = [];
    $('h2').each((_: any, el: any) => { const t = $(el).text().trim(); if (t) h2.push(t); });

    const h3: string[] = [];
    $('h3').each((_: any, el: any) => { const t = $(el).text().trim(); if (t) h3.push(t); });

    let imageCount = 0;
    let imagesWithoutAlt = 0;
    $('img').each((_: any, el: any) => {
      imageCount++;
      const alt = $(el).attr('alt');
      if (!alt || alt.trim().length === 0) {
        imagesWithoutAlt++;
      }
    });

    const cleanText = $('body').text().replace(/\s+/g, ' ').trim();
    const wordCount = cleanText.split(/\s+/).filter(Boolean).length;

    return {
      url: targetUrl,
      title,
      metaDescription,
      canonicalUrl,
      headings: { h1, h2, h3 },
      wordCount,
      imageCount,
      imagesWithoutAlt,
      hasOpenGraph,
      cleanText,
      isAccessible: true,
    };
  } catch (err: any) {
    return {
      url: targetUrl,
      title: '',
      metaDescription: '',
      canonicalUrl: '',
      headings: { h1: [], h2: [], h3: [] },
      wordCount: 0,
      imageCount: 0,
      imagesWithoutAlt: 0,
      hasOpenGraph: false,
      cleanText: '',
      isAccessible: false,
      error: `Scraping failed: ${err.message}`,
    };
  }
}
