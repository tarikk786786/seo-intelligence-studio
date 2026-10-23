export function countSyllables(word: string): number {
  word = word.toLowerCase().trim();
  if (word.length <= 3) return 1;
  word = word.replace(/(?:[^laeiouy]|ed|es|e)$/, '');
  word = word.replace(/^y/, '');
  const matches = word.match(/[aeiouy]{1,2}/g);
  return matches ? matches.length : 1;
}

export function calculateFleschReadingEase(text: string): { score: number; label: string } {
  const clean = text.trim();
  if (!clean) return { score: 0, label: 'No content' };

  const sentences = clean.split(/[.!?]+/).filter(Boolean);
  const sentenceCount = Math.max(1, sentences.length);
  const words = clean.split(/\s+/).filter(w => /[a-zA-Z0-9]/.test(w));
  const wordCount = Math.max(1, words.length);

  let totalSyllables = 0;
  for (const word of words) {
    totalSyllables += countSyllables(word);
  }

  // Flesch Reading Ease formula:
  // 206.835 - 1.015 * (total words / total sentences) - 84.6 * (total syllables / total words)
  const score = 206.835 - (1.015 * (wordCount / sentenceCount)) - (84.6 * (totalSyllables / wordCount));
  const clampedScore = Math.max(0, Math.min(100, Math.round(score)));

  let label = 'Standard';
  if (clampedScore >= 90) label = 'Very Easy';
  else if (clampedScore >= 80) label = 'Easy';
  else if (clampedScore >= 70) label = 'Fairly Easy';
  else if (clampedScore >= 60) label = 'Standard';
  else if (clampedScore >= 50) label = 'Fairly Difficult';
  else if (clampedScore >= 30) label = 'Difficult';
  else label = 'Very Confusing';

  return { score: clampedScore, label };
}
