"use client";

import { useMemo, useState } from "react";
import { scenarios } from "@/data/scenarios";
import { GradeResponse, Highlight, UserTier } from "@/lib/types";

type View = "landing" | "dashboard" | "practice" | "pricing";

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

const sampleAnswer = `I would gently reach out to my classmate privately to see how they are doing. I would let them know that their perspective is valuable to our group and that they can share only what they feel comfortable sharing. I would listen without pressure, ask if anything is making participation difficult, and offer a manageable way to contribute, such as taking on one smaller section of the discussion. I would also follow up after the meeting to make sure they feel included and supported.`;

function Logo() {
  return (
    <div className="logo-wrap">
      <div className="logo-mark">Q</div>
      <div>
        <div className="logo-text">Q4Ready</div>
        <div className="logo-sub">CASPer AI Coaching</div>
      </div>
    </div>
  );
}

function TopNav({ view, setView }: { view: View; setView: (v: View) => void }) {
  return (
    <header className="top-nav">
      <Logo />
      <nav className="nav-links">
        <button onClick={() => setView("landing")} className={view === "landing" ? "active" : ""}>How It Works</button>
        <button onClick={() => setView("dashboard")} className={view === "dashboard" ? "active" : ""}>Features</button>
        <button onClick={() => setView("pricing")} className={view === "pricing" ? "active" : ""}>Pricing</button>
        <button onClick={() => setView("practice")} className={view === "practice" ? "active" : ""}>Practice</button>
        <button>Resources⌄</button>
      </nav>
      <div className="nav-actions">
        <button className="ghost">Log in</button>
        <button className="primary" onClick={() => setView("practice")}>Start Free Practice</button>
      </div>
    </header>
  );
}

function Landing({ setView }: { setView: (v: View) => void }) {
  return (
    <main className="page-shell landing-shell">
      <section className="hero-grid">
        <div className="hero-copy">
          <div className="eyebrow">✦ AI-Powered. Expert-Designed. Results-Driven.</div>
          <h1>AI-Powered CASPer Practice That Gets You <span>Q4 Ready</span></h1>
          <p>Realistic CASPer simulations, instant AI feedback, and quartile insights to help you stand out with confidence.</p>
          <div className="hero-actions">
            <button className="primary jumbo" onClick={() => setView("practice")}>Start Free Practice <span>→</span></button>
            <button className="outline jumbo">▶ See How It Works</button>
          </div>
          <div className="trust-row">
            <span>✓ No credit card required</span>
            <span>✓ Instant feedback demo</span>
            <span>✓ Built for pre-med hopefuls</span>
          </div>
        </div>

        <div className="product-frame hero-product">
          <div className="mini-sidebar">
            <Logo />
            <div className="side-pill active">◉ Practice</div>
            <div className="side-pill">□ Review</div>
            <div className="side-pill">▥ Insights</div>
            <div className="side-pill">◌ Progress</div>
            <div className="streak-card">🔥 <strong>12</strong><span>Day streak</span></div>
          </div>
          <div className="product-main">
            <div className="product-top"><span>Text Practice · Scenario 3 of 12</span><span>◷ 07:45</span></div>
            <div className="scenario-card small">
              <strong>Scenario</strong>
              <p>You notice a classmate looking overwhelmed and on the verge of tears after receiving feedback on a group project. What would you do?</p>
            </div>
            <div className="answer-box">
              <div className="answer-label">⌁ Type your response below <span>Min. 250 words</span></div>
              <p>I would first approach my classmate with empathy and privacy in mind. I’d ask if they’d like to talk in a quiet space where they can feel comfortable sharing what happened...</p>
              <button className="primary tiny">Submit Response</button>
            </div>
          </div>
          <aside className="feedback-mini">
            <h4>Live AI Feedback</h4>
            <div className="quartile-ring">Q4<span>Top 25%</span></div>
            {[["Empathy", "High", 92], ["Communication", "High", 82], ["Ethical Reasoning", "Strong", 88], ["Structure", "Good", 68]].map(([label, val, pct]) => (
              <div className="metric" key={label as string}>
                <div><span>{label}</span><b>{val}</b></div>
                <div className="bar"><i style={{ width: `${pct}%` }} /></div>
              </div>
            ))}
            <button className="outline full">View Full Feedback →</button>
          </aside>
        </div>
      </section>

      <section className="feature-grid">
        {[
          ["▤", "Text Practice", "Unlimited text-based CASPer scenarios with AI scoring and real-time feedback."],
          ["▣", "Video Practice", "Record video responses in a timed, realistic environment with AI evaluation."],
          ["▥", "Quartile Insights", "See where you stand with predicted quartiles and performance breakdowns."],
          ["✦", "Targeted Feedback", "Get personalized suggestions to strengthen your responses and boost key competencies."]
        ].map(([icon, title, body]) => (
          <article className="feature-card" key={title}>
            <div className="feature-icon">{icon}</div>
            <h3>{title}</h3>
            <p>{body}</p>
            <button>→</button>
          </article>
        ))}
      </section>

      <section className="stats-strip">
        <p>Trusted by thousands of aspiring healthcare professionals</p>
        <div>
          <span>👥 <b>25,000+</b> Active Users</span>
          <span>☆ <b>4.8/5</b> Average Rating</span>
          <span>🎓 <b>50+</b> Programs Supported</span>
          <span>🛡 <b>98%</b> Recommend Q4Ready</span>
        </div>
      </section>
    </main>
  );
}

function AppSidebar({ setView, view }: { setView: (v: View) => void; view: View }) {
  const items: [View, string, string][] = [
    ["dashboard", "⌂", "Dashboard"],
    ["practice", "▣", "Practice"],
    ["practice", "◷", "Review History"],
    ["dashboard", "▥", "Weakness Trends"],
    ["dashboard", "□", "Study Hub"],
    ["pricing", "⚙", "Settings"]
  ];
  return (
    <aside className="app-sidebar">
      <Logo />
      <nav>
        {items.map(([target, icon, label], i) => (
          <button key={label + i} onClick={() => setView(target)} className={view === target && i < 2 ? "active" : ""}>{icon}<span>{label}</span></button>
        ))}
      </nav>
      <div className="ai-card">
        <div>✦</div>
        <h3>AI Coach</h3>
        <p>Get personalized feedback and strategic tips to improve your CASPer performance.</p>
        <button className="primary full">Chat with AI Coach</button>
      </div>
      <div className="profile-card"><span>AS</span><div><b>Alex Smith</b><small>Premium Plan</small></div>⌄</div>
    </aside>
  );
}

function Dashboard({ setView, view }: { setView: (v: View) => void; view: View }) {
  return (
    <main className="app-layout">
      <AppSidebar setView={setView} view={view} />
      <section className="dashboard-main">
        <div className="dash-header">
          <div><h1>Welcome back, Alex! 👋</h1><p>Here’s your progress overview and recommended next steps.</p></div>
          <div className="header-actions"><span className="streak-mini">🔥 <b>12</b><small>Day Streak</small></span><span className="bell">🔔</span><span className="avatar">AS</span></div>
        </div>
        <div className="dash-grid">
          <section className="panel progress-panel wide">
            <div className="panel-title"><h2>Progress Overview</h2><button className="select-like">Last 8 weeks⌄</button></div>
            <div className="progress-stats">
              <div className="donut">72%</div>
              <div><b>64%</b><span>Situational Judgment</span><small>+8% this week</small></div>
              <div><b>78%</b><span>Ethics Reasoning</span><small>+10% this week</small></div>
              <div><b>71%</b><span>Communication Skills</span><small>+7% this week</small></div>
            </div>
            <div className="chart-card"><div className="chart-line" /><span className="chart-tooltip">72%<small>Jun 30</small></span></div>
          </section>
          <section className="panel quartile-panel">
            <h2>Quartile Prediction ⓘ</h2>
            <div className="big-gauge">Q2<span>Likely Range</span></div>
            <p>Based on your performance, you’re currently in the second quartile range.</p>
            <button className="outline full">How is this calculated? ↗</button>
          </section>
          <section className="panel"><div className="panel-title"><h2>Recent Practice Sessions</h2><button>View all</button></div>
            {[['⚖','Ethics Scenario Practice','Completed 20 questions','76%'],['💬','Communication Scenario Set','Completed 15 questions','68%'],['👤','Situational Judgment Set','Completed 20 questions','72%'],['⚖','Ethics Scenario Practice','Completed 15 questions','64%']].map((r) => <div className="session-row" key={r.join('-')}><span>{r[0]}</span><div><b>{r[1]}</b><small>{r[2]}</small></div><strong>{r[3]}</strong></div>)}
          </section>
          <section className="panel"><div className="panel-title"><h2>Strengths & Areas to Improve</h2><button>View report</button></div>
            <h4 className="green-text">Strengths</h4>
            {[["Empathy & Perspective Taking",82],["Ethical Reasoning",76],["Structured Communication",72]].map(([l,p]) => <div className="skill-row" key={l as string}><span>{l}</span><div className="bar green"><i style={{width:`${p}%`}}/></div><b>{p}%</b></div>)}
            <h4 className="orange-text">Areas to Improve</h4>
            {[["Generating Solutions",54],["Time Management",48],["Prioritization",46]].map(([l,p]) => <div className="skill-row" key={l as string}><span>{l}</span><div className="bar orange"><i style={{width:`${p}%`}}/></div><b>{p}%</b></div>)}
            <div className="insight-box">✦ Focus on solution generation to improve your quartile prediction.</div>
          </section>
          <section className="panel exam-card"><div className="calendar-icon">▣</div><h2>Full Length Mock Exam 3</h2><p>Simulates the real CASPer experience</p><ul><li>Jul 6, 2025</li><li>10:00 AM · 90 min</li><li>12 Scenarios</li><li>Adaptive Difficulty</li></ul><button className="primary full">Start Exam</button><button className="ghost full">Reschedule</button></section>
          <section className="panel bottom-wide"><div className="mountain">⚑</div><div><h2>Keep it up, Alex!</h2><p>Consistent practice is the key to success. You’re on the right track.</p></div><div className="streak-days"><b>12 days</b><span>● ● ● ● ● ● ○</span></div></section>
        </div>
      </section>
    </main>
  );
}

function Practice({ setView, view }: { setView: (v: View) => void; view: View }) {
  const [scenarioId, setScenarioId] = useState(scenarios[0].id);
  const [tier, setTier] = useState<UserTier>("pro");
  const [forceAi, setForceAi] = useState(true);
  const [answer, setAnswer] = useState(sampleAnswer);
  const [feedback, setFeedback] = useState<GradeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("Overview");
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

  const displayFeedback = feedback;

  return (
    <main className="app-layout review-layout">
      <AppSidebar setView={setView} view={view} />
      <section className="review-main">
        <div className="review-top"><span>Practice Set 3 › Question 2</span><div><button className="outline">Share Feedback</button><button className="square">‹</button><button className="square">›</button></div></div>
        <div className="review-grid">
          <section className="review-center">
            <div className="question-card"><div><span className="question-icon">▣</span><b>Question</b><p>{scenario.scenario}</p><strong>{scenario.question}</strong></div><button className="outline">View rubric</button></div>
            <div className="answer-review-card">
              <div className="answer-head"><h2>Your Answer <span>◷ 01:32 min</span></h2><small>Word count: {answer.trim().split(/\s+/).filter(Boolean).length}</small></div>
              <div className="live-controls">
                <select value={scenarioId} onChange={(e) => setScenarioId(e.target.value)}>{scenarios.map((s) => <option key={s.id} value={s.id}>{s.free ? "Free" : "Paid"} — {s.title}</option>)}</select>
                <select value={tier} onChange={(e) => setTier(e.target.value as UserTier)}><option value="free">Free engine</option><option value="pro">Pro AI/demo</option></select>
                <label><input type="checkbox" checked={forceAi} onChange={(e)=>setForceAi(e.target.checked)} /> demo AI</label>
              </div>
              <textarea className="beautiful-textarea" value={answer} onChange={(e) => setAnswer(e.target.value)} rows={8} />
              <button className="primary submit-btn" disabled={loading || answer.trim().length < 10} onClick={submit}>{loading ? "Generating feedback..." : "Submit & Generate Feedback"}</button>
              <div className="highlighted-answer" dangerouslySetInnerHTML={{__html: displayFeedback ? applyHighlights(answer, displayFeedback.highlights?.positive, displayFeedback.highlights?.negative) : applyHighlights(answer, [{text:"gently reach out to my classmate",reason:"Shows empathy"},{text:"their perspective is valuable",reason:"Shows inclusion"},{text:"listen without pressure",reason:"Respects boundaries"}], [{text:"comfortable sharing",reason:"Could be more specific"}])}} />
              <div className="legend"><span><i className="good"/> Supportive</span><span><i className="bad"/> Needs Improvement</span></div>
              <div className="ai-insight">✦ <div><b>AI Insight</b><p>{displayFeedback?.evaluation || "You demonstrated empathy and a collaborative mindset. Strengthen your answer by adding more concrete actions and clarifying how you would follow up."}</p></div></div>
            </div>
            <div className="tabs">{["Overview","Highlights","Rewrites","Weakness Trends"].map((t)=><button key={t} className={tab===t?"active":""} onClick={()=>setTab(t)}>{t}</button>)}</div>
            <div className="panel snapshot"><h2>Response Snapshot</h2><p>Great start. For a 4th-quartile response, add more specific actions, depth of impact, and follow-up.</p><div>☁</div></div>
          </section>

          <aside className="review-right">
            <div className="panel q-card"><h3>Overall Quartile ⓘ</h3><div className="q-number">Q{displayFeedback?.quartile || 3}</div><b>Strong attempt!</b><p>You’re in the top {displayFeedback?.quartile === 4 ? "25%" : "31–50%"} of test takers.</p><div className="arc"><span>Q1</span><span>Q2</span><span>Q3</span><span>Q4</span></div></div>
            <div className="panel"><h3>CASPer Attributes ⓘ</h3>{(displayFeedback?.scores || [{attribute:'Empathy',score:8,justification:''},{attribute:'Communication',score:7,justification:''},{attribute:'Collaboration',score:7,justification:''},{attribute:'Professionalism',score:5,justification:''},{attribute:'Ethical Reasoning',score:7,justification:''}]).map((s)=><div className="attribute-row" key={s.attribute}><span>{s.attribute}</span><div className="bar"><i style={{width:`${(s.score/9)*100}%`}} /></div><b>Q{s.score>=8?4:s.score>=6?3:s.score>=4?2:1}</b></div>)}</div>
            <div className="panel strength-card"><h3>Strengths</h3><p>✓ Shows empathy and consideration for others</p><p>✓ Encourages inclusion and respects boundaries</p></div>
            <div className="panel weakness-card"><h3>Weakness Patterns</h3>{(displayFeedback?.weakness_patterns || ["Lack of specific, concrete actions","Limited follow-up or impact on outcome"]).map((w)=><p key={w}>ⓘ {w}</p>)}</div>
            <div className="panel rewrite-card"><h3>✦ Rewrite to Reach Q4</h3><p>Stronger version with more depth and action.</p><div>{displayFeedback?.rewrites?.[0]?.improved || "I would privately check in with my classmate to see how they are doing and ask an open-ended question to understand what might be making participation difficult. If they are comfortable, I would invite them to contribute to a specific part of the conversation that aligns with their strengths, then follow up afterward to ensure they feel included and supported."}</div><button className="outline">Use this rewrite</button></div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function Pricing() {
  return (
    <main className="page-shell pricing-shell">
      <section className="pricing-hero">
        <div className="eyebrow">Simple pricing. Serious results.</div>
        <h1>Plans designed to <span>get you CASPer-ready.</span></h1>
        <p>Practice smarter, get personalized feedback, and walk into test day with confidence.</p>
        <div className="toggle-row">Pay monthly <span className="toggle"/> <b>Pay yearly</b> <em>Save 20%</em></div>
      </section>
      <section className="pricing-grid">
        {[
          ["Free", "$0", "Get a feel for Q4Ready", ["1 CASPer scenario per day", "Sample video responses", "Basic written feedback", "Community access"], "Get Started"],
          ["Pro", "$19", "Everything you need to improve", ["Unlimited practice scenarios", "AI-powered personalized feedback", "Detailed performance analytics", "Video & written feedback", "Priority email support"], "Start Pro Trial"],
          ["Pro Max", "$39", "For serious pre-med applicants", ["Everything in Pro", "Mock CASPer exams", "1-on-1 expert feedback", "Custom improvement plan", "Priority support"], "Start Pro Max Trial"]
        ].map((p, idx) => (
          <article className={`price-card ${idx===1?'featured':''}`} key={p[0] as string}>
            {idx===1 && <div className="ribbon">MOST POPULAR</div>}
            <h2>{p[0]}</h2><p>{p[2]}</p><div className="price">{p[1]}<span>/month</span></div><button className={idx===1?"primary full":"outline full"}>{p[4]}</button>{idx>0&&<small>7-day free trial · Cancel anytime</small>}
            <ul>{(p[3] as string[]).map((x)=><li key={x}>✓ {x}</li>)}</ul>
          </article>
        ))}
      </section>
      <section className="stats-banner"><span>👥 <b>125,000+</b> Questions Practiced</span><span>☆ <b>4.9/5</b> Student Satisfaction</span><span>▥ <b>90%</b> Improved Confidence</span><span>🏆 <b>Top Choice</b> For CASPer Prep</span></section>
      <section className="lower-grid"><div><h4>STUDENT VOICES</h4><h2>Trusted by future healthcare leaders.</h2><div className="testimonial-row"><article>“Q4Ready’s feedback helped me reflect more deeply and structure my responses clearly.”<b>Linda T.</b><small>Medical Student, UBC</small></article><article>“The practice scenarios are realistic and the AI feedback is spot-on.”<b>Ethan R.</b><small>Medical Student, McMaster</small></article></div></div><div><h4>FAQ</h4><h2>Your questions, answered.</h2>{["What is the CASPer test?","How does Q4Ready provide feedback?","Can I cancel anytime?","Is Q4Ready suitable for first-time test takers?"].map(q=><button className="faq" key={q}>{q}<span>⌄</span></button>)}</div></section>
      <section className="cta-band"><div>🚀</div><div><h2>Ready to boost your preparation?</h2><p>Join students who have elevated their CASPer performance with Q4Ready.</p></div><button>Get Started Today →</button></section>
    </main>
  );
}

export default function Home() {
  const [view, setView] = useState<View>("landing");
  return (
    <>
      {(view === "landing" || view === "pricing") && <TopNav view={view} setView={setView} />}
      {view === "landing" && <Landing setView={setView} />}
      {view === "dashboard" && <Dashboard setView={setView} view={view} />}
      {view === "practice" && <Practice setView={setView} view={view} />}
      {view === "pricing" && <Pricing />}
    </>
  );
}
