import { useState, type ReactNode } from 'react';

function App() {
  return (
    <Section>
      <Headline />
      <Counter />
    </Section>
  );
}

const Section = ({ children }: { children: ReactNode }) => {
  return <div>{children}</div>;
};

const Headline = () => {
  return <h1>My App</h1>;
};

const CounterNumber = ({children}: { children: ReactNode }) => {
  return <h2>{children}</h2>;
};

const ButtonSection = ({ children }: { children: ReactNode }) => {
  return <div>{children}</div>;
};

// Counter sample
// props経由ではなくchildren経由でcountを表示させたい時のサンプル

const Counter = () => {
  const [count, setCount] = useState<number>(0);
  return (
    <>
      <CounterNumber>{count}</CounterNumber>
      <ButtonSection>
        <button onClick={() => setCount(c => c - 1)}>Decrement</button>
        <button onClick={() => setCount(c => c + 1)}>Increment</button>
      </ButtonSection>
    </>
  );
};

export default App;
