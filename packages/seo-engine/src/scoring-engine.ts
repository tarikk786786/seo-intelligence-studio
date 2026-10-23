import { analyzeContent, extractTokens } from './text-analyzer.js';
import { calculateFleschReadingEase } from './readability.js';

export interface CompetitorBenchmark {
  targetWordCount: number;
  minWordCount: number;
  maxWordCount: number;
  targetH2Count: number;
  recommendedEntities: Array<{
    term: string;
    importance: number; // 1 to 10
    targetMinFrequency: number;
    targetMaxFrequency: number;
  }>;
}

export interface OptimizationScoreBreakdown {
  totalScore: number; // 0 to 100
  keywordScore: number; // 0 to 25
  entityScore: number; // 0 to 35
  structureScore: number; // 0 to 20
  readabilityScore: number; // 0 to 20
  entityCoveragePercentage: number;
  readability: {
    score: number;
    label: string;
  };
  recommendations: string[];
}

export function computeOptimizationScore(
  content: string,
  targetKeyword: string,
  benchmark?: CompetitorBenchmark
): OptimizationScoreBreakdown {
  const stats = analyzeContent(content, targetKeyword);
  const plainText = content.replace(/<[^>]+>/g, ' ');
  const readability = calculateFleschReadingEase(plainText);

  const defaultBenchmark: CompetitorBenchmark = benchmark || {
    targetWordCount: 1500,
    minWordCount: 1000,
    maxWordCount: 2200,
    targetH2Count: 5,
    recommendedEntities: [
      { term: targetKeyword.toLowerCase(), importance: 10, targetMinFrequency: 3, targetMaxFrequency: 12 },
      { term: 'best practices', importance: 7, targetMinFrequency: 1, targetMaxFrequency: 4 },
      { term: 'optimization', importance: 8, targetMinFrequency: 2, targetMaxFrequency: 6 },
      { term: 'guide', importance: 6, targetMinFrequency: 1, targetMaxFrequency: 4 },
      { term: 'performance', importance: 7, targetMinFrequency: 1, targetMaxFrequency: 5 },
    ]
  };

  const recommendations: string[] = [];

  // 1. Keyword Score (0 - 25)
  let keywordScore = 0;
  if (stats.keywordOccurrences === 0) {
    recommendations.push(`Include target keyword "${targetKeyword}" in the content.`);
  } else if (stats.keywordDensity > 3.0) {
    keywordScore = 10;
    recommendations.push(`Keyword density (${stats.keywordDensity}%) is too high. Reduce target keyword repetition to avoid keyword stuffing.`);
  } else if (stats.keywordDensity >= 0.8 && stats.keywordDensity <= 2.5) {
    keywordScore = 25;
  } else {
    keywordScore = 18;
    recommendations.push(`Optimize keyword density (currently ${stats.keywordDensity}%, target 1.0% - 2.5%).`);
  }

  // 2. Structure Score (0 - 20)
  let structureScore = 0;
  const wordRatio = stats.wordCount / defaultBenchmark.targetWordCount;
  if (wordRatio >= 0.8 && wordRatio <= 1.3) {
    structureScore += 10;
  } else if (wordRatio >= 0.5) {
    structureScore += 6;
    recommendations.push(`Word count (${stats.wordCount}) is below target (${defaultBenchmark.targetWordCount}). Add more depth.`);
  } else {
    structureScore += 2;
    recommendations.push(`Substantial content needed: current ${stats.wordCount} words vs target ${defaultBenchmark.targetWordCount}.`);
  }

  if (stats.headingCounts.h1 === 1) {
    structureScore += 5;
  } else if (stats.headingCounts.h1 === 0) {
    recommendations.push('Add an H1 heading containing your target topic.');
  } else {
    recommendations.push('Use exactly one H1 heading for the document.');
    structureScore += 2;
  }

  if (stats.headingCounts.h2 >= 3) {
    structureScore += 5;
  } else {
    structureScore += Math.min(4, stats.headingCounts.h2 * 1.5);
    recommendations.push(`Add more subheadings (H2) to structure the document (currently ${stats.headingCounts.h2}, target 4+).`);
  }

  // 3. NLP Entity Coverage (0 - 35)
  const tokens = extractTokens(plainText);
  const tokenFreq = new Map<string, number>();
  for (const token of tokens) {
    tokenFreq.set(token, (tokenFreq.get(token) || 0) + 1);
  }

  let coveredCount = 0;
  for (const entity of defaultBenchmark.recommendedEntities) {
    const term = entity.term.toLowerCase();
    const count = plainText.toLowerCase().split(term).length - 1;
    if (count >= entity.targetMinFrequency) {
      coveredCount++;
    } else {
      recommendations.push(`Add recommended term "${entity.term}" (used ${count}/${entity.targetMinFrequency} times).`);
    }
  }

  const entityCoveragePercentage = defaultBenchmark.recommendedEntities.length > 0
    ? Math.round((coveredCount / defaultBenchmark.recommendedEntities.length) * 100)
    : 100;

  const entityScore = Math.round((entityCoveragePercentage / 100) * 35);

  // 4. Readability Score (0 - 20)
  // Optimal Flesch score is 60 - 75 (accessible to general audience)
  let readabilityScore = 0;
  if (readability.score >= 55 && readability.score <= 85) {
    readabilityScore = 20;
  } else if (readability.score >= 40 && readability.score < 55) {
    readabilityScore = 14;
    recommendations.push('Text is somewhat complex. Break down longer sentences to improve readability.');
  } else {
    readabilityScore = 8;
    recommendations.push(`Readability score (${readability.score} - ${readability.label}) needs improvement.`);
  }

  const totalScore = Math.min(100, keywordScore + entityScore + Math.round(structureScore) + readabilityScore);

  return {
    totalScore,
    keywordScore,
    entityScore,
    structureScore: Math.round(structureScore),
    readabilityScore,
    entityCoveragePercentage,
    readability,
    recommendations,
  };
}
