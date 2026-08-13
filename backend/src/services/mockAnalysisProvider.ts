import { AnalysisResult, VideoAnalysis, HookAnalysis, RetentionPoint, TimedNote, EmotionPoint, ShareabilityDetail, AudioDetail } from '../types/shared';
import { calculateVPI, classifyVPI } from './scoringEngine';

export interface AnalysisProvider {
  analyze(input: { filename: string; sizeBytes: number; durationSeconds?: number }): Promise<AnalysisResult>;
}

// 32-bit FNV-1a hash
function hashString(str: string): number {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return hash >>> 0;
}

// Mulberry32 generator
function seededRandom(seed: number) {
  return function() {
    let t = (seed += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const CATEGORIES = ['AI', 'Comedy', 'Programming', 'Fitness', 'Finance', 'Education', 'Gaming', 'Lifestyle'];

interface CategoryData {
  primaryMechanism: ShareabilityDetail['primaryMechanism'];
  hashtags: {
    niche: { name: string; relevance: number }[];
    medium: { name: string; relevance: number }[];
    broad: { name: string; relevance: number }[];
  };
  captions: string[];
  hookInsights: string[];
  hookRecommendations: string[];
  retentionDropNotes: string[];
  retentionStrongNotes: string[];
  prescriptions: string[];
  diagnosesLabels: string[];
}

const CATEGORY_MAP: Record<string, CategoryData> = {
  'AI': {
    primaryMechanism: 'UTILITY',
    hashtags: {
      niche: [
        { name: '#llmops', relevance: 88 },
        { name: '#localllm', relevance: 85 },
        { name: '#comfyui', relevance: 92 },
        { name: '#vectorsearch', relevance: 78 },
        { name: '#promptengineering', relevance: 94 }
      ],
      medium: [
        { name: '#aiadvancements', relevance: 80 },
        { name: '#artificialintelligence', relevance: 75 },
        { name: '#generativeai', relevance: 87 },
        { name: '#machinelearning', relevance: 82 },
        { name: '#futureoftech', relevance: 89 }
      ],
      broad: [
        { name: '#ai', relevance: 95 },
        { name: '#tech', relevance: 91 },
        { name: '#innovation', relevance: 84 },
        { name: '#automation', relevance: 79 },
        { name: '#coding', relevance: 76 }
      ]
    },
    captions: [
      "This new AI tool will literally save you 10 hours a week. Here's how to use it 👇",
      "I built a fully autonomous agent in 15 lines of code. The results are mind-blowing...",
      "Stop using ChatGPT like this. Use this secret prompt instead. Thank me later!"
    ],
    hookInsights: [
      "Visual change at {V}s matches perfectly with the vocal hook, introducing the AI dashboard instantly.",
      "Opening screenshot grabs attention by showing an impossible benchmark result in under {V}s.",
      "Direct address to the viewer at {V}s triggers a high curiosity gap regarding autonomous agents."
    ],
    hookRecommendations: [
      "Trim the first {R}s of intro chatter and show the AI tool interface immediately.",
      "Add a bold overlay text reading '10x Your Speed' within the first {R}s.",
      "Incorporate a dynamic audio sound effect at {R}s to highlight the key problem statement."
    ],
    retentionDropNotes: [
      "Visual pacing slowed down at {S}s while explaining code detail.",
      "High dropoff at {S}s during the environment setup screen.",
      "Slight viewer decay at {S}s when explaining the installation command."
    ],
    retentionStrongNotes: [
      "Excellent hook payoff at {S}s with the agent execution demo.",
      "Strong retention peak at {S}s showing the side-by-side speed comparison.",
      "Viewer interest spiked at {S}s when displaying the github repository link."
    ],
    prescriptions: [
      "Speed up the coding montage section by 1.5x.",
      "Add animated callouts highlighting the specific prompts you are typing.",
      "End with a clear, single Call-To-Action (e.g. 'Comment AGENT to get the source code!').",
      "Ensure backround track volume is lowered during the verbal explanation at {S}s."
    ],
    diagnosesLabels: ["Visual Hooks", "Code Clarity", "Information Pacing", "Audio Overlay", "Call-to-Action"]
  },
  'Comedy': {
    primaryMechanism: 'HUMOR',
    hashtags: {
      niche: [
        { name: '#officehumor', relevance: 91 },
        { name: '#developerproblems', relevance: 93 },
        { name: '#wfhlife', relevance: 84 },
        { name: '#meetingfail', relevance: 87 },
        { name: '#corporatehumor', relevance: 95 }
      ],
      medium: [
        { name: '#funnyreels', relevance: 88 },
        { name: '#relatable', relevance: 90 },
        { name: '#comedyvideos', relevance: 83 },
        { name: '#dailyhumor', relevance: 86 },
        { name: '#hilarious', relevance: 81 }
      ],
      broad: [
        { name: '#comedy', relevance: 94 },
        { name: '#funny', relevance: 96 },
        { name: '#joke', relevance: 78 },
        { name: '#lol', relevance: 85 },
        { name: '#meme', relevance: 92 }
      ]
    },
    captions: [
      "Me trying to debug a production error on Friday at 4:59 PM. Pls send help 💀",
      "That one coworker who always speaks in corporate jargon... you know who you are.",
      "POV: You joined a 'quick 5-minute sync' and it's now hour 3."
    ],
    hookInsights: [
      "The comedic facial expression in the first {V}s establishes high relatability.",
      "The text overlay 'POV: You are about to get fired' appears at {V}s and holds attention.",
      "Audio track triggers instant amusement at {V}s with a familiar comedic sound effect."
    ],
    hookRecommendations: [
      "Make the zoom-in on the character's reaction happen closer to {R}s.",
      "Shorten the initial reaction shot by {R}s to launch the joke faster.",
      "Place the text overlay at exactly {R}s to preempt the punchline."
    ],
    retentionDropNotes: [
      "Retention dropped at {S}s when the setup took too long to transition to the main joke.",
      "Minor viewer loss at {S}s when dialogue volume dipped slightly.",
      "Pacing plateaued at {S}s during the middle transition."
    ],
    retentionStrongNotes: [
      "Punchline landed perfectly at {S}s, resulting in a strong retention recovery.",
      "The unexpected zoom-in at {S}s successfully recaptured attention.",
      "Comedic sound effect sync at {S}s triggered high engagement."
    ],
    prescriptions: [
      "Apply quick jump-cuts during the buildup to speed up comedic timing.",
      "Boost the audio gain on the punchline by 2dB to emphasize the peak.",
      "Overlay subtitle text with custom funny emojis to reinforce key jokes.",
      "Shorten the awkward silence at the end by {S}s."
    ],
    diagnosesLabels: ["Comedic Timing", "Expression Closeness", "Audio Syncing", "Subtitling Style", "Ending Punch"]
  },
  'Programming': {
    primaryMechanism: 'UTILITY',
    hashtags: {
      niche: [
        { name: '#neovim', relevance: 85 },
        { name: '#rustlang', relevance: 91 },
        { name: '#typescripttips', relevance: 94 },
        { name: '#nextjs14', relevance: 89 },
        { name: '#gitcommands', relevance: 87 }
      ],
      medium: [
        { name: '#programming', relevance: 92 },
        { name: '#webdevelopment', relevance: 90 },
        { name: '#softwareengineering', relevance: 88 },
        { name: '#codelearning', relevance: 85 },
        { name: '#developerlife', relevance: 86 }
      ],
      broad: [
        { name: '#coding', relevance: 96 },
        { name: '#tech', relevance: 89 },
        { name: '#developer', relevance: 93 },
        { name: '#software', relevance: 85 },
        { name: '#computer', relevance: 72 }
      ]
    },
    captions: [
      "3 Git commands I wish I knew before writing production code. Save this for later! 💾",
      "Visual Studio Code settings that feel illegal to know. Part 1.",
      "Is Rust really better than C++? Let's settle this debate once and for all."
    ],
    hookInsights: [
      "Code window zoom at {V}s establishes technical authority immediately.",
      "Vocal hook 'This command feels illegal' at {V}s creates an excellent curiosity gap.",
      "High-contrast terminal colors at {V}s draw the eye immediately to the syntax change."
    ],
    hookRecommendations: [
      "Show the console output of the broken script in the first {R}s.",
      "Use syntax highlighting with higher contrast at {R}s for readability on small screens.",
      "Shorten the intro to under {R}s and go straight to the first command."
    ],
    retentionDropNotes: [
      "Viewers scrolled away at {S}s when explaining the secondary edge cases.",
      "Dropoff detected at {S}s when typing code in real-time (recommend speed-up).",
      "Minor decay at {S}s during the explanation of config files."
    ],
    retentionStrongNotes: [
      "Viewer spike at {S}s when the terminal command ran successfully.",
      "Excellent retention at {S}s showing the side-by-side terminal before/after.",
      "High interest at {S}s when displaying the final configuration file."
    ],
    prescriptions: [
      "Speed up typing segments by 300% or cut directly to the completed block.",
      "Use arrows or glowing borders to highlight the specific code line being modified.",
      "Add a visual comparison showing how the old way took 10 lines and the new way takes 1.",
      "Create a stronger closing CTA encouraging viewers to save the tip."
    ],
    diagnosesLabels: ["Terminal Readability", "Coding Pacing", "Syntax Highlights", "Curiosity Framing", "Value Delivery"]
  },
  'Fitness': {
    primaryMechanism: 'ASPIRATION',
    hashtags: {
      niche: [
        { name: '#calisthenicsprogression', relevance: 89 },
        { name: '#zone2cardio', relevance: 82 },
        { name: '#progressiveoverload', relevance: 92 },
        { name: '#mealprepsunday', relevance: 88 },
        { name: '#hypertrophy', relevance: 85 }
      ],
      medium: [
        { name: '#fitnessgoals', relevance: 91 },
        { name: '#workoutmotivation', relevance: 95 },
        { name: '#gymlife', relevance: 89 },
        { name: '#healthylifestyle', relevance: 87 },
        { name: '#fitfam', relevance: 80 }
      ],
      broad: [
        { name: '#fitness', relevance: 96 },
        { name: '#workout', relevance: 93 },
        { name: '#gym', relevance: 94 },
        { name: '#health', relevance: 86 },
        { name: '#motivation', relevance: 91 }
      ]
    },
    captions: [
      "Do this 10-minute abdominal routine every morning for 30 days. No equipment needed! 😤",
      "The truth about progressive overload that fitness influencers aren't telling you.",
      "My favorite high-protein meal prep that takes less than 20 minutes to make."
    ],
    hookInsights: [
      "High-energy movement in the first {V}s grabs visual attention immediately.",
      "The overlay 'Stop Doing Situps' at {V}s disrupts conventional fitness beliefs.",
      "Sync of high-tempo background beat at {V}s creates an energetic mood."
    ],
    hookRecommendations: [
      "Put the final body transformation frame at the very beginning ({R}s) as a teaser.",
      "Transition from setup to the first exercise by {R}s.",
      "Overlay the specific muscle group name at {R}s to qualify the audience."
    ],
    retentionDropNotes: [
      "Audience drop at {S}s during the detailed anatomy explanation.",
      "Minor decay at {S}s when describing the sets/reps breakdown.",
      "Retention dropped at {S}s as the exercise form was repeated without variation."
    ],
    retentionStrongNotes: [
      "Retention spiked at {S}s during the high-speed montage showing form mistakes.",
      "Viewer attention peaked at {S}s during the meal macro breakdown.",
      "Strong interest at {S}s showing the side-by-side progression photo."
    ],
    prescriptions: [
      "Incorporate a countdown timer overlay in the corner for each exercise.",
      "Lower the background music track during spoken instructions at {S}s.",
      "Ensure your full body is visible in the frame during the dynamic movements.",
      "Use text badges to show calorie/macro counts directly on screen."
    ],
    diagnosesLabels: ["Movement Energy", "Form Visibility", "Workout Pacing", "Macro Overlays", "Inspirational Cueing"]
  },
  'Finance': {
    primaryMechanism: 'UTILITY',
    hashtags: {
      niche: [
        { name: '#dividendgrowth', relevance: 90 },
        { name: '#indexfundinvesting', relevance: 92 },
        { name: '#rothira', relevance: 95 },
        { name: '#highyieldsavings', relevance: 88 },
        { name: '#budgeting101', relevance: 84 }
      ],
      medium: [
        { name: '#personalfinance', relevance: 94 },
        { name: '#investingforbeginners', relevance: 91 },
        { name: '#financialfreedom', relevance: 93 },
        { name: '#wealthbuilding', relevance: 89 },
        { name: '#moneytips', relevance: 87 }
      ],
      broad: [
        { name: '#money', relevance: 96 },
        { name: '#finance', relevance: 95 },
        { name: '#investing', relevance: 92 },
        { name: '#wealth', relevance: 88 },
        { name: '#saving', relevance: 85 }
      ]
    },
    captions: [
      "How I turned $100 a month into a six-figure retirement portfolio. Step-by-step 📈",
      "3 financial habits keeping you poor (and how to fix them today).",
      "Why you should stop saving money in a traditional bank account immediately."
    ],
    hookInsights: [
      "Display of stock charts or account balances at {V}s establishes high curiosity.",
      "Vocal claim 'Banks are lying to you' at {V}s creates an immediate emotional hook.",
      "Visual display of cash or ledger at {V}s establishes financial theme instantly."
    ],
    hookRecommendations: [
      "Place a high-contrast chart of returns at the very start ({R}s).",
      "Shorten the definition of terms to start with the payoff within {R}s.",
      "Overlay 'Retire Early' text within the first {R}s."
    ],
    retentionDropNotes: [
      "Viewers drop at {S}s when explaining tax-code nuances (e.g. 529 rules).",
      "Declining attention at {S}s during spreadsheet calculations.",
      "Decay at {S}s while displaying static legal disclaimers."
    ],
    retentionStrongNotes: [
      "Viewer spike at {S}s when showing the compounding calculator screen.",
      "High retention at {S}s when summarizing the exact 3-step action plan.",
      "Attention recovery at {S}s showing the automated app deposits."
    ],
    prescriptions: [
      "Simplify charts by using fewer columns and larger numbers.",
      "Use animated arrows to highlight compound interest growth points.",
      "Verbally repeat: 'This is not financial advice' briefly, but don't stall pacing.",
      "Introduce a quiz-style question at {S}s to increase comment replies."
    ],
    diagnosesLabels: ["Curiosity Framing", "Chart Simplicity", "Value Timeliness", "Disclaimer Blending", "Actionability"]
  },
  'Education': {
    primaryMechanism: 'SURPRISE',
    hashtags: {
      niche: [
        { name: '#quantumphysics', relevance: 86 },
        { name: '#historyfacts', relevance: 93 },
        { name: '#psychologyhacks', relevance: 95 },
        { name: '#speedreading', relevance: 81 },
        { name: '#spacex', relevance: 84 }
      ],
      medium: [
        { name: '#learnonyoutube', relevance: 88 },
        { name: '#sciencefacts', relevance: 91 },
        { name: '#educational', relevance: 90 },
        { name: '#knowledgesharing', relevance: 86 },
        { name: '#mindblown', relevance: 92 }
      ],
      broad: [
        { name: '#education', relevance: 94 },
        { name: '#learning', relevance: 93 },
        { name: '#science', relevance: 92 },
        { name: '#history', relevance: 89 },
        { name: '#facts', relevance: 95 }
      ]
    },
    captions: [
      "This mind-bending paradox will completely change how you view time. ⏳",
      "The bizarre historical event they never taught you in school.",
      "3 psychological tricks to read people instantly (use with caution)."
    ],
    hookInsights: [
      "A mysterious question asked at {V}s stimulates high cognitive curiosity.",
      "A striking historical painting or graphic shown at {V}s creates visual intrigue.",
      "Sound effects simulate a clocks-ticking at {V}s, syncing with the timeline theme."
    ],
    hookRecommendations: [
      "Lead with the bizarre fact/paradox in the first {R}s rather than background context.",
      "Increase voice clarity and projection in the opening hook around {R}s.",
      "Add a visual timeline graphic at {R}s to anchor the historical setting."
    ],
    retentionDropNotes: [
      "Slight drop at {S}s during the citation of dates and historical figures.",
      "Viewer decay at {S}s when explaining the biological theory mechanism.",
      "Pacing dropoff at {S}s when reading a long quote from a book."
    ],
    retentionStrongNotes: [
      "Spike in retention at {S}s when the resolution of the paradox was revealed.",
      "High engagement at {S}s showing the microscopic animation footage.",
      "Viewer interest peaked at {S}s during the diagram illustration."
    ],
    prescriptions: [
      "Use rich stock animations instead of static graphics for complex concepts.",
      "Keep spoken descriptions of technical words simple, under 5 seconds each.",
      "Ensure captions are highlighted in yellow whenever 'mind-blowing' facts are spoken.",
      "Add a final question: 'What topic should we explore next?' to encourage feedback."
    ],
    diagnosesLabels: ["Intrigue Setup", "Concept Simplicity", "Visual Anchoring", "Story Arc Pacing", "Interactive Ending"]
  },
  'Gaming': {
    primaryMechanism: 'SURPRISE',
    hashtags: {
      niche: [
        { name: '#eldenringclips', relevance: 90 },
        { name: '#speedrunfail', relevance: 87 },
        { name: '#steamdecktips', relevance: 83 },
        { name: '#indiegamedev', relevance: 88 },
        { name: '#fpsgames', relevance: 85 }
      ],
      medium: [
        { name: '#gamingshorts', relevance: 93 },
        { name: '#gamingmoments', relevance: 91 },
        { name: '#gameplay', relevance: 89 },
        { name: '#letplay', relevance: 82 },
        { name: '#gamerlife', relevance: 90 }
      ],
      broad: [
        { name: '#gaming', relevance: 96 },
        { name: '#gamer', relevance: 95 },
        { name: '#games', relevance: 92 },
        { name: '#playstation', relevance: 84 },
        { name: '#xbox', relevance: 81 }
      ]
    },
    captions: [
      "I spent 50 hours trying to beat this boss. What happens at the end is insane! 🎮",
      "The rarest easter eggs hidden in open world games that you definitely missed.",
      "POV: When the NPC is actually smarter than you."
    ],
    hookInsights: [
      "High-action gameplay sequence at {V}s creates an immediate dopamine hit.",
      "The text overlay 'This boss is impossible' at {V}s hooks core gamers.",
      "High-energy voiceover reaction at {V}s establishes high engagement."
    ],
    hookRecommendations: [
      "Cut the menu screens and start directly in the battle montage at {R}s.",
      "Enlarge the facecam box at {R}s to make player reactions more visible.",
      "Sync the first weapon hit at {R}s to the drop of the background track."
    ],
    retentionDropNotes: [
      "Dropoff at {S}s when explaining weapon stats and menu configurations.",
      "Minor viewer loss at {S}s during the repeating running segment.",
      "Pacing decayed at {S}s when reviewing long update patch notes."
    ],
    retentionStrongNotes: [
      "Spike at {S}s showing the near-death escape moment.",
      "Viewer peak at {S}s with the final, successful boss strike.",
      "High engagement at {S}s showing the rare loot reward."
    ],
    prescriptions: [
      "Apply rapid zooms on the facecam during intense gameplay moments.",
      "Add red circles/arrows pointing to hidden secrets on the game screen.",
      "Incorporate sound effects (e.g. hit markers, memes) to punch up jokes.",
      "Ask viewers to comment their own high scores at the end."
    ],
    diagnosesLabels: ["Action Hook", "React Visuality", "Gameplay Pacing", "Clutter Controls", "Reward Payoff"]
  },
  'Lifestyle': {
    primaryMechanism: 'ASPIRATION',
    hashtags: {
      niche: [
        { name: '#morningroutine', relevance: 92 },
        { name: '#minimalistliving', relevance: 85 },
        { name: '#solotraveler', relevance: 88 },
        { name: '#desksetup', relevance: 91 },
        { name: '#vlog', relevance: 90 }
      ],
      medium: [
        { name: '#aesthetics', relevance: 93 },
        { name: '#lifestyleblog', relevance: 87 },
        { name: '#dailyvlog', relevance: 89 },
        { name: '#creativity', relevance: 84 },
        { name: '#organization', relevance: 82 }
      ],
      broad: [
        { name: '#lifestyle', relevance: 95 },
        { name: '#vlog', relevance: 94 },
        { name: '#aesthetic', relevance: 96 },
        { name: '#travel', relevance: 91 },
        { name: '#setup', relevance: 88 }
      ]
    },
    captions: [
      "A realistic 6 AM morning routine of a remote software developer living in Tokyo. ☕",
      "How I decluttered my entire life to fit into a single backpack.",
      "Building my dream desk setup. Everything is linked in my bio!"
    ],
    hookInsights: [
      "Beautiful aesthetic shot of morning coffee pouring at {V}s sets a cozy mood.",
      "Calm lofi audio sync at {V}s establishes high visual appeal.",
      "POV camera angle at {V}s draws the viewer directly into the environment."
    ],
    hookRecommendations: [
      "Use warmer lighting in the initial sequence at {R}s.",
      "Add a soft, minimal title overlay (e.g., '6:00 AM') at {R}s.",
      "Sync the transition from bed to desk at {R}s with the audio sweep."
    ],
    retentionDropNotes: [
      "Viewer decay at {S}s during the static cleaning/sweeping shot.",
      "Dropoff detected at {S}s when explaining the journal writing details.",
      "Minor drop at {S}s when the screen was dark for too long."
    ],
    retentionStrongNotes: [
      "Spike at {S}s showing the finished aesthetic desk setup setup.",
      "High retention at {S}s with the cozy travel montage overview.",
      "Viewer attention peaked at {S}s during the product unboxing reveal."
    ],
    prescriptions: [
      "Apply color-grading filters to create a cohesive, pastel look.",
      "Speed up laundry or clean-up tasks by 4x to maintain pacing.",
      "Add soft ASMR sound effects (e.g., page-turning, coffee-dripping).",
      "Close with a calming message asking viewers how their morning started."
    ],
    diagnosesLabels: ["Aesthetic Balance", "ASMR Audio Sync", "Lighting Warmth", "Task Pacing", "Atmospheric Vibe"]
  }
};

export class MockAnalysisProvider implements AnalysisProvider {
  async analyze(input: { filename: string; sizeBytes: number; durationSeconds?: number }): Promise<AnalysisResult> {
    const combinedKey = `${input.filename}_${input.sizeBytes}`;
    const hash = hashString(combinedKey);
    const rand = seededRandom(hash);

    // Derive category
    const catIndex = Math.floor(rand() * CATEGORIES.length);
    const category = CATEGORIES[catIndex];
    const catData = CATEGORY_MAP[category] || CATEGORY_MAP['AI'];

    // Generate scores (generally 55-95)
    const hookStrength = Math.round(60 + rand() * 35);
    const retentionPotential = Math.round(55 + rand() * 40);
    const shareability = Math.round(58 + rand() * 37);
    const engagementPotential = Math.round(62 + rand() * 33);
    const trendAlignment = Math.round(50 + rand() * 45);
    const contentQuality = Math.round(65 + rand() * 30);
    const audioVisualQuality = Math.round(68 + rand() * 28);

    const scores: VideoAnalysis = {
      hookStrength,
      retentionPotential,
      shareability,
      engagementPotential,
      trendAlignment,
      contentQuality,
      audioVisualQuality,
    };

    // Calculate VPI and classification
    const vpi = calculateVPI(scores);
    const classification = classifyVPI(vpi);

    // Breakdown scores mapped to UI cards
    const breakdown = {
      hookStrength,
      retentionPotential,
      shareability,
      emotionalImpact: contentQuality, // Maps emotionalImpact to contentQuality
      trendAlignment,
      visualQuality: audioVisualQuality, // Maps visualQuality to audioVisualQuality
      audioQuality: Math.round(audioVisualQuality - 5 + rand() * 10), // slightly offset
      engagementPotential,
    };

    // Keep audioQuality in bounds
    breakdown.audioQuality = Math.max(0, Math.min(100, breakdown.audioQuality));

    // Fill placeholders in templates
    const firstVisualChangeSeconds = parseFloat((0.2 + rand() * 0.8).toFixed(1));
    const firstSpeechMomentSeconds = parseFloat((0.6 + rand() * 1.2).toFixed(1));
    const timeToValueSeconds = parseFloat((2.0 + rand() * 2.0).toFixed(1));
    const trimAmount = parseFloat((0.4 + rand() * 1.1).toFixed(1));

    const vPlaceholder = firstVisualChangeSeconds.toString();
    const rPlaceholder = trimAmount.toString();

    // Hook analysis
    const hookTemplate = catData.hookInsights[Math.floor(rand() * catData.hookInsights.length)];
    const hookRecTemplate = catData.hookRecommendations[Math.floor(rand() * catData.hookRecommendations.length)];

    const hookInsight = hookTemplate.replace('{V}', vPlaceholder);
    const hookRecommendation = hookRecTemplate.replace('{R}', rPlaceholder);

    const hookTimeline = Array.from({ length: 6 }, (_, i) => ({
      second: i * 0.5,
      engagementPotential: Math.round(hookStrength - (i * i * 3) + rand() * 15)
    })).map(pt => ({ ...pt, engagementPotential: Math.max(0, Math.min(100, pt.engagementPotential)) }));

    const signals: ('Low' | 'Medium' | 'High')[] = ['Low', 'Medium', 'High'];
    const hook: HookAnalysis = {
      score: hookStrength,
      timeline: hookTimeline,
      firstVisualChangeSeconds,
      firstSpeechMomentSeconds,
      curiositySignal: signals[Math.floor(rand() * 2) + 1], // Medium or High
      movementDetection: signals[Math.floor(rand() * 3)],
      timeToValueSeconds,
      insight: hookInsight,
      recommendation: hookRecommendation
    };

    // Duration defaults to 30s if not specified
    const duration = input.durationSeconds || Math.max(10, Math.min(60, Math.round(input.sizeBytes / (1024 * 1024) * 5))) || 30;

    // Retention curve
    const points: RetentionPoint[] = [];
    for (let s = 0; s <= duration; s += Math.max(1, Math.round(duration / 10))) {
      // decline curve
      const decay = Math.pow(0.97 - (rand() * 0.02), s);
      const retentionPercent = Math.round(100 * decay * (retentionPotential / 100));
      points.push({ second: s, retentionPercent: Math.max(5, Math.min(100, retentionPercent)) });
    }

    const dropSecond = Math.round(duration * 0.3 + rand() * duration * 0.4);
    const strongSecond = Math.round(duration * 0.1 + rand() * duration * 0.2);

    const dropTemplate = catData.retentionDropNotes[Math.floor(rand() * catData.retentionDropNotes.length)];
    const strongTemplate = catData.retentionStrongNotes[Math.floor(rand() * catData.retentionStrongNotes.length)];

    const dropOffPoints: TimedNote[] = [{
      second: dropSecond,
      note: dropTemplate.replace('{S}', dropSecond.toString())
    }];

    const strongPoints: TimedNote[] = [{
      second: strongSecond,
      note: strongTemplate.replace('{S}', strongSecond.toString())
    }];

    // Emotions over time
    const emotions: EmotionPoint[] = Array.from({ length: 5 }, (_, i) => {
      const second = Math.round((duration / 4) * i);
      return {
        second,
        curiosity: Math.round(40 + rand() * 50),
        excitement: Math.round(30 + rand() * 60),
        humor: category === 'Comedy' ? Math.round(60 + rand() * 40) : Math.round(10 + rand() * 50),
        surprise: Math.round(20 + rand() * 70),
      };
    });

    // Shareability detail
    const shareabilityDetail: ShareabilityDetail = {
      score: shareability,
      relatability: Math.round(55 + rand() * 40),
      friendSendPotential: Math.round(60 + rand() * 35),
      conversationPotential: Math.round(50 + rand() * 45),
      emotionalTrigger: Math.round(55 + rand() * 40),
      utility: category === 'Programming' || category === 'AI' || category === 'Finance' ? Math.round(75 + rand() * 25) : Math.round(30 + rand() * 50),
      primaryMechanism: catData.primaryMechanism,
    };

    // Trend radar
    const trendRadarCategories = CATEGORIES.map(name => {
      const base = name === category ? 85 : 30;
      return {
        name,
        alignmentScore: Math.round(base + rand() * 15),
      };
    }).sort((a, b) => b.alignmentScore - a.alignmentScore);

    // Audio detail
    const audio: AudioDetail = {
      audioQuality: breakdown.audioQuality,
      voiceClarity: Math.round(65 + rand() * 30),
      energy: Math.round(60 + rand() * 35),
      backgroundNoise: Math.round(10 + rand() * 30), // Lower is better in visual but here score represents rating (higher is better cleaner)
      beatSync: Math.round(50 + rand() * 45),
      trendAlignment: Math.round(45 + rand() * 50),
    };

    // Video doctor
    const doctorRatings = ['Weak', 'Needs Improvement', 'Strong', 'Excellent'];
    const diagnosis = catData.diagnosesLabels.map((lbl, idx) => {
      // decide rating based on scores
      let scoreForRating = hookStrength;
      if (lbl.includes('Visual') || lbl.includes('Visibility')) scoreForRating = audioVisualQuality;
      if (lbl.includes('Pacing') || lbl.includes('Clarity')) scoreForRating = retentionPotential;
      if (lbl.includes('Audio')) scoreForRating = audio.audioQuality;
      if (lbl.includes('Punch') || lbl.includes('Action')) scoreForRating = shareability;

      let rIndex = 2; // Strong
      if (scoreForRating >= 85) rIndex = 3; // Excellent
      else if (scoreForRating >= 65) rIndex = 2; // Strong
      else if (scoreForRating >= 40) rIndex = 1; // Needs Improvement
      else rIndex = 0; // Weak

      return {
        label: lbl,
        rating: doctorRatings[rIndex],
      };
    });

    const prescription = catData.prescriptions.map(p => p.replace('{S}', strongSecond.toString()));

    // Recommendations list (used in report and dashboard highlights)
    const recommendations = [
      hook.recommendation,
      `Improve retention at ${dropSecond}s: Introduce a visual cut or secondary caption payload.`,
      prescription[0],
      prescription[1]
    ];

    // Seed caption
    const defaultCaption = catData.captions[Math.floor(rand() * catData.captions.length)];

    return {
      id: `analysis_${hash}`,
      vpi,
      classification,
      category,
      scores,
      breakdown,
      hook,
      retention: {
        points,
        dropOffPoints,
        strongPoints
      },
      emotions,
      shareability: shareabilityDetail,
      trendAlignment: {
        topCategory: category,
        categories: trendRadarCategories
      },
      audio,
      videoDoctor: {
        diagnosis,
        prescription
      },
      recommendations,
      caption: {
        current: defaultCaption
      },
      createdAt: new Date().toISOString()
    };
  }
}
