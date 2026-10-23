import { DailyAiVisibilityScheduler } from './scheduler.js';

const scheduler = new DailyAiVisibilityScheduler();

console.log('====================================================');
console.log('  SEO Intelligence Studio - Durable Background Worker');
console.log('  Mode: Persistent Scheduled Prompt Runner');
console.log('====================================================');

// Run initial cycle on boot if scheduled
scheduler.runDailyRefreshCycle();

// Run every 24 hours (86,400,000 ms)
const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
setInterval(() => {
  console.log('[Worker] Scheduled 24-hour interval triggered.');
  scheduler.runDailyRefreshCycle();
}, TWENTY_FOUR_HOURS);
