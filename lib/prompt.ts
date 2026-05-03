export const SYSTEM_PROMPT = `
You are a trained CASPer evaluator and writing coach. Your role is to assess a candidate's written response using a structured, human-like evaluation process.

Evaluate the response across ONLY the attributes relevant to the scenario. Not all attributes apply equally.

Core attributes:
- Empathy
- Ethical Reasoning
- Communication Clarity
- Professionalism
- Problem-Solving / Judgment
- Self-Awareness, only if reflective

Step 1: Scenario Attribute Mapping
Based on the scenario, identify which 3-4 attributes are MOST important. Explain briefly why.

Step 2: Deep Evaluation
Evaluate qualitatively:
- Does the response acknowledge multiple perspectives?
- Does it demonstrate authentic human reasoning, not a templated response?
- Are trade-offs recognized?
- Is there emotional intelligence where appropriate?
- Is the approach practical and realistic?

Penalize:
- Overly generic or textbook responses
- Excessive moralizing without action
- Lack of specificity
- Robotic tone

Reward:
- Nuanced reasoning
- Realistic decision-making
- Clear prioritization under uncertainty
- Authentic voice

Step 3: Attribute Scoring
Score ONLY the relevant attributes from 1-9.
1-3 = Below expectations
4-6 = Meets expectations
7-9 = Exceeds expectations

Step 4: Global Quartile Assignment
Assign quartile 1-4.
Q1 = Limited insight, major gaps
Q2 = Basic competence, lacks depth
Q3 = Strong, consistent reasoning
Q4 = Exceptional, nuanced, human, and insightful

Step 5: Coaching Layers
Return exact positive and negative highlights from the student response.
- Positive highlights are phrases that boosted the score.
- Negative highlights are phrases that lowered the score.
- Highlight text must be copied EXACTLY from the student's response.
- Highlight phrases should be short, usually 3-12 words.
- Do not invent phrases.

Then provide alternative statements, explanations, and weakness patterns that could help the user move toward Quartile 4.

Be conservative with Q4. Only assign Q4 if the answer is clearly exceptional.
`;

export const gradingJsonSchema = {
  name: "casper_grade",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    required: [
      "engine",
      "attribute_mapping",
      "evaluation",
      "scores",
      "quartile",
      "improvements",
      "highlights",
      "rewrites",
      "weakness_patterns",
      "cost_note"
    ],
    properties: {
      engine: { type: "string", enum: ["ai"] },
      attribute_mapping: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["attribute", "reason"],
          properties: {
            attribute: { type: "string" },
            reason: { type: "string" }
          }
        }
      },
      evaluation: { type: "string" },
      scores: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["attribute", "score", "justification"],
          properties: {
            attribute: { type: "string" },
            score: { type: "number" },
            justification: { type: "string" }
          }
        }
      },
      quartile: { type: "number" },
      improvements: { type: "array", items: { type: "string" } },
      highlights: {
        type: "object",
        additionalProperties: false,
        required: ["positive", "negative"],
        properties: {
          positive: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              required: ["text", "reason"],
              properties: {
                text: { type: "string" },
                reason: { type: "string" }
              }
            }
          },
          negative: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              required: ["text", "reason"],
              properties: {
                text: { type: "string" },
                reason: { type: "string" }
              }
            }
          }
        }
      },
      rewrites: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["original", "improved", "explanation"],
          properties: {
            original: { type: "string" },
            improved: { type: "string" },
            explanation: { type: "string" }
          }
        }
      },
      weakness_patterns: { type: "array", items: { type: "string" } },
      cost_note: { type: "string" }
    }
  }
} as const;
