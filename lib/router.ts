import { gradeWithRules } from "@/lib/ruleEngine";
import { gradeWithAi } from "@/lib/aiEngine";
import { UserTier } from "@/lib/types";

export async function routeGradingRequest(params: {
  tier: UserTier;
  scenario: string;
  question: string;
  answer: string;
  forceAi?: boolean;
}) {
  const answer = params.answer.trim();

  if (!answer || answer.length < 20) {
    return gradeWithRules(answer);
  }

  // Free tier = rule engine only, unless forceAi is enabled for demo/testing.
  if (params.tier === "free" && !params.forceAi) {
    return gradeWithRules(answer);
  }

  return gradeWithAi({ scenario: params.scenario, question: params.question, answer });
}
