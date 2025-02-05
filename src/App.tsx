import { useState, type ReactNode } from "react";
import Button from "./components/Button";
import "./index.css";
import { SampleReducer } from "./components/SampleReducer";

function App() {
  return (
    <Section>
      <Headline />
      <Counter />
      <SampleReducer />
    </Section>
  );
}

const Section = ({ children }: { children: ReactNode }) => {
  return <div className="m-8 space-y-4">{children}</div>;
};

const Headline = () => {
  return (
    <div className="navbar">
      <div>
        <h1 className="text-5xl font-bold">react sandbox</h1>
        <h2 className="text-lg font-light">
          React & TS & tailwind & daisyUI & Biome & vite & vitest & playwright
        </h2>
      </div>
    </div>
  );
};

const CounterNumber = ({ children }: { children: ReactNode }) => {
  return (
    <div className="stats shadow-md border border-primary bg-base-300">
      <div className="stat">
        <h3 className="stat-title">Total count</h3>
        <div>
          <code className="stat-value">{children}</code>
        </div>
        <div className="stat-desc">foo bar foobar</div>
      </div>
    </div>
  );
};

const ButtonSection = ({ children }: { children: ReactNode }) => {
  return <div className="space-x-4">{children}</div>;
};

// Counter sample
// props経由ではなくchildren経由でcountを表示させたい時のサンプル

const Counter = () => {
  const [count, setCount] = useState<number>(0);
  return (
    <div className="space-y-4">
      <CounterNumber>{count}</CounterNumber>
      <ButtonSection>
        <Button className="btn-neutral" onClick={() => setCount(c => c + 1)}>
          Increment
        </Button>
        <Button className="btn-neutral" onClick={() => setCount(c => c - 1)}>
          Decrement
        </Button>
        <Button className="btn-secondary" onClick={() => setCount(0)}>
          Reset
        </Button>
      </ButtonSection>
    </div>
  );
};

export default App;
