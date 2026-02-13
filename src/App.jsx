import { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [slide, setSlide] = useState(0);
  const [count, setCount] = useState(0);
  const [name, setName] = useState("");
  const [presentationMode, setPresentationMode] = useState(false);

  // New Example States
  const [show, setShow] = useState(true);
  const [color, setColor] = useState("white");
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");

  const slides = [
    "title",
    "intro",
    "why",
    "virtualdom",
    "components",
    "functional",
    "Classcomp",
    "jsx",
    "state",
    "props",
    "hooks",
    "example1",
    "example2",
    "example3",
    "example4",
    "example5",
    "conclusion"
  ];

  const next = () => {
    if (slide < slides.length - 1) setSlide(slide + 1);
  };

  const prev = () => {
    if (slide > 0) setSlide(slide - 1);
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "Escape") setPresentationMode(false);
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  const togglePresentation = () => {
    if (!presentationMode) {
      document.documentElement.requestFullscreen();
      setPresentationMode(true);
    } else {
      document.exitFullscreen();
      setPresentationMode(false);
    }
  };

  const renderSlide = () => {
    switch (slides[slide]) {

      case "title":
        return (
        <div className="slide slide-center">
  <h1>Getting Started with React</h1>
  <p className="presenter-names">
    Presented by <br />
    J. Seetharaman <br />
    S. Pandi
  </p>
</div>        );

      case "intro":
        return (
          <div className="slide slide-content">
            <h1>What is React?</h1>
            <p>
              React is a JavaScript library used to build user interfaces.
              <br /><br />
              Developed by Facebook to create fast, scalable applications.
              <br /><br />
              Used by Netflix, Instagram and WhatsApp Web.
            </p>
          </div>
        );

      case "why":
        return (
          <div className="slide slide-content">
            <h1>Why React Was Created</h1>
            <p>
              Before React:
              <br />• Manual DOM manipulation
              <br />• Complex code
              <br />• Poor performance
              <br /><br />
              React introduced a better UI architecture.
            </p>
          </div>
        );

      case "virtualdom":
        return (
          <div className="slide slide-content">
            <h1>Virtual DOM</h1>
            <p>
              React creates a virtual copy of the DOM.
              <br /><br />
              It compares changes and updates only required parts.
              <br /><br />
              Result → Faster and efficient UI updates.
            </p>
          </div>
        );

      case "components":
        return (
          <div className="slide slide-content">
            <h1>Components</h1>
            <p>
              Reusable building blocks of React.
              <br /><br />
              Example: Navbar, Card, Footer.
              <br /><br />
              Improves scalability and maintainability.
            </p>
          </div>
        );
        case "functional":
  return (
    <div className="slide slide-content">
      <h1>Functional Component</h1>

      <p>
        Functional components are simple JavaScript functions.
        <br /><br />
        They return JSX.
        <br /><br />
        They can use Hooks like useState and useEffect.
        <br /><br />
        Modern React mainly uses functional components.
      </p>

      <pre className="inline-example">{`function Welcome(props) {
  return <h1>Hello {props.name}</h1>;
}`}</pre>
    </div>
  );
case "Classcomp":
  return (
    <div className="slide slide-content">
      <h1>Class Component</h1>

      <p>
        Class components are ES6 classes.
        <br /><br />
        They extend React.Component.
        <br /><br />
        They must use a render() method.
        <br /><br />
        State is managed using this.state and this.setState().
      </p>

      <pre className="inline-example">{`class Welcome extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }
  render() {
    return <h1>Hello {this.props.name}</h1>;
  }
}`}</pre>
    </div>
  );

case "jsx":
  return (
    <div className="slide slide-content">
      <h1>JSX</h1>
      <p>
        JSX allows writing HTML inside JavaScript.
        <br /><br />
        It makes UI code easier to read and write.
        <br /><br />
        JSX gets converted into React.createElement() behind the scenes.
        <br /><br />
        We can embed JavaScript expressions using curly braces {"{}"}.
      </p>
      <pre className="inline-example">{`const element = <h1>Hello React</h1>;`}</pre>
    </div>
  );


case "state":
  return (
    <div className="slide slide-content">
      <h1>State</h1>
      <p>
        State is dynamic data that updates UI automatically.
        <br /><br />
        When state changes, React re-renders the component.
        <br /><br />
        State is private and managed inside the component.
        <br /><br />
        It makes applications interactive.
      </p>
      <pre className="inline-example">{`const [count, setCount] = useState(0);`}</pre>
    </div>
  );
case "props":
  return (
    <div className="slide slide-content">
      <h1>Props</h1>
      <p>
        Props pass data from parent to child components.
        <br /><br />
        Props are read-only and cannot be modified.
        <br /><br />
        They help make components reusable.
        <br /><br />
        Data flows in one direction (Unidirectional data flow).
      </p>
      <pre className="inline-example">{`<Welcome name="Pandi" />`}</pre>
    </div>
  );

case "hooks":
  return (
    <div className="slide slide-content">
      <h1>Hooks</h1>
      <p>
        Hooks allow state and lifecycle in functional components.
        <br /><br />
        Introduced in React 16.8.
        <br /><br />
        They let you reuse logic across components.
        <br /><br />
        Common hooks: useState, useEffect, useRef.
      </p>
    </div>
  );

      case "example1":
        return (
          <>
            <h1>Example 1: Counter</h1>
            <div className="example-container">
              <div className="code-box">
                <pre>
{`const [count, setCount] = useState(0);
<button onClick={() => setCount(count + 1)}>Increase</button>
<button onClick={() => setCount(0)}>Reset</button>`}
                </pre>
              </div>

              <div className="output-box">
                <h2>{count}</h2>
                <button onClick={() => setCount(count + 1)}>Increase</button>
                <button onClick={() => setCount(0)}>Reset</button>
              </div>
            </div>
          </>
        );

      case "example2":
        return (
          <>
            <h1>Example 2: Live Input</h1>
            <div className="example-container">
              <div className="code-box">
                <pre>
{`const [name, setName] = useState("");
<input type="value={name}text"onChange={(e)=>setName(e.target.value)} />
<h2>Hello {name}</h2>`}
                </pre>
              </div>

              <div className="output-box">
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <h2>Hello {name}</h2>
              </div>
            </div>
          </>
        );

      case "example3":
        return (
          <>
            <h1>Example 3: Toggle</h1>
            <div className="example-container">
              <div className="code-box">
                <pre>
{`const [show,setShow]=useState(true);
<button onClick={() => setShow(!show)}>Toggle</button>
{show && <h2>Hello React 🚀</h2>}`}
                </pre>
              </div>

              <div className="output-box">
                <button onClick={() => setShow(!show)}>Toggle</button>
                {show && <h2>Hello React 🚀</h2>}
              </div>
            </div>
          </>
        );

      case "example4":
        return (
          <>
            <h1>Example 4: Color Changer</h1>
            <div className="example-container">
              <div className="code-box">
                <pre>
{`const [color,setColor]=useState("white");
<button onClick={() => setColor("lightblue")}>Blue</button>
<button onClick={() => setColor("lightgreen")}>Green</button>
<button onClick={() => setColor("white")}>Reset</button>`}
                </pre>
              </div>

              <div className="output-box" style={{ background: color }}>
                <button onClick={() => setColor("lightblue")}>Blue</button>
                <button onClick={() => setColor("lightgreen")}>Green</button>
                <button onClick={() => setColor("white")}>Reset</button>
              </div>
            </div>
          </>
        );

      case "example5":
        return (
          <>
            <h1>Example 5: Todo</h1>
            <div className="example-container">
              <div className="code-box">
                <pre>
{`const [todos,setTodos]=useState([]);
<input value={task} onChange={(e) => setTask(e.target.value)} placeholder="Enter task"/>
<button onClick={() => {
  if (task.trim() !== "") {
    setTodos([...todos, task]);
    setTask("");
  }
}}>`}
                </pre>
              </div>

              <div className="output-box">
                <input
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  placeholder="Enter task"
                />
                <button
                  onClick={() => {
                    if (task.trim() !== "") {
                      setTodos([...todos, task]);
                      setTask("");
                    }
                  }}
                >
                  Add
                </button>

                <ul>
                  {todos.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        );

      case "conclusion":
        return (
          <div className="slide slide-content">
            <h1>Why React is Best</h1>
            <p>
              • Fast (Virtual DOM)
              <br />
              • Reusable Components
              <br />
              • Automatic Updates
              <br />
              • Scalable Architecture
            </p>
            <h2 style={{ marginTop: "30px", color: "#61dafb" }}>
              Thank You!
            </h2>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container">
      <div className="slide">{renderSlide()}</div>

      {!presentationMode && (
        <div className="controls">
          <button onClick={prev} disabled={slide === 0}>Previous</button>
          <span>{slide + 1} / {slides.length}</span>
          <button onClick={next} disabled={slide === slides.length - 1}>Next</button>
        </div>
      )}

      <button className="present-btn" onClick={togglePresentation}>
        {presentationMode ? "Exit Presentation" : "Start Presentation"}
      </button>
    </div>
  );
}
