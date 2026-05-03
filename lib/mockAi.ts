import { GradeResponse } from "@/lib/types";

export function mockAiGrade(answer: string): GradeResponse {
  const firstPhrase = answer.split(/[,.;]/)[0]?.trim().split(" ").slice(0, 8).join(" ") || "your opening";
  return {
    engine: "mock-ai",
    attribute_mapping: [
      { attribute: "Empathy", reason: "The scenario involves emotional pressure and requires a nonjudgmental response." },
      { attribute: "Ethical Reasoning", reason: "The candidate must balance compassion with honesty, safety, and fairness." },
      { attribute: "Communication Clarity", reason: "A strong answer needs to explain boundaries clearly without sounding punitive." },
      { attribute: "Problem-Solving / Judgment", reason: "The answer should move from listening to practical next steps." }
    ],
    evaluation:
      "This is mock AI feedback so you can test the app without paying for API tokens. The response shows a reasonable foundation, but a stronger answer would more clearly name the competing priorities, describe a private conversation, and offer realistic support options rather than only stating a general principle.",
    scores: [
      { attribute: "Empathy", score: 7, justification: "The answer shows concern, but could deepen emotional acknowledgment." },
      { attribute: "Ethical Reasoning", score: 6, justification: "The answer recognizes responsibility, but should more explicitly discuss trade-offs." },
      { attribute: "Communication Clarity", score: 7, justification: "The answer is understandable and direct." },
      { attribute: "Problem-Solving / Judgment", score: 6, justification: "The answer needs more stepwise action." }
    ],
    quartile: 3,
    improvements: [
      "State the emotional context first, then set the boundary.",
      "Add a specific support pathway, such as academic advising, supervisor guidance, or safety escalation when appropriate.",
      "Avoid sounding like the issue is simple; show that you understand uncertainty."
    ],
    highlights: {
      positive: [{ text: firstPhrase, reason: "This opening gives the evaluator something concrete to assess." }],
      negative: []
    },
    rewrites: [
      {
        original: firstPhrase,
        improved:
          "I would speak with them privately, acknowledge the pressure they are under, and explain that I cannot compromise the rules while helping them find legitimate support.",
        explanation:
          "This version combines empathy, a clear ethical boundary, and practical support, which moves the answer closer to Quartile 4."
      }
    ],
    weakness_patterns: ["needs clearer trade-off recognition", "needs more specific next steps"],
    cost_note: "Mock AI mode: no API key detected, so no tokens used."
  };
}
