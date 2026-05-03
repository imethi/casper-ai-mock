import OpenAI from "openai";
import { GradeResponse } from "@/lib/types";
import { SYSTEM_PROMPT, gradingJsonSchema } from "@/lib/prompt";
import { mockAiGrade } from "@/lib/mockAi";

export async function gradeWithAi(params: {
  scenario: string;
  question: string;
  answer: string;
}): Promise<GradeResponse> {
  if (!process.env.OPENAI_API_KEY) {
    return mockAiGrade(params.answer);
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  const response = await client.responses.create({
    model,
    input: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Scenario: ${params.scenario}\n\nQuestion: ${params.question}\n\nStudent Response:\n${params.answer}`
      }
    ],
    text: {
      format: {
        type: "json_schema",
        ...gradingJsonSchema
      }
    }
  });

  const raw = response.output_text;
  const parsed = JSON.parse(raw) as GradeResponse;
  return { ...parsed, engine: "ai", cost_note: "Paid AI engine: this request used API tokens." };
}
