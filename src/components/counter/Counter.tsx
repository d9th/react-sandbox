import { useState } from "react";
import Button from "../Button";
import { ButtonSection } from "../ButtonSection";
import { CounterNumber } from "./CounterNumber";

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

export default Counter;
