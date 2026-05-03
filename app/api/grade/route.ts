import { NextResponse } from "next/server";
import { routeGradingRequest } from "@/lib/router";
import { scenarios } from "@/data/scenarios";
import { UserTier } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const scenarioId = String(body.scenarioId || "academic-integrity");
    const tier = (body.tier === "pro" ? "pro" : "free") as UserTier;
    const answer = String(body.answer || "");
    const forceAi = Boolean(body.forceAi);

    const selected = scenarios.find((s) => s.id === scenarioId) || scenarios[0];

    const feedback = await routeGradingRequest({
      tier,
      scenario: selected.scenario,
      question: selected.question,
      answer,
      forceAi
    });

    return NextResponse.json(feedback);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to grade answer" }, { status: 500 });
  }
}
