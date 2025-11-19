type EstimateResult = {
  timelineWeeks: number;
  budgetUSD: number;
  confidence: number;
  tags: string[];
  rationale: string;
};

const baseRates = [
  { tag: "ai", multiplier: 1.4 },
  { tag: "realtime", multiplier: 1.2 },
  { tag: "mobile", multiplier: 1.15 },
  { tag: "dashboard", multiplier: 1.1 },
  { tag: "ecommerce", multiplier: 1.25 },
];

const keywords: Record<string, string[]> = {
  ai: ["ai", "ml", "machine learning", "llm", "gpt"],
  realtime: ["websocket", "live", "chat", "stream"],
  mobile: ["mobile", "react native", "pwa"],
  dashboard: ["dashboard", "analytics", "admin"],
  ecommerce: ["checkout", "cart", "payment", "shop"],
};

export function estimateFromBrief(brief: string): EstimateResult {
  const normalized = brief.toLowerCase();
  const tags = Object.entries(keywords)
    .filter(([, terms]) => terms.some((term) => normalized.includes(term)))
    .map(([tag]) => tag);

  let timeline = 4;
  let budget = 8000;

  if (brief.length > 400) {
    timeline += 4;
    budget += 6000;
  } else if (brief.length > 200) {
    timeline += 2;
    budget += 3000;
  }

  tags.forEach((tag) => {
    const mod = baseRates.find((rate) => rate.tag === tag);
    if (mod) {
      budget *= mod.multiplier;
      timeline += 1;
    }
  });

  if (!tags.length) {
    tags.push("web-app");
  }

  return {
    timelineWeeks: Math.round(timeline),
    budgetUSD: Math.round(budget / 100) * 100,
    confidence: Math.max(0.6, 1 - tags.length * 0.05),
    tags,
    rationale: `Detected ${tags.join(", ")} scope in brief of ${
      brief.length
    } chars.`,
  };
}
