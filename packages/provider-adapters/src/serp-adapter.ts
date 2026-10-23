export interface SerpQueryOptions {
  keyword: string;
  country?: string;
  language?: string;
  device?: 'desktop' | 'mobile';
}

export interface SerpOrganicResult {
  rank: number;
  url: string;
  title: string;
  snippet?: string;
  domain: string;
}

export interface SerpResponse {
  provider: string;
  keyword: string;
  country: string;
  language: string;
  retrievedAt: string;
  isConfigured: boolean;
  results: SerpOrganicResult[];
  error?: string;
}

export class SerpApiAdapter {
  private apiKey: string | undefined;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.SERP_PROVIDER_API_KEY;
  }

  isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  async fetchSerp(options: SerpQueryOptions): Promise<SerpResponse> {
    const country = options.country || 'us';
    const language = options.language || 'en';
    const retrievedAt = new Date().toISOString();

    if (!this.isConfigured()) {
      return {
        provider: 'SERPAPI',
        keyword: options.keyword,
        country,
        language,
        retrievedAt,
        isConfigured: false,
        results: [],
        error: 'SerpAPI key is not configured. Set SERP_PROVIDER_API_KEY in environment or Integrations Settings to retrieve live SERP ranks.'
      };
    }

    try {
      const url = new URL('https://serpapi.com/search.json');
      url.searchParams.set('q', options.keyword);
      url.searchParams.set('gl', country.toLowerCase());
      url.searchParams.set('hl', language.toLowerCase());
      url.searchParams.set('device', options.device || 'desktop');
      url.searchParams.set('api_key', this.apiKey!);

      const res = await fetch(url.toString(), {
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(12000),
      });

      if (!res.ok) {
        const errorText = await res.text();
        return {
          provider: 'SERPAPI',
          keyword: options.keyword,
          country,
          language,
          retrievedAt,
          isConfigured: true,
          results: [],
          error: `SerpAPI returned HTTP ${res.status}: ${errorText.slice(0, 150)}`
        };
      }

      const data = await res.json() as any;
      const organic = data.organic_results || [];
      const results: SerpOrganicResult[] = organic.map((item: any, idx: number) => {
        let domain = '';
        try {
          domain = new URL(item.link).hostname;
        } catch {
          domain = item.displayed_link || '';
        }

        return {
          rank: item.position || idx + 1,
          url: item.link || '',
          title: item.title || '',
          snippet: item.snippet || '',
          domain,
        };
      });

      return {
        provider: 'SERPAPI',
        keyword: options.keyword,
        country,
        language,
        retrievedAt,
        isConfigured: true,
        results,
      };
    } catch (err: any) {
      return {
        provider: 'SERPAPI',
        keyword: options.keyword,
        country,
        language,
        retrievedAt,
        isConfigured: true,
        results: [],
        error: `Network or timeout error while contacting SerpAPI: ${err.message}`
      };
    }
  }
}
