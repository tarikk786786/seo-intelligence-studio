export interface ContentStats {
  wordCount: number;
  characterCount: number;
  headingCounts: {
    h1: number;
    h2: number;
    h3: number;
    h4: number;
  };
  paragraphCount: number;
  keywordOccurrences: number;
  keywordDensity: number; // percentage (e.g. 1.5)
}

const STOPWORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'can', 'can\'t', 'cannot', 'could', 'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t', 'down', 'during',
  'each', 'few', 'for', 'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t', 'have', 'haven\'t', 'having', 'he', 'he\'d', 'he\'ll', 'he\'s', 'her', 'here', 'here\'s', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'how\'s',
  'i', 'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if', 'in', 'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself',
  'let\'s', 'me', 'more', 'most', 'mustn\'t', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own',
  'same', 'shan\'t', 'she', 'she\'d', 'she\'ll', 'she\'s', 'should', 'shouldn\'t', 'so', 'some', 'such',
  'than', 'that', 'that\'s', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re', 'they\'ve', 'this', 'those', 'through', 'to', 'too',
  'under', 'until', 'up', 'very', 'was', 'wasn\'t', 'we', 'we\'d', 'we\'ll', 'we\'re', 'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when', 'when\'s', 'where', 'where\'s', 'which', 'while', 'who', 'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t', 'would', 'wouldn\'t',
  'you', 'you\'d', 'you\'ll', 'you\'re', 'you\'ve', 'your', 'yours', 'yourself', 'yourselves'
]);

export function extractTokens(text: string): string[] {
  return text.toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 2 && !STOPWORDS.has(token) && !/^\d+$/.test(token));
}

export function analyzeContent(htmlOrMarkdown: string, targetKeyword: string): ContentStats {
  // Extract text and headings
  const h1Matches = htmlOrMarkdown.match(/<h1[^>]*>([\s\S]*?)<\/h1>|^#\s+(.+)$/gim) || [];
  const h2Matches = htmlOrMarkdown.match(/<h2[^>]*>([\s\S]*?)<\/h2>|^##\s+(.+)$/gim) || [];
  const h3Matches = htmlOrMarkdown.match(/<h3[^>]*>([\s\S]*?)<\/h3>|^###\s+(.+)$/gim) || [];
  const h4Matches = htmlOrMarkdown.match(/<h4[^>]*>([\s\S]*?)<\/h4>|^####\s+(.+)$/gim) || [];

  // Plain text extraction
  const plainText = htmlOrMarkdown
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#*`_~\[\]]/g, ' ')
    .trim();

  const words = plainText.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const characterCount = plainText.length;
  const paragraphs = htmlOrMarkdown.split(/(?:\r?\n){2,}|<\/?p>/).filter(p => p.trim().length > 0);

  let keywordOccurrences = 0;
  if (targetKeyword.trim()) {
    const escaped = targetKeyword.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
    const matches = plainText.match(regex);
    keywordOccurrences = matches ? matches.length : 0;
  }

  const keywordDensity = wordCount > 0 ? Number(((keywordOccurrences / wordCount) * 100).toFixed(2)) : 0;

  return {
    wordCount,
    characterCount,
    headingCounts: {
      h1: h1Matches.length,
      h2: h2Matches.length,
      h3: h3Matches.length,
      h4: h4Matches.length,
    },
    paragraphCount: paragraphs.length,
    keywordOccurrences,
    keywordDensity,
  };
}
