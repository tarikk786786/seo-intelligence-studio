export interface AiVisibilityTrackOptions {
  promptText: string;
  brandName: string;
  brandDomain: string;
  competitorDomains?: string[];
}

export interface ExtractedCitation {
  url: string;
  domain: string;
  title?: string;
  isOwnBrand: boolean;
  isCompetitor: boolean;
}

export interface AiVisibilityResult {
  provider: 'GEMINI_SEARCH' | 'OPENAI_SEARCH';
  model: string;
  promptText: string;
  brandMentioned: boolean;
  mentionCount: number;
  mentionContext?: string;
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  sentimentScore: number;
  shareOfVoice: number; // 0 to 1
  citations: ExtractedCitation[];
  rawResponse?: string;
  isConfigured: boolean;
  error?: string;
}

export class GeminiSearchGroundingAdapter {
  private apiKey: string | undefined;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.GEMINI_API_KEY;
  }

  isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  async runGroundedTest(options: AiVisibilityTrackOptions): Promise<AiVisibilityResult> {
    const { promptText, brandName, brandDomain, competitorDomains = [] } = options;

    if (!this.isConfigured()) {
      return {
        provider: 'GEMINI_SEARCH',
        model: 'gemini-2.5-flash',
        promptText,
        brandMentioned: false,
        mentionCount: 0,
        sentiment: 'NEUTRAL',
        sentimentScore: 0,
        shareOfVoice: 0,
        citations: [],
        isConfigured: false,
        error: 'Gemini API key is not configured. Add GEMINI_API_KEY in environment to enable live AI Visibility tracking.'
      };
    }

    try {
      // Direct call to Gemini REST API with Google Search Tool enabled
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.apiKey}`;
      const payload = {
        contents: [
          {
            role: 'user',
            parts: [{ text: promptText }]
          }
        ],
        tools: [
          { google_search: {} }
        ]
      };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(20000),
      });

      if (!res.ok) {
        const errText = await res.text();
        return {
          provider: 'GEMINI_SEARCH',
          model: 'gemini-2.5-flash',
          promptText,
          brandMentioned: false,
          mentionCount: 0,
          sentiment: 'NEUTRAL',
          sentimentScore: 0,
          shareOfVoice: 0,
          citations: [],
          isConfigured: true,
          error: `Gemini API returned status ${res.status}: ${errText.slice(0, 150)}`
        };
      }

      const json = await res.json() as any;
      const candidate = json.candidates?.[0];
      const text = candidate?.content?.parts?.map((p: any) => p.text).join('\n') || '';

      // Extract grounding metadata and citations
      const citations: ExtractedCitation[] = [];
      const groundingChunks = candidate?.groundingMetadata?.groundingChunks || [];
      const cleanBrandDomain = brandDomain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/.*$/, '');

      for (const chunk of groundingChunks) {
        const web = chunk.web;
        if (web && web.uri) {
          let domain = '';
          try {
            domain = new URL(web.uri).hostname.toLowerCase().replace(/^www\./, '');
          } catch {
            domain = web.uri;
          }

          const isOwn = domain.includes(cleanBrandDomain);
          const isComp = competitorDomains.some(c => domain.includes(c.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '')));

          citations.push({
            url: web.uri,
            domain,
            title: web.title,
            isOwnBrand: isOwn,
            isCompetitor: isComp,
          });
        }
      }

      // Analyze brand mention
      const brandRegex = new RegExp(`\\b${brandName.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      const mentionMatches = text.match(brandRegex);
      const mentionCount = mentionMatches ? mentionMatches.length : 0;
      const brandMentioned = mentionCount > 0;

      // Extract snippet of context
      let mentionContext = '';
      if (brandMentioned) {
        const idx = text.toLowerCase().indexOf(brandName.toLowerCase());
        const start = Math.max(0, idx - 80);
        const end = Math.min(text.length, idx + brandName.length + 80);
        mentionContext = `...${text.slice(start, end)}...`;
      }

      // Competitor mentions for Share of Voice
      let totalCompMentions = 0;
      for (const comp of competitorDomains) {
        const compClean = comp.replace(/\.[a-z]+$/, '');
        const compRegex = new RegExp(`\\b${compClean}\\b`, 'gi');
        const cMatches = text.match(compRegex);
        if (cMatches) totalCompMentions += cMatches.length;
      }

      const totalBrandPool = mentionCount + totalCompMentions;
      const shareOfVoice = totalBrandPool > 0 ? Number((mentionCount / totalBrandPool).toFixed(2)) : (brandMentioned ? 1.0 : 0.0);

      // Sentiment analysis heuristic on context
      let sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE' = 'NEUTRAL';
      let sentimentScore = 0.0;
      const positiveWords = ['best', 'top', 'excellent', 'recommended', 'great', 'leading', 'superior', 'reliable'];
      const negativeWords = ['worst', 'bad', 'poor', 'flawed', 'avoid', 'expensive', 'unreliable', 'issues'];

      const contextLower = mentionContext.toLowerCase();
      let posCount = 0;
      let negCount = 0;
      positiveWords.forEach(w => { if (contextLower.includes(w)) posCount++; });
      negativeWords.forEach(w => { if (contextLower.includes(w)) negCount++; });

      if (posCount > negCount) {
        sentiment = 'POSITIVE';
        sentimentScore = 0.7;
      } else if (negCount > posCount) {
        sentiment = 'NEGATIVE';
        sentimentScore = -0.7;
      }

      return {
        provider: 'GEMINI_SEARCH',
        model: 'gemini-2.5-flash',
        promptText,
        brandMentioned,
        mentionCount,
        mentionContext,
        sentiment,
        sentimentScore,
        shareOfVoice,
        citations,
        rawResponse: text,
        isConfigured: true,
      };
    } catch (err: any) {
      return {
        provider: 'GEMINI_SEARCH',
        model: 'gemini-2.5-flash',
        promptText,
        brandMentioned: false,
        mentionCount: 0,
        sentiment: 'NEUTRAL',
        sentimentScore: 0,
        shareOfVoice: 0,
        citations: [],
        isConfigured: true,
        error: `Exception connecting to Gemini API: ${err.message}`
      };
    }
  }
}
