import { GradeResponse } from "@/lib/types";

const positiveSignals = [
  "understand",
  "listen",
  "private",
  "support",
  "ask",
  "clarify",
  "safety",
  "policy",
  "document",
  "supervisor",
  "respect",
  "confidential"
];

const weakSignals = [
  "obviously",
  "always",
  "never",
  "immediately report",
  "tell on",
  "wrong",
  "punish"
];

function findSignals(answer: string, signals: string[]) {
  const lower = answer.toLowerCase();
  return signals
    .filter((s) => lower.includes(s))
    .slice(0, 4)
    .map((s) => {
      const index = lower.indexOf(s);
      return answer.slice(index, index + s.length);
    });
}

export function gradeWithRules(answer: string): GradeResponse {
  const words = answer.trim().split(/\s+/).filter(Boolean).length;
  const positives = findSignals(answer, positiveSignals);
  const negatives = findSignals(answer, weakSignals);

  let base = 4;
  if (words >= 80) base += 1;
  if (words >= 140) base += 1;
  if (positives.length >= 3) base += 1;
  if (negatives.length > 0) base -= 1;

  const score = Math.max(1, Math.min(8, base));
  const quartile = score >= 7 ? 3 : score >= 5 ? 2 : 1;

  return {
    engine: "rule",
    attribute_mapping: [
      { attribute: "Empathy", reason: "Most CASPer scenarios require acknowledging emotions and pressure before acting." },
      { attribute: "Ethical Reasoning", reason: "The response must balance fairness, safety, confidentiality, and responsibility." },
      { attribute: "Problem-Solving / Judgment", reason: "A strong answer needs realistic next steps, not just values." }
    ],
    evaluation:
      words < 80
        ? "This answer is quite brief. It may show the right intention, but it needs more context, stakeholder awareness, and realistic next steps."
        : "This answer shows a reasonable structure. To improve, it should include more specific actions, trade-offs, and stakeholder perspectives.",
    scores: [
      { attribute: "Empathy", score, justification: "Rule-based estimate based on supportive language and perspective-taking signals." },
      { attribute: "Ethical Reasoning", score: Math.max(1, score - 1), justification: "Rule-based estimate based on whether the answer mentions safety, policy, or fairness." },
      { attribute: "Problem-Solving / Judgment", score, justification: "Rule-based estimate based on answer length and action-oriented wording." }
    ],
    quartile: quartile as 1 | 2 | 3 | 4,
    improvements: [
      "Name the competing priorities instead of only saying what is right or wrong.",
      "Add a realistic sequence: speak privately, gather context, follow policy, escalate only when needed.",
      "Use one sentence that acknowledges how the other person may be feeling."
    ],
    highlights: {
      positive: positives.map((text) => ({ text, reason: "This suggests empathy, safety awareness, or practical judgment." })),
      negative: negatives.map((text) => ({ text, reason: "This can sound rigid, judgmental, or overly simplistic." }))
    },
    rewrites: negatives.length
      ? negatives.map((text) => ({
          original: text,
          improved: "I would first understand the context while keeping safety and fairness in mind.",
          explanation: "This sounds less judgmental and shows balanced reasoning."
        }))
      : [
          {
            original: "General response",
            improved: "I would speak with them privately, acknowledge the pressure they are facing, and explain that I cannot participate in academic dishonesty while helping them find legitimate support.",
            explanation: "This adds empathy, boundary-setting, and a practical alternative."
          }
        ],
    weakness_patterns: [
      words < 80 ? "underdeveloped response" : "needs more specificity",
      negatives.length ? "overly rigid wording" : "limited stakeholder analysis"
    ],
    cost_note: "Free-tier rule engine: no AI tokens used."
  };
}
