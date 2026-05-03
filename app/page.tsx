"use client";

import { useMemo, useState } from "react";
import { scenarios } from "@/data/scenarios";
import { GradeResponse, Highlight, UserTier } from "@/lib/types";

function escapeHtml(text: string) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function applyHighlights(answer: string, positive: Highlight[] = [], negative: Highlight[] = []) {
  let safe = escapeHtml(answer);
  const all = [
    ...positive.map((h) => ({ ...h, cls: "highlight-positive" })),
    ...negative.map((h) => ({ ...h, cls: "highlight-negative" }))
  ];

  for (const h of all) {
    const phrase = escapeHtml(h.text);
    if (!phrase) continue;
    safe = safe.replace(phrase, `<span class="${h.cls}" title="${escapeHtml(h.reason)}">${phrase}</span>`);
  }
  return safe.replaceAll("\n", "<br />");
}

export default function Home() {
  const [scenarioId, setScenarioId] = useState(scenarios[0].id);
  const [tier, setTier] = useState<UserTier>("free");
  const [forceAi, setForceAi] = useState(false);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<GradeResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const scenario = useMemo(() => scenarios.find((s) => s.id === scenarioId) || scenarios[0], [scenarioId]);

  async function submit() {
    setLoading(true);
    setFeedback(null);
    const res = await fetch("/api/grade", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scenarioId, tier, answer, forceAi })
    });
    const data = await res.json();
    setFeedback(data);
    setLoading(false);
  }

  return (
    <main style={{ maxWidth: 1180, margin: "0 auto", padding: 24 }}>
      <section style={{ padding: "36px 0 24px" }}>
        <span className="badge">Q4Ready / CASPer AI mock backend</span>
        <h1 style={{ fontSize: 44, lineHeight: 1.05, margin: "16px 0 10px" }}>
          CASPer practice with rule-based free feedback and optional AI coaching.
        </h1>
        <p style={{ color: "var(--muted)", fontSize: 18, maxWidth: 780 }}>
          This mock shows the full product flow: free users get a zero-token rule engine, paid users get AI-style grading, highlights, rewrites, and weakness tracking.
        </p>
      </section>

      <section className="grid two">
        <div className="card" style={{ padding: 22 }}>
          <div className="grid" style={{ marginBottom: 18 }}>
            <label>
              <strong>Scenario</strong>
              <select value={scenarioId} onChange={(e) => setScenarioId(e.target.value)} style={{ marginTop: 8 }}>
                {scenarios.map((s) => (
                  <option key={s.id} value={s.id}>{s.free ? "Free" : "Paid"} — {s.title}</option>
                ))}
              </select>
            </label>

            <label>
              <strong>User tier</strong>
              <select value={tier} onChange={(e) => setTier(e.target.value as UserTier)} style={{ marginTop: 8 }}>
                <option value="free">Free: rule engine, no tokens</option>
                <option value="pro">Pro: AI feedback if API key exists</option>
              </select>
            </label>

            <label style={{ display: "flex", gap: 10, alignItems: "center", color: "var(--muted)" }}>
              <input type="checkbox" checked={forceAi} onChange={(e) => setForceAi(e.target.checked)} />
              Force AI/demo AI even on free tier
            </label>
          </div>

          <div style={{ padding: 18, borderRadius: 18, background: "#f9fafb", border: "1px solid var(--border)", marginBottom: 18 }}>
            <div className="badge">{scenario.category}</div>
            <h2 style={{ margin: "12px 0 8px" }}>{scenario.title}</h2>
            <p style={{ color: "var(--muted)", lineHeight: 1.6 }}>{scenario.scenario}</p>
            <p><strong>Question:</strong> {scenario.question}</p>
          </div>

          <label>
            <strong>Your answer</strong>
            <textarea
              rows={11}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your CASPer-style answer here..."
              style={{ marginTop: 8, lineHeight: 1.5 }}
            />
          </label>

          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <button className="btn" onClick={submit} disabled={loading || answer.trim().length < 10}>
              {loading ? "Grading..." : "Submit answer"}
            </button>
            <button className="btn secondary" onClick={() => setAnswer("I would speak to them privately and try to understand what pressure they are facing. I would explain that I cannot share my full answer because it would be unfair and could violate academic integrity rules. I would offer to help them brainstorm their own ideas or suggest they speak with academic advising, financial aid, or the professor if the scholarship pressure is affecting them.")}>Use sample answer</button>
          </div>
        </div>

        <div className="card" style={{ padding: 22 }}>
          {!feedback ? (
            <div style={{ color: "var(--muted)", lineHeight: 1.7 }}>
              <h2 style={{ color: "var(--text)" }}>Feedback will appear here</h2>
              <p>Green highlights show phrases that helped the score. Red highlights show phrases that weakened the response. The backend also collects weakness patterns for future analytics.</p>
            </div>
          ) : (
            <div className="grid">
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                <div>
                  <span className="badge">Engine: {feedback.engine}</span>
                  <h2 style={{ margin: "10px 0 0" }}>Quartile {feedback.quartile}</h2>
                </div>
                <span className="badge">{feedback.cost_note}</span>
              </div>

              <section>
                <h3>Highlighted response</h3>
                <div
                  style={{ lineHeight: 1.8, background: "#f9fafb", border: "1px solid var(--border)", padding: 16, borderRadius: 16 }}
                  dangerouslySetInnerHTML={{
                    __html: applyHighlights(answer, feedback.highlights?.positive, feedback.highlights?.negative)
                  }}
                />
              </section>

              <section>
                <h3>Attribute mapping</h3>
                {feedback.attribute_mapping.map((m, i) => (
                  <p key={i}><strong>{m.attribute}:</strong> {m.reason}</p>
                ))}
              </section>

              <section>
                <h3>Scores</h3>
                {feedback.scores.map((s, i) => (
                  <div key={i} style={{ marginBottom: 10 }}>
                    <strong>{s.attribute}: {s.score}/9</strong>
                    <div style={{ height: 8, background: "#e5e7eb", borderRadius: 999, margin: "6px 0" }}>
                      <div style={{ width: `${Math.min(100, (s.score / 9) * 100)}%`, height: 8, background: "#2f5cff", borderRadius: 999 }} />
                    </div>
                    <small style={{ color: "var(--muted)" }}>{s.justification}</small>
                  </div>
                ))}
              </section>

              <section>
                <h3>Evaluation</h3>
                <p style={{ color: "var(--muted)", lineHeight: 1.6 }}>{feedback.evaluation}</p>
              </section>

              <section>
                <h3>Q4 upgrade rewrites</h3>
                {feedback.rewrites.map((r, i) => (
                  <div key={i} style={{ border: "1px solid var(--border)", borderRadius: 16, padding: 14, marginBottom: 10 }}>
                    <p><strong>Original:</strong> {r.original}</p>
                    <p><strong>Improved:</strong> {r.improved}</p>
                    <small style={{ color: "var(--muted)" }}>{r.explanation}</small>
                  </div>
                ))}
              </section>

              <section>
                <h3>Weakness patterns collected</h3>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {feedback.weakness_patterns.map((w, i) => <span className="badge" key={i}>{w}</span>)}
                </div>
              </section>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
