import { Router, Request, Response } from 'express';

const router = Router();

// Heuristic caption scoring
function evaluateCaption(caption: string) {
  const text = caption.trim().toLowerCase();
  
  // 1. Clarity
  let clarity = 75;
  if (text.length === 0) clarity = 0;
  else if (text.length < 20) clarity = 50;
  else if (text.length > 500) clarity = 60;
  
  const hashtagCount = (caption.match(/#/g) || []).length;
  if (hashtagCount > 10) clarity -= (hashtagCount - 10) * 5;
  clarity = Math.max(20, Math.min(100, clarity));

  // 2. Curiosity
  let curiosity = 40;
  if (text.includes('?')) curiosity += 25;
  if (text.includes('...')) curiosity += 15;
  if (
    text.includes('secret') || 
    text.includes('reveal') || 
    text.includes('hidden') || 
    text.includes('illegal') ||
    text.includes('cheat')
  ) {
    curiosity += 20;
  }
  curiosity = Math.max(10, Math.min(100, curiosity));

  // 3. Searchability
  let searchability = 30;
  if (hashtagCount >= 1 && hashtagCount <= 5) searchability += 30;
  else if (hashtagCount > 5) searchability += 45;
  
  const keywords = ['how to', 'tip', 'tutorial', 'guide', 'best', 'review', 'hack', 'ai', 'coding', 'fitness', 'finance', 'learn'];
  let keywordMatch = 0;
  for (const kw of keywords) {
    if (text.includes(kw)) keywordMatch++;
  }
  searchability += keywordMatch * 12;
  searchability = Math.max(10, Math.min(100, searchability));

  // 4. Emotional Trigger
  let emotionalTrigger = 35;
  if (text.includes('!')) emotionalTrigger += 15;
  
  // Count emojis
  const emojiRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]|\p{Emoji_Presentation}|\p{Emoji}\uFE0F/gu;
  const emojiCount = (caption.match(emojiRegex) || []).length;
  if (emojiCount > 0) emotionalTrigger += Math.min(20, emojiCount * 5);
  
  const emotionalWords = ['amazing', 'crazy', 'shocking', 'mind-blowing', 'worst', 'best', 'free', 'save', 'win', 'fail', 'heart', 'love', 'hate', 'fear', 'lost'];
  let wordMatches = 0;
  for (const w of emotionalWords) {
    if (text.includes(w)) wordMatches++;
  }
  emotionalTrigger += wordMatches * 10;
  emotionalTrigger = Math.max(10, Math.min(100, emotionalTrigger));

  // 5. CTA Strength
  let ctaStrength = 20;
  const ctaWords = ['comment', 'link in bio', 'read more', 'click', 'subscribe', 'follow', 'save this', 'share', 'check out', '👇', 'tap'];
  let ctaMatch = false;
  for (const w of ctaWords) {
    if (text.includes(w)) {
      ctaStrength += 30;
      ctaMatch = true;
    }
  }
  if (ctaMatch) {
    if (text.includes('what do you') || text.includes('tell me') || text.includes('drop a')) {
      ctaStrength += 15;
    }
  }
  ctaStrength = Math.max(10, Math.min(100, ctaStrength));

  const score = Math.round((clarity + curiosity + searchability + emotionalTrigger + ctaStrength) / 5);

  return {
    score,
    clarity,
    curiosity,
    searchability,
    emotionalTrigger,
    ctaStrength
  };
}

const SUGGESTIONS_BANK: Record<string, string[]> = {
  'AI': [
    "The AI landscape is moving too fast. Here are 3 tools you need to know today to not get left behind 👇",
    "ChatGPT is just the tip of the iceberg. This new platform does 10x more in half the time. What are your thoughts?",
    "I automated my entire daily workflow using this simple script. Comment 'CODE' and I'll send you the Github link!"
  ],
  'Comedy': [
    "Me trying to explain my code to the client vs what it actually does. Relatable? 💀",
    "Corporate meetings that could have been a 1-line email. Tag that one coworker who loves scheduling these.",
    "POV: The intern pushes straight to production on a Friday afternoon."
  ],
  'Programming': [
    "Stop writing nested loops like this! Use this clean JavaScript one-liner instead. Save this for later 💾",
    "3 VS Code extensions you didn't know you needed. Number 2 is an absolute game changer!",
    "How to solve 90% of your programming bugs in 5 seconds. (Spoiler: it's not StackOverflow)"
  ],
  'Fitness': [
    "Try this core routine at the end of your next workout. 4 movements, 3 rounds, absolute burner! 🔥",
    "Stop doing endless crunches if you want to build a strong core. Focus on these 3 compound lifts instead.",
    "My go-to high-protein snack that helped me lose 10lbs in 30 days. Recipe details in description!"
  ],
  'Finance': [
    "Here is what $10,000 invested in index funds looks like after 10, 20, and 30 years. Let compound interest do the work 📈",
    "3 money traps you must avoid in your 20s if you want to build long-term wealth.",
    "The easiest way to automate your savings and investments. Set it once and watch it grow!"
  ],
  'Education': [
    "This mind-bending physics concept explains why time might not actually exist. Mind = blown 🤯",
    "The secret history behind this famous landmark they never write in history textbooks.",
    "Did you know this simple psychology trick can help you read body language instantly?"
  ],
  'Gaming': [
    "I completed this game on the hardest difficulty without taking a single hit. Rate this clip 1-10! 🎮",
    "3 secret easter eggs in Elden Ring that you definitely missed. Let me know if you found any of these!",
    "When the NPC goes rogue and ruins your entire speedrun..."
  ],
  'Lifestyle': [
    "How I organize my day to stay productive as a remote worker. Aesthetic desk setup tours included ☕",
    "A quiet morning vlog. Slow down, make coffee, and reset for the day ahead.",
    "Minimalist habits that completely changed my mental health and daily focus. What's your routine?"
  ]
};

router.post('/analyze', (req: Request, res: Response) => {
  const { caption } = req.body;
  if (caption === undefined) {
    return res.status(400).json({
      error: { code: 'INVALID_INPUT', message: 'Caption field is required' }
    });
  }
  const result = evaluateCaption(caption);
  return res.json(result);
});

router.post('/generate', (req: Request, res: Response) => {
  const { category } = req.body;
  if (!category) {
    return res.status(400).json({
      error: { code: 'INVALID_INPUT', message: 'Category is required' }
    });
  }

  const list = SUGGESTIONS_BANK[category] || SUGGESTIONS_BANK['AI'];
  return res.json({ suggestions: list });
});

export default router;
