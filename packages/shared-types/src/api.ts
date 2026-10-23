import { z } from 'zod';

export const CreateBrandSpaceSchema = z.object({
  name: z.string().min(2).max(100),
  primaryDomain: z.string().min(3).max(255),
  targetCountry: z.string().default('US'),
  targetLanguage: z.string().default('en'),
  competitorDomains: z.array(z.string()).default([]),
  brandTone: z.string().optional(),
});

export const CreateDocumentSchema = z.object({
  brandSpaceId: z.string(),
  title: z.string().min(1).max(255),
  targetKeyword: z.string().min(1).max(150),
  initialContent: z.string().optional(),
});

export const CreateAiPromptSchema = z.object({
  brandSpaceId: z.string(),
  promptText: z.string().min(5).max(500),
  topicCategory: z.string().default('general'),
  provider: z.enum(['GEMINI_SEARCH', 'OPENAI_SEARCH', 'AUTO']).default('AUTO'),
});

export const CreateSerpAnalysisSchema = z.object({
  brandSpaceId: z.string(),
  keyword: z.string().min(1).max(200),
  country: z.string().default('US'),
  language: z.string().default('en'),
  device: z.enum(['desktop', 'mobile']).default('desktop'),
});

export type CreateBrandSpaceInput = z.infer<typeof CreateBrandSpaceSchema>;
export type CreateDocumentInput = z.infer<typeof CreateDocumentSchema>;
export type CreateAiPromptInput = z.infer<typeof CreateAiPromptSchema>;
export type CreateSerpAnalysisInput = z.infer<typeof CreateSerpAnalysisSchema>;
