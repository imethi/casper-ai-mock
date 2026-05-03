export type UserTier = "free" | "pro";

export type Scenario = {
  id: string;
  title: string;
  category: string;
  scenario: string;
  question: string;
  free: boolean;
};

export type Highlight = {
  text: string;
  reason: string;
};

export type GradeResponse = {
  engine: "rule" | "ai" | "mock-ai";
  attribute_mapping: { attribute: string; reason: string }[];
  evaluation: string;
  scores: { attribute: string; score: number; justification: string }[];
  quartile: 1 | 2 | 3 | 4;
  improvements: string[];
  highlights: {
    positive: Highlight[];
    negative: Highlight[];
  };
  rewrites: {
    original: string;
    improved: string;
    explanation: string;
  }[];
  weakness_patterns: string[];
  cost_note: string;
};
