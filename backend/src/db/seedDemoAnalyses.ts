import { MockAnalysisProvider } from '../services/mockAnalysisProvider';
import { usersRepo, videosRepo, analysesRepo } from './repositories';

export const DEMO_FILES = [
  { filename: 'programming-reel-vscode-tips.mp4', sizeBytes: 15420000, durationSeconds: 28 },
  { filename: 'comedy-reel-office-fail.mp4', sizeBytes: 24100000, durationSeconds: 35 },
  { filename: 'fitness-reel-30day-abs.mp4', sizeBytes: 18900000, durationSeconds: 42 },
  { filename: 'ai-reel-chatgpt-hack.mp4', sizeBytes: 12500000, durationSeconds: 22 },
  { filename: 'education-reel-history-fact.mp4', sizeBytes: 29800000, durationSeconds: 58 }
];

export async function seedDemoData() {
  console.log('Seeding demo analyses...');
  const provider = new MockAnalysisProvider();
  
  try {
    // 1. Get or create demo user
    const demoUser = await usersRepo.getOrCreateDemoUser();
    console.log(`Demo user active: ${demoUser.email} (${demoUser.id})`);

    // 2. Process and save each demo file
    for (const file of DEMO_FILES) {
      const analysisResult = await provider.analyze({
        filename: file.filename,
        sizeBytes: file.sizeBytes,
        durationSeconds: file.durationSeconds
      });

      // Create video record
      const video = await videosRepo.create(demoUser.id, file.filename, file.durationSeconds);
      
      // Create analysis record (linking video id)
      await analysesRepo.create(video.id, analysisResult.vpi, analysisResult.classification, {
        ...analysisResult,
        createdAt: video.created_at // match the dates
      });
      
      console.log(`Seeded: "${file.filename}" with VPI ${analysisResult.vpi} [${analysisResult.classification}]`);
    }
    
    console.log('✅ Demo seeding completed.');
  } catch (err) {
    console.error('❌ Seeding failed:', err);
  }
}

// Run standalone if executed directly
if (require.main === module) {
  seedDemoData().then(() => process.exit(0));
}
