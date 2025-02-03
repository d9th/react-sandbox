import { useState, type ReactNode } from "react";
import "./index.css";

function App() {
  return (
    <Section>
      <Headline />
      <Counter />
    </Section>
  );
}

const Section = ({ children }: { children: ReactNode }) => {
  return <div className="m-8 space-y-4">{children}</div>;
};

const Headline = () => {
  return (
    <>
      <h1 className="text-5xl font-light">react sandbox</h1>
      <h2 className="text-3xl font-light">
        React & TS & Biome & vite & vitest & playwright
      </h2>
    </>
  );
};

const CounterNumber = ({ children }: { children: ReactNode }) => {
  return (
    <div className="stats shadow">
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
        <button
          className="btn btn-primary"
          onClick={() => setCount(c => c - 1)}
        >
          Decrement
        </button>
        <button
          className="btn btn-neutral"
          onClick={() => setCount(c => c + 1)}
        >
          Increment
        </button>
      </ButtonSection>
    </div>
  );
};

// TODO: button componentを作成する
// const Button = () => {};

export default App;
