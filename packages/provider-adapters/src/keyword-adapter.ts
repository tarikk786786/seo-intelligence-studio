export interface KeywordMetricsResult {
  keyword: string;
  searchVolume: number;
  cpc: number;
  difficulty: number;
  intent: 'INFORMATIONAL' | 'COMMERCIAL' | 'TRANSACTIONAL' | 'NAVIGATIONAL';
  cluster?: string;
  source: string;
  isConfigured: boolean;
}

export class KeywordMetricsAdapter {
  private apiKey: string | undefined;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.DATAFORSEO_API_KEY;
  }

  isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  async getKeywordIdeas(seedKeyword: string, country: string = 'US'): Promise<{
    provider: string;
    seedKeyword: string;
    isConfigured: boolean;
    keywords: KeywordMetricsResult[];
    error?: string;
  }> {
    if (!this.isConfigured()) {
      return {
        provider: 'DATAFORSEO',
        seedKeyword,
        isConfigured: false,
        keywords: [],
        error: 'Keyword provider API key is not configured. Connect DataForSEO or Google Ads API in the Integrations Hub to pull live monthly volumes and CPC metrics.'
      };
    }

    // Provider call logic for DataForSEO or Google Ads
    return {
      provider: 'DATAFORSEO',
      seedKeyword,
      isConfigured: true,
      keywords: [],
    };
  }
}
