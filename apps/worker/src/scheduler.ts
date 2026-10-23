import { db } from '../../../packages/database/src/client.ts';
import { GeminiSearchGroundingAdapter } from '../../../packages/provider-adapters/src/ai-visibility-adapter.ts';

export class DailyAiVisibilityScheduler {
  private geminiAdapter: GeminiSearchGroundingAdapter;
  private isRunning: boolean = false;

  constructor() {
    this.geminiAdapter = new GeminiSearchGroundingAdapter();
  }

  async runDailyRefreshCycle(): Promise<{ processed: number; errors: number }> {
    if (this.isRunning) {
      console.log('[Worker] Refresh cycle is already active. Skipping.');
      return { processed: 0, errors: 0 };
    }

    this.isRunning = true;
    console.log('[Worker] Starting Daily AI Visibility Refresh Cycle...');

    let processed = 0;
    let errors = 0;

    try {
      // Find all active prompts across brand spaces
      const activePrompts = await db.aiPrompt.findMany({
        where: { active: true },
        include: {
          brandSpace: {
            include: { competitors: true }
          }
        },
        take: 500 // bounded batch
      });

      console.log(`[Worker] Found ${activePrompts.length} active prompts to refresh.`);

      for (const prompt of activePrompts) {
        try {
          const compDomains = prompt.brandSpace.competitors.map((c: any) => c.domain);
          console.log(`[Worker] Executing prompt: "${prompt.promptText.slice(0, 40)}..." for brand: ${prompt.brandSpace.name}`);

          const res = await this.geminiAdapter.runGroundedTest({
            promptText: prompt.promptText,
            brandName: prompt.brandSpace.name,
            brandDomain: prompt.brandSpace.primaryDomain,
            competitorDomains: compDomains,
          });

          // Record observation in database
          const observation = await db.aiObservation.create({
            data: {
              aiPromptId: prompt.id,
              provider: res.provider,
              model: res.model,
              brandMentioned: res.brandMentioned,
              mentionCount: res.mentionCount,
              mentionContext: res.mentionContext,
              sentiment: res.sentiment,
              sentimentScore: res.sentimentScore,
              shareOfVoice: res.shareOfVoice,
              rawResponse: res.rawResponse,
            }
          });

          // Insert citations
          if (res.citations && res.citations.length > 0) {
            for (const cit of res.citations) {
              await db.citation.create({
                data: {
                  aiObservationId: observation.id,
                  citedUrl: cit.url,
                  domain: cit.domain,
                  title: cit.title,
                  isOwnBrand: cit.isOwnBrand,
                  isCompetitor: cit.isCompetitor,
                }
              });
            }
          }

          // Update prompt lastRunAt
          await db.aiPrompt.update({
            where: { id: prompt.id },
            data: { lastRunAt: new Date() }
          });

          processed++;
          // Rate-limiting backoff (delay 1.5 seconds between provider queries)
          await new Promise(r => setTimeout(r, 1500));
        } catch (promptErr: any) {
          console.error(`[Worker] Error processing prompt ${prompt.id}:`, promptErr.message);
          errors++;
        }
      }
    } catch (cycleErr: any) {
      console.error('[Worker] Fatal error in refresh cycle:', cycleErr.message);
    } finally {
      this.isRunning = false;
      console.log(`[Worker] Refresh cycle complete. Processed: ${processed}, Errors: ${errors}`);
    }

    return { processed, errors };
  }
}
