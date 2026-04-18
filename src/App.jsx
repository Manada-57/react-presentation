import { useState, useEffect, useRef } from "react";

const slides = [
  { id: "title", time: "0–2 min" },
  { id: "what-is-state", time: "2–7 min" },
  { id: "state-vs-usestate", time: "7–11 min" },
  { id: "server-render", time: "11–17 min" },
  { id: "server-state", time: "17–22 min" },
  { id: "bridge", time: "22–24 min" },
  { id: "anatomy", time: "24–29 min" },
  { id: "demo1", time: "29–34 min" },
  { id: "demo2", time: "34–39 min" },
  { id: "demo3", time: "39–43 min" },
  { id: "demo4", time: "43–48 min" },
  { id: "rules", time: "48–52 min" },
  { id: "summary", time: "52–55 min" },
];

export default function App() {
  const [cur, setCur] = useState(0);
  const [presMode, setPresMode] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [timerRunning]);
const enterPres = () => {
  setPresMode(true);
  setTimerRunning(true);

  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen();
  }
};
const exitPres = () => {
  setPresMode(false);
  setTimerRunning(false);

  if (document.fullscreenElement) {
    document.exitFullscreen();
  }
};
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape" && presMode) {
  exitPres();
  return;
}
      if (!presMode) {
        if (e.key === "f" || e.key === "F") { enterPres(); return; }
      }
      if (presMode) {
        if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
          e.preventDefault(); setCur((p) => Math.min(p + 1, slides.length - 1));
        }
        if (e.key === "ArrowLeft" || e.key === "PageUp") {
          e.preventDefault(); setCur((p) => Math.max(p - 1, 0));
        }
        if (e.key === "Home") { e.preventDefault(); setCur(0); }
        if (e.key === "End") { e.preventDefault(); setCur(slides.length - 1); }
        if (e.key === "h" || e.key === "H") setShowHelp((v) => !v);
        if (e.key === "t" || e.key === "T") setTimerRunning((v) => !v);
        if (e.key === "r" || e.key === "R") setElapsed(0);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [presMode]);

  const go = (d) => setCur((p) => Math.min(Math.max(p + d, 0), slides.length - 1));
  const progress = (((cur + 1) / slides.length) * 100).toFixed(0);
  const fmtTime = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;


  /* ── Presentation Mode ── */
  if (presMode) {
    return (
      <div style={{
        position: "fixed", inset: 0, zIndex: 9999, background: "#fff",
        display: "flex", flexDirection: "column", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, zIndex: 2 }}>
          <div style={{ height: "100%", width: `${progress}%`, background: "#378add", transition: "width .4s ease" }} />
        </div>
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0,
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "14px 32px", zIndex: 2,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 13, color: "#9ca3af", fontFamily: "monospace" }}>{cur + 1} / {slides.length}</span>
            <span style={{ fontSize: 13, color: "#d1d5db" }}>{slides[cur].time}</span>
            {timerRunning && (
              <span style={{
                fontSize: 13, fontFamily: "monospace",
                color: elapsed > 3300 ? "#f87171" : "#d1d5db",
                display: "flex", alignItems: "center", gap: 6,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: timerRunning ? "#22c55e" : "#d1d5db", animation: timerRunning ? "pulse 1.5s infinite" : "none" }} />
                {fmtTime(elapsed)}
              </span>
            )}
          </div>
          <button onClick={() => setShowHelp((v) => !v)} style={{
            background: "none", border: "0.5px solid #e5e7eb", borderRadius: 6,
            color: "#d1d5db", fontSize: 12, padding: "4px 10px", cursor: "pointer", fontFamily: "monospace",
          }}>H — help</button>
        </div>

        <div style={{ flex: 1, overflowY: "auto" }}>
          <div style={{
            minHeight: "100%", padding: "60px 80px 80px",
            display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "stretch",          
          }}>
            <SlideContent id={slides[cur].id} presMode />
          </div>
        </div>

        <div style={{ position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 6 }}>
          {slides.map((_, i) => (
            <span key={i} style={{
              width: i === cur ? 20 : 6, height: 6, borderRadius: 3,
              background: i === cur ? "#378add" : "#e5e7eb", transition: "all .3s ease",
            }} />
          ))}
        </div>
        <div style={{ position: "absolute", bottom: 24, right: 32, fontSize: 12, color: "#e5e7eb", fontFamily: "monospace" }}>ESC to exit</div>
        {showHelp && (
          <div onClick={() => setShowHelp(false)} style={{
            position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10,
          }}>
            <div onClick={(e) => e.stopPropagation()} style={{
              background: "#fff", borderRadius: 16, padding: "2.5rem 3rem",
              maxWidth: 460, width: "90%", border: "0.5px solid #e5e7eb",
              boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
            }}>
              <h2 style={{ color: "#111827", fontSize: 20, fontWeight: 500, marginBottom: 20 }}>Keyboard Shortcuts</h2>
              <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "10px 24px", alignItems: "center" }}>
                {[
                  ["→ / Space", "Next slide"], ["←", "Previous slide"],
                  ["Home / End", "First / last slide"], ["H", "Toggle this help"],
                  ["T", "Pause / resume timer"], ["R", "Reset timer"], ["ESC", "Exit presentation"],
                ].map(([key, desc]) => (
                  <React.Fragment key={key}>
                    <kbd style={{ fontFamily: "monospace", fontSize: 13, background: "#f3f4f6", color: "#374151", padding: "3px 10px", borderRadius: 6, textAlign: "center", border: "0.5px solid #e5e7eb" }}>{key}</kbd>
                    <span style={{ color: "#6b7280", fontSize: 14 }}>{desc}</span>
                  </React.Fragment>
                ))}
              </div>
              <p style={{ color: "#d1d5db", fontSize: 13, marginTop: 20, textAlign: "center" }}>Click anywhere or press H to close</p>
            </div>
          </div>
        )}
        <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }`}</style>
      </div>
    );
  }

  /* ── Normal Mode ── */
  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: 900, margin: "0 auto", padding: "1.5rem" }}>
      <div style={{ height: 3, background: "#e5e7eb", borderRadius: 2, marginBottom: 12 }}>
        <div style={{ height: "100%", width: `${progress}%`, background: "#378add", borderRadius: 2, transition: "width .3s" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={styles.badge}>Slide {cur + 1} of {slides.length}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {elapsed > 0 && <span style={{ fontFamily: "monospace", fontSize: 12, color: "#9ca3af" }}>{fmtTime(elapsed)}</span>}
          <button onClick={enterPres} style={{
            display: "flex", alignItems: "center", gap: 6, padding: "5px 14px",
            border: "0.5px solid #378add", borderRadius: 8, background: "#e6f1fb",
            color: "#378add", fontSize: 13, fontWeight: 500, cursor: "pointer",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3" />
              <path d="M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3" />
              <line x1="12" y1="20" x2="12" y2="4" />
            </svg>
            Present
          </button>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 6 }}>
        <span style={styles.badge}>{slides[cur].time}</span>
      </div>
      <div style={styles.slide}><SlideContent id={slides[cur].id} /></div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
        <button style={styles.navBtn} onClick={() => go(-1)} disabled={cur === 0}>← Previous</button>
        <div>
          {slides.map((_, i) => (
            <span key={i} onClick={() => setCur(i)} style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: i === cur ? "#378add" : "#d1d5db", margin: "0 3px", cursor: "pointer", transition: "background .2s" }} />
          ))}
        </div>
        <button style={styles.navBtn} onClick={() => go(1)} disabled={cur === slides.length - 1}>Next →</button>
      </div>
      <p style={{ textAlign: "center", fontSize: 12, color: "#d1d5db", marginTop: 16 }}>
        Press <kbd style={{ fontFamily: "monospace", background: "#f3f4f6", padding: "1px 6px", borderRadius: 4, border: "0.5px solid #e5e7eb" }}>F</kbd> to start presentation
      </p>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   SLIDE COMPONENTS
   ════════════════════════════════════════════════════════ */

function SlideContent({ id, presMode }) {
  switch (id) {
    case "title":            return <TitleSlide presMode={presMode} />;
    case "what-is-state":    return <WhatIsStateSlide presMode={presMode} />;
    case "state-vs-usestate":return <StateVsUseStateSlide presMode={presMode} />;
    case "server-render":    return <ServerRenderSlide presMode={presMode} />;
    case "server-state":     return <ServerStateSlide presMode={presMode} />;
    case "bridge":           return <BridgeSlide presMode={presMode} />;
    case "anatomy":          return <AnatomySlide presMode={presMode} />;
    case "demo1":            return <Demo1Counter presMode={presMode} />;
    case "demo2":            return <Demo2Input presMode={presMode} />;
    case "demo3":            return <Demo3Toggle presMode={presMode} />;
    case "demo4":            return <Demo4Todo presMode={presMode} />;
    case "rules":            return <RulesSlide presMode={presMode} />;
    case "summary":          return <SummarySlide presMode={presMode} />;
    default:                 return null;
  }
}

/* ── Slide 1: Title ── */
function TitleSlide({ presMode }) {
  return (
    <div style={{ textAlign: "center", padding: presMode ? "4rem 0" : "2rem 0" }}>
      <Badge>React State — 55 min talk</Badge>
      <h1 style={{ fontSize: presMode ? 52 : 36, fontWeight: 500, margin: "1.25rem 0 .5rem" }}>React State</h1>
      <p style={{ fontSize: presMode ? 24 : 18, color: "#6b7280", marginBottom: ".75rem" }}>Understanding state, the old way, and the useState hook</p>
      <p style={{ fontSize: presMode ? 16 : 14, color: "#9ca3af", marginBottom: "2rem" }}>Pro MERN Stack — Chapter 11 & beyond</p>
      <p style={{ fontSize: 14, color: "#9ca3af" }}>J. Seetharaman (23BCS117) &nbsp;•&nbsp; S. Pandi (23BCS111)</p>
      </div>
  );
}

/* ── Slide 2: What is React State? ── */
function WhatIsStateSlide({ presMode }) {
  return (
    <div>
      <Badge>Fundamentals</Badge>
      <h1 style={{ ...styles.h1, fontSize: presMode ? 32 : 26 }}>What is React State?</h1>
      <div style={{ background: "#f0f9ff", border: "0.5px solid #bae6fd", borderRadius: 10, padding: "16px 20px", marginBottom: 18 }}>
        <p style={{ fontSize: presMode ? 18 : 16, color: "#0c4a6e", fontWeight: 500, lineHeight: 1.6 }}>
          State is a built-in object in React that holds data about a component. When state changes, <Hl>React re-renders the component</Hl> to reflect the new data on screen.
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
        {[
          { title: "Memory", desc: "Remembers user input, selections, fetched data — anything that changes over time", icon: "🧠" },
          { title: "Triggers updates", desc: "Changing state automatically tells React to update only the affected parts of the UI", icon: "🔄" },
          { title: "Component-scoped", desc: "Each component instance has its own isolated state — independent of others", icon: "📦" },
        ].map(({ title, desc, icon }) => (
          <div key={title} style={{ background: "#f9fafb", border: "0.5px solid #e5e7eb", borderRadius: 8, padding: "14px 16px" }}>
            <p style={{ fontSize: 20, marginBottom: 6 }}>{icon}</p>
            <p style={{ fontWeight: 500, fontSize: presMode ? 15 : 14, marginBottom: 4, color: "#111827" }}>{title}</p>
            <p style={{ fontSize: presMode ? 13 : 12, color: "#6b7280", lineHeight: 1.6 }}>{desc}</p>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16 }}>
        <p style={{ fontWeight: 500, fontSize: presMode ? 15 : 14, marginBottom: 8, color: "#374151" }}>Common real-world uses of state:</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {["Form input values", "Toggle on/off", "API fetched data", "Modal open/close", "Current page number", "Shopping cart items", "Dark mode toggle", "Error messages"].map((t) => (
            <span key={t} style={{ padding: "5px 12px", background: "#e6f1fb", color: "#185fa5", borderRadius: 6, fontSize: presMode ? 13 : 12 }}>{t}</span>
          ))}
        </div>
      </div>
      </div>
  );
}

/* ── Slide 3: State vs useState ── */
function StateVsUseStateSlide({ presMode }) {
  return (
    <div>
      <Badge>Comparison</Badge>
      <h1 style={{ ...styles.h1, fontSize: presMode ? 32 : 26 }}>State: Class Components vs useState</h1>
      <div style={{ ...styles.twoCol, gap: presMode ? "2rem" : "1.5rem" }}>
        <div style={{ border: "0.5px solid #fecaca", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ background: "#fef2f2", padding: "8px 14px", borderBottom: "0.5px solid #fecaca" }}>
            <p style={{ fontWeight: 500, fontSize: presMode ? 14 : 13, color: "#991b1b" }}>❌ Old way — this.state</p>
          </div>
          <div style={{ padding: "14px" }}>
            <Code presMode={presMode} small>{`class Counter extends React.Component {\n  constructor(props) {\n    super(props);\n    this.state = { count: 0 };\n  }\n\n  increment() {\n    this.setState({\n      count: this.state.count + 1\n    });\n  }\n\n  render() {\n    return (\n      <button onClick={\n        () => this.increment()\n      }>\n        {this.state.count}\n      </button>\n    );\n  }\n}`}</Code>
          </div>
        </div>
        <div style={{ border: "0.5px solid #bbf7d0", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ background: "#f0fdf4", padding: "8px 14px", borderBottom: "0.5px solid #bbf7d0" }}>
            <p style={{ fontWeight: 500, fontSize: presMode ? 14 : 13, color: "#166534" }}>✅ Modern way — useState</p>
          </div>
          <div style={{ padding: "14px" }}>
            <Code presMode={presMode} small>{`function Counter() {\n  const [count, setCount]\n    = useState(0);\n\n  const increment = () => {\n    setCount(count + 1);\n  };\n\n  return (\n    <button onClick={increment}>\n      {count}\n    </button>\n  );\n}`}</Code>
          </div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginTop: 16 }}>
        {[
          { label: "Lines of code", old: "~15", new: "~6", better: "useState" },
          { label: "this keyword", old: "Everywhere", new: "None", better: "useState" },
          { label: "Component type", old: "class", new: "function", better: "useState" },
          { label: "Merging", old: "Automatic", new: "Manual (spread)", better: "this.state" },
        ].map(({ label, old, new: n, better }) => (
          <div key={label} style={{ background: "#f9fafb", borderRadius: 8, padding: "10px 12px", border: "0.5px solid #e5e7eb" }}>
            <p style={{ fontWeight: 500, fontSize: presMode ? 13 : 12, color: "#374151", marginBottom: 6 }}>{label}</p>
            <p style={{ fontSize: presMode ? 12 : 11, color: "#991b1b" }}>Old: {old}</p>
            <p style={{ fontSize: presMode ? 12 : 11, color: "#166534" }}>New: {n}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Slide 4: Basic Server Rendering ── */
function ServerRenderSlide({ presMode }) {
  return (
    <div>
      <Badge>Server rendering</Badge>
      <h1 style={{ ...styles.h1, fontSize: presMode ? 32 : 26 }}>How does React render on the server?</h1>
      <p style={{ ...styles.p, fontSize: presMode ? 17 : 15, marginBottom: 16 }}>
        React provides <Hl>renderToString()</Hl> — it converts a component into an HTML string on the server, before sending it to the browser.
      </p>
      <div style={{ ...styles.twoCol, gap: presMode ? "2.5rem" : "1.5rem" }}>
        <div>
          <p style={{ fontWeight: 500, fontSize: presMode ? 16 : 14, marginBottom: 6, color: "#374151" }}>HelloWorld.jsx</p>
          <Code presMode={presMode}>{`import React from 'react';\nexport default function HelloWorld() {\n  return (\n    <h1>Hello World!</h1>\n  );\n}`}</Code>
        </div>
        <div>
          <p style={{ fontWeight: 500, fontSize: presMode ? 16 : 14, marginBottom: 6, color: "#374151" }}>renderedPageRouter.jsx</p>
          <Code presMode={presMode}>{`import { renderToString }\n  from 'react-dom/server';\nimport HelloWorld\n  from '../src/HelloWorld.jsx';\n\nrouter.get('*', (req, res) => {\n  const html = renderToString(\n    <HelloWorld />\n  );\n  res.send(template(html));\n});`}</Code>
        </div>
      </div>
      <Note presMode={presMode}>The server calls renderToString(), gets back a plain HTML string, injects it into a template, and sends the full page to the client. No browser needed on the server.</Note>
      <Speaker>Say: "renderToString doesn't attach event listeners — it just produces HTML. The client-side ReactDOM.render() then 'hydrates' that HTML to make it interactive."</Speaker>
    </div>
  );
}

/* ── Slide 5: Handling State in Server Rendering ── */
function ServerStateSlide({ presMode }) {
  return (
    <div>
      <Badge>The state problem</Badge>
      <h1 style={{ ...styles.h1, fontSize: presMode ? 32 : 26 }}>What happens when the component has state?</h1>
      <p style={{ ...styles.p, fontSize: presMode ? 17 : 15, marginBottom: 14 }}>
        Real components start with empty state and fill it asynchronously. Server rendering with state causes a <Hl>mismatch flash</Hl>.
      </p>
      <div style={{ ...styles.twoCol, gap: presMode ? "2.5rem" : "1.5rem" }}>
        <div>
          <p style={{ fontWeight: 500, fontSize: presMode ? 15 : 14, marginBottom: 6, color: "#374151" }}>Server sends "Universe"</p>
          <Code presMode={presMode}>{`// renderedPageRouter.jsx\nconst initialState = {\n  addressee: 'Universe'\n};\nconst html = renderToString(\n  <HelloWorld {...initialState} />\n);\nres.send(template(html, initialState));`}</Code>
        </div>
        <div>
          <p style={{ fontWeight: 500, fontSize: presMode ? 15 : 14, marginBottom: 6, color: "#374151" }}>Client starts with empty state</p>
          <Code presMode={presMode}>{`// HelloWorld.jsx\nclass HelloWorld extends React.Component {\n  constructor(props) {\n    super(props);\n    this.state = {};\n  }\n  componentDidMount() {\n    setTimeout(() => {\n      this.setState({\n        addressee: 'Universe'\n      });\n    }, 100);\n  }`}</Code>
        </div>
      </div>
      <div style={{ background: "#fef2f2", border: "0.5px solid #fecaca", borderRadius: 8, padding: "12px 16px", marginTop: 14 }}>
        <p style={{ fontSize: presMode ? 15 : 13, color: "#991b1b", fontWeight: 500, marginBottom: 4 }}>⚠ Result: Flash + Console Error</p>
        <p style={{ fontSize: presMode ? 14 : 13, color: "#7f1d1d", fontFamily: "monospace" }}>
          "React tried to render on the client, but the result didn't match what the server sent. The server rendering was rejected."
        </p>
      </div>
      
    </div>
  );
}

/* ── Slide 6: Bridge — The Fix & Transition to useState ── */
function BridgeSlide({ presMode }) {
  return (
    <div>
      <Badge>The fix</Badge>
      <h1 style={{ ...styles.h1, fontSize: presMode ? 32 : 26 }}>Sending initial state via template — then simplifying</h1>
      <div style={{ ...styles.twoCol, gap: presMode ? "2.5rem" : "1.5rem" }}>
        <div>
          <p style={{ fontWeight: 500, fontSize: presMode ? 15 : 14, marginBottom: 6, color: "#374151" }}>template.js — embed state in HTML</p>
          <Code presMode={presMode}>{`<div id="contents">\n  \${body}\n</div>\n<script>\n  window.__INITIAL_STATE__ =\n    \${JSON.stringify(initialState)};\n</script>`}</Code>
          <Note presMode={presMode}>Client.jsx reads window.__INITIAL_STATE__ and passes it as props — now server and client produce identical HTML on first render.</Note>
        </div>
        <div>
          <p style={{ fontWeight: 500, fontSize: presMode ? 15 : 14, marginBottom: 6, color: "#374151" }}>But this is a lot of manual plumbing</p>
          <div style={{ background: "#f9fafb", border: "0.5px solid #e5e7eb", borderRadius: 8, padding: "14px 16px", fontSize: presMode ? 15 : 13, color: "#4b5563", lineHeight: 1.7 }}>
            <p>• class components with constructors</p>
            <p>• Object.assign({}, this.props)</p>
            <p>• componentDidMount() for fetching</p>
            <p>• Global window.__INITIAL_STATE__</p>
            <p>• JSON.stringify / parse gymnastics</p>
            <p style={{ marginTop: 8, fontWeight: 500, color: "#111827" }}>→ There has to be a simpler way.</p>
          </div>
        </div>
      </div>
      <div style={{ background: "#e6f1fb", border: "0.5px solid #bae0fd", borderRadius: 8, padding: "14px 18px", marginTop: 14, textAlign: "center" }}>
        <p style={{ fontSize: presMode ? 17 : 15, color: "#0c447c", fontWeight: 500 }}>That simpler way is <Hl>useState</Hl> — the React hook that makes state management clean and declarative.</p>
      </div>
      
    </div>
  );
}

/* ── Slide 7: Anatomy of useState ── */
function AnatomySlide({ presMode }) {
  const parts = [
    { label: "count", desc: "Current value — read it to display", bg: "#e6f1fb", col: "#0c447c" },
    { label: "setCount", desc: "Setter function — call it to update", bg: "#eaf3de", col: "#27500a" },
    { label: "useState", desc: "React hook — always at top level", bg: "#faeeda", col: "#633806" },
    { label: "0", desc: "Initial value — set once on mount", bg: "#faece7", col: "#712b13" },
  ];
  return (
    <div>
      <Badge>Anatomy</Badge>
      <h1 style={{ ...styles.h1, fontSize: presMode ? 32 : 26 }}>Breaking down useState</h1>
      <Code presMode={presMode}>{`const  [ count ,  setCount ]  =  useState( 0 );`}</Code>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: presMode ? 20 : 12, margin: "1.5rem 0" }}>
        {parts.map(({ label, desc, bg, col }) => (
          <div key={label} style={{ background: bg, borderRadius: 8, padding: presMode ? "16px 18px" : "10px 12px", border: `0.5px solid ${col}40` }}>
            <p style={{ fontFamily: "monospace", fontSize: presMode ? 16 : 14, fontWeight: 500, color: col, marginBottom: 4 }}>{label}</p>
            <p style={{ fontSize: presMode ? 14 : 12, color: col, lineHeight: 1.5 }}>{desc}</p>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
        {["User action", "→", "setCount()", "→", "React re-renders", "→", "New value on screen"].map((t, i) => (
          t === "→"
            ? <span key={i} style={{ color: "#9ca3af", fontSize: presMode ? 16 : 14 }}>→</span>
            : <div key={i} style={{ padding: "8px 16px", border: "0.5px solid #d1d5db", borderRadius: 8, fontSize: presMode ? 15 : 13 }}>{t}</div>
        ))}
      </div>
      
    </div>
  );
}

/* ── Slide 8: Demo 1 — Counter ── */
function Demo1Counter({ presMode }) {
  const [count, setCount] = useState(0);
  return (
    <div>
      <Badge>Live demo 1</Badge>
      <h1 style={{ ...styles.h1, fontSize: presMode ? 32 : 26 }}>Counter — the "hello world" of state</h1>
      <div style={{ ...styles.twoCol, gap: presMode ? "3rem" : "1.5rem" }}>
        <Code presMode={presMode}>{`const [count, setCount] = useState(0);\n\n<button onClick={()=>setCount(count+1)}>\n  +1\n</button>\n<button onClick={()=>setCount(count-1)}>\n  -1\n</button>\n<button onClick={()=>setCount(0)}>\n  Reset\n</button>`}</Code>
        <DemoBox presMode={presMode}>
          <div style={{ fontSize: presMode ? 80 : 64, fontWeight: 500, lineHeight: 1 }}>{count}</div>
          <div style={{ display: "flex", gap: 10 }}>
            <button style={{ ...styles.primaryBtn, padding: presMode ? "10px 24px" : "8px 18px", fontSize: presMode ? 16 : 14 }} onClick={() => setCount(count + 1)}>+1</button>
            <button style={{ ...styles.btn, padding: presMode ? "10px 24px" : "8px 18px", fontSize: presMode ? 16 : 14 }} onClick={() => setCount(count - 1)}>-1</button>
            <button style={{ ...styles.btn, padding: presMode ? "10px 24px" : "8px 18px", fontSize: presMode ? 16 : 14 }} onClick={() => setCount(0)}>Reset</button>
          </div>
        </DemoBox>
      </div>
      <Note presMode={presMode}>Ask the audience: "What happens if I click +1 five times fast?" → Each click triggers a re-render.</Note>
      
    </div>
  );
}

/* ── Slide 9: Demo 2 — Input ── */
function Demo2Input({ presMode }) {
  const [name, setName] = useState("");
  return (
    <div>
      <Badge>Live demo 2</Badge>
      <h1 style={{ ...styles.h1, fontSize: presMode ? 32 : 26 }}>Live input — state as you type</h1>
      <div style={{ ...styles.twoCol, gap: presMode ? "3rem" : "1.5rem" }}>
        <div>
          <Code presMode={presMode}>{`const [name, setName] = useState("");\n\n<input\n  value={name}\n  onChange={(e)=>\n    setName(e.target.value)\n  }\n/>\n<h2>Hello, {name}!</h2>`}</Code>
          <Note presMode={presMode}>This is called a controlled input. The input's value is driven by state — React is the single source of truth.</Note>
        </div>
        <DemoBox presMode={presMode}>
          <input style={{ ...styles.input, width: presMode ? 300 : 220, fontSize: presMode ? 16 : 14, padding: presMode ? "10px 14px" : "8px 12px" }} placeholder="Type your name..." value={name} onChange={(e) => setName(e.target.value)} />
          <p style={{ fontSize: presMode ? 28 : 22, fontWeight: 500 }}>Hello, {name || "stranger"}!</p>
        </DemoBox>
      </div>
      
    </div>
  );
}

/* ── Slide 10: Demo 3 — Toggle ── */
function Demo3Toggle({ presMode }) {
  const [isOn, setIsOn] = useState(false);
  return (
    <div>
      <Badge>Live demo 3</Badge>
      <h1 style={{ ...styles.h1, fontSize: presMode ? 32 : 26 }}>Toggle — boolean state</h1>
      <div style={{ ...styles.twoCol, gap: presMode ? "3rem" : "1.5rem" }}>
        <div>
          <Code presMode={presMode}>{`const [isOn, setIsOn] = useState(false);\n\n<button onClick={\n  ()=> setIsOn(!isOn)\n}>\n  {isOn ? "ON" : "OFF"}\n</button>\n\n{isOn && <p>Visible!</p>}`}</Code>
          <Note presMode={presMode}>Boolean state is one of the most common patterns — show/hide panels, open/close modals, enable/disable features.</Note>
        </div>
        <DemoBox presMode={presMode}>
          <div onClick={() => setIsOn(!isOn)} style={{
            width: presMode ? 64 : 56, height: presMode ? 32 : 28, borderRadius: (presMode ? 32 : 28) / 2,
            background: isOn ? "#378add" : "#d1d5db", position: "relative", cursor: "pointer", transition: "background .2s",
          }}>
            <div style={{
              width: presMode ? 28 : 24, height: presMode ? 28 : 24, borderRadius: "50%", background: "#fff",
              position: "absolute", top: 2, left: isOn ? (presMode ? 34 : 28) : 2, transition: "left .2s",
            }} />
          </div>
          <p style={{ fontFamily: "monospace", fontSize: presMode ? 15 : 13, color: "#6b7280" }}>isOn = {String(isOn)}</p>
          {isOn && <p style={{ fontSize: presMode ? 18 : 16, color: "#378add" }}>The panel is visible!</p>}
        </DemoBox>
      </div>
      
    </div>
  );
}

/* ── Slide 11: Demo 4 — Todo ── */
function Demo4Todo({ presMode }) {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");
  const add = () => { if (task.trim() === "") return; setTodos([...todos, task]); setTask(""); };
  const remove = (i) => setTodos(todos.filter((_, idx) => idx !== i));
  return (
    <div>
      <Badge>Live demo 4</Badge>
      <h1 style={{ ...styles.h1, fontSize: presMode ? 32 : 26 }}>Todo list — array state</h1>
      <div style={{ ...styles.twoCol, gap: presMode ? "3rem" : "1.5rem" }}>
        <Code presMode={presMode}>{`const [todos, setTodos] = useState([]);\nconst [task, setTask] = useState("");\n\nfunction addTask() {\n  setTodos([...todos, task]);\n  setTask("");\n}\n\nfunction remove(i) {\n  setTodos(todos.filter(\n    (_, idx) => idx !== i\n  ));\n}`}</Code>
        <DemoBox presMode={presMode}>
          <div style={{ display: "flex", gap: 8, width: "100%", maxWidth: presMode ? 340 : 260 }}>
            <input style={{ ...styles.input, flex: 1, width: "auto", fontSize: presMode ? 15 : 14, padding: presMode ? "10px 14px" : "8px 12px" }} placeholder="Add a task..." value={task} onChange={(e) => setTask(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} />
            <button style={{ ...styles.primaryBtn, padding: presMode ? "10px 20px" : "8px 18px", fontSize: presMode ? 15 : 14 }} onClick={add}>Add</button>
          </div>
          <ul style={{ listStyle: "none", padding: 0, width: "100%", maxWidth: presMode ? 340 : 260 }}>
            {todos.map((t, i) => (
              <li key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderBottom: "0.5px solid #e5e7eb" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#378add", flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: presMode ? 15 : 14, color: "#6b7280" }}>{t}</span>
                <button onClick={() => remove(i)} style={{ background: "none", border: "none", color: "#9ca3af", cursor: "pointer", fontSize: presMode ? 16 : 14 }}>✕</button>
              </li>
            ))}
          </ul>
        </DemoBox>
      </div>
      <Note presMode={presMode}>Key rule: never mutate the array directly. Always create a new array using spread or .filter().</Note>
      
    </div>
  );
}

/* ── Slide 12: Rules ── */
function RulesSlide({ presMode }) {
  return (
    <div>
      <Badge>The rules</Badge>
      <h1 style={{ ...styles.h1, fontSize: presMode ? 32 : 26 }}>Rules of hooks (important!)</h1>
      <div style={{ ...styles.twoCol, gap: presMode ? "3rem" : "1.5rem" }}>
        <div style={{ border: "0.5px solid #e5e7eb", borderRadius: 12, padding: presMode ? "1.5rem" : "1rem" }}>
          <p style={{ fontWeight: 500, color: "#27500a", marginBottom: 10, fontSize: presMode ? 16 : 14 }}>✓ Do this</p>
          <Code presMode={presMode}>{`// Top level only\nconst [a] = useState(0);\nconst [b] = useState("");\n\nfunction MyComp() {\n  const [x] = useState(false);\n}`}</Code>
        </div>
        <div style={{ border: "0.5px solid #e5e7eb", borderRadius: 12, padding: presMode ? "1.5rem" : "1rem" }}>
          <p style={{ fontWeight: 500, color: "#993c1d", marginBottom: 10, fontSize: presMode ? 16 : 14 }}>✕ Never do this</p>
          <Code presMode={presMode}>{`// Inside if / loop\nif (condition) {\n  const [x] = useState(0); // BAD\n}\n\nfor (...) {\n  const [y] = useState(0); // BAD\n}`}</Code>
        </div>
      </div>
      <ul style={{ marginTop: 16, paddingLeft: "1.25rem" }}>
        <li style={{ ...styles.li, fontSize: presMode ? 17 : 15 }}>Only call hooks <Hl>at the top level</Hl> of a function component</li>
        <li style={{ ...styles.li, fontSize: presMode ? 17 : 15 }}>Only call hooks from <Hl>React function components</Hl> (not regular JS functions)</li>
        <li style={{ ...styles.li, fontSize: presMode ? 17 : 15 }}>State is <Hl>isolated per component</Hl> — two counters have separate counts</li>
        <li style={{ ...styles.li, fontSize: presMode ? 17 : 15 }}>State updates are <Hl>asynchronous</Hl> — don't read it immediately after setting</li>
      </ul>
      </div>
  );
}

/* ── Slide 13: Summary ── */
function SummarySlide({ presMode }) {
  const items = [
    ["What is state", "Component memory — data that changes and triggers re-renders"],
    ["Class state", "this.state + this.setState — verbose, requires constructors"],
    ["useState", "const [val, setVal] = useState(init) — clean, no 'this' needed"],
    ["Server rendering", "renderToString() converts components to HTML on the server"],
    ["State mismatch", "Server & client must produce identical first render"],
    ["Initial state fix", "Embed state via window.__INITIAL_STATE__ (class approach)"],
    ["Rules of hooks", "Top level only, function components only"],
  ];
  return (
    <div style={{ textAlign: "center" }}>
      <Badge>Recap</Badge>
      <h1 style={{ ...styles.h1, fontSize: presMode ? 32 : 26 }}>What you learned today</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: presMode ? 14 : 12, margin: "1.5rem 0", textAlign: "left" }}>
        {items.map(([t, d]) => (
          <div key={t} style={{ background: "#f9fafb", borderRadius: 8, padding: presMode ? "14px 18px" : "10px 14px" }}>
            <p style={{ fontWeight: 500, fontSize: presMode ? 15 : 14, marginBottom: 2 }}>{t}</p>
            <p style={{ fontSize: presMode ? 14 : 13, color: "#6b7280" }}>{d}</p>
          </div>
        ))}
      </div>
      <h2 style={{ color: "#378add", marginTop: 12, fontSize: presMode ? 28 : 24 }}>Thank you!</h2>
      </div>
  );
}

/* ════════════════════════════════════════════════════════
   REUSABLE UI HELPERS
   ════════════════════════════════════════════════════════ */

function Badge({ children }) {
  return (
    <span style={{ display: "inline-block", fontSize: 12, fontWeight: 500, padding: "3px 10px", borderRadius: 6, background: "#e6f1fb", color: "#185fa5", marginBottom: 12 }}>
      {children}
    </span>
  );
}

function Code({ children, presMode, small }) {
  return (
    <pre style={{
      background: "#f3f4f6", border: "0.5px solid #e5e7eb", borderRadius: 8,
      padding: presMode ? (small ? "12px 16px" : "16px 20px") : "12px 16px",
      fontFamily: "monospace", fontSize: presMode ? (small ? 12 : 14) : 13, lineHeight: 1.6,
      margin: "12px 0", whiteSpace: "pre-wrap", overflowX: "auto",
    }}>
      {children}
    </pre>
  );
}

function Note({ children, presMode }) {
  return (
    <p style={{
      fontSize: presMode ? 15 : 13, color: "#6b7280",
      borderLeft: "2px solid #d1d5db", paddingLeft: 12, marginTop: 12, lineHeight: 1.6,
    }}>
      {children}
    </p>
  );
}

function Speaker({ children }) {
  return (
    <p style={{ fontSize: 13, color: "#9ca3af", borderTop: "0.5px solid #e5e7eb", marginTop: 24, paddingTop: 12, fontStyle: "italic" }}>
      {children}
    </p>
  );
}

function DemoBox({ children, presMode }) {
  return (
    <div style={{
      background: "#f9fafb", border: "0.5px solid #e5e7eb", borderRadius: 12,
      padding: presMode ? "2rem" : "1.5rem",
      display: "flex", flexDirection: "column", alignItems: "center", gap: 14,
    }}>
      {children}
    </div>
  );
}

function Hl({ children }) {
  return <span style={{ color: "#378add", fontWeight: 500 }}>{children}</span>;
}

const styles = {
  slide: { minHeight: 460, padding: "2rem 2.5rem", border: "0.5px solid #e5e7eb", borderRadius: 12, background: "#fff" },
  h1: { fontSize: 26, fontWeight: 500, marginBottom: 16 },
  p: { fontSize: 15, color: "#4b5563", marginBottom: 8, lineHeight: 1.7 },
  li: { fontSize: 15, color: "#4b5563", lineHeight: 1.7, marginBottom: 6 },
  twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", alignItems: "start" },
  badge: { display: "inline-block", fontSize: 12, fontWeight: 500, padding: "3px 10px", borderRadius: 6, background: "#f3f4f6", color: "#6b7280" },
  navBtn: { padding: "6px 16px", border: "0.5px solid #d1d5db", borderRadius: 8, background: "#fff", fontSize: 14, cursor: "pointer" },
  btn: { padding: "8px 18px", border: "0.5px solid #d1d5db", borderRadius: 8, background: "#fff", fontSize: 14, cursor: "pointer" },
  primaryBtn: { padding: "8px 18px", border: "none", borderRadius: 8, background: "#378add", color: "#fff", fontSize: 14, cursor: "pointer" },
  input: { padding: "8px 12px", border: "0.5px solid #d1d5db", borderRadius: 8, fontSize: 14, width: 220, outline: "none" },
};