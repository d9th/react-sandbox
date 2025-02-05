import { useReducer } from "react";
import Button from "./Button";
import "../index.css";

// useReducerのサンプルコンポーネント
// ボタンを３つ表示し押されたボタン名を表示する
const buttons = [
  { id: 1, name: "button1" },
  { id: 2, name: "button2" },
  { id: 3, name: "button3" },
] as const;

type ButtonName = (typeof buttons)[number]["name"];
type State = ButtonName;
type Action = "SET_ACTIVE_BUTTON";
type ActionType = { type: Action; payload: ButtonName };

const reducer = (state: State, action: ActionType) => {
  switch (action.type) {
    case "SET_ACTIVE_BUTTON":
      return action.payload;
    default:
      return state;
  }
};

export const SampleReducer = () => {
  const [activeButton, dispatch] = useReducer(reducer, "button1");
  return (
    <>
      <div className="space-x-4 space-y-4 border border-primary rounded p-4">
        <h3 className="text-3xl font-light">Reducer Example</h3>
        {buttons.map(button => (
          <Button
            className="btn-lg btn-circle btn-primary"
            key={button.id}
            onClick={() =>
              dispatch({ type: "SET_ACTIVE_BUTTON", payload: button.name })
            }
          >
            {button.id}
          </Button>
        ))}
        <p>
          active button:<code>{activeButton}</code>
        </p>
        {activeButton === "button1" && <Button1Component />}
        {activeButton === "button2" && <Button2Component />}
        {activeButton === "button3" && <Button3Component />}
      </div>
    </>
  );
};

const Button1Component = () => {
  return (
    <div className="card bg-base-200 w-96 shadow-sm">
      <figure>
        <img
          src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
          alt="Shoes"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">Button1Component</h2>
        <p>
          A card component has a figure, a body part, and inside body there are
          title and actions parts
        </p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary">Buy Now</button>
        </div>
      </div>
    </div>
  );
};
const Button2Component = () => {
  return (
    <div className="card w-96 bg-base-200 shadow-sm">
      <div className="card-body">
        <span className="badge badge-xs badge-warning">Most Popular</span>
        <div className="flex justify-between">
          <h2 className="text-3xl font-bold">Premium</h2>
          <span className="text-xl">$29/mo</span>
        </div>
        <ul className="mt-6 flex flex-col gap-2 text-xs">
          <li>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-4 me-2 inline-block text-success"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>High-resolution image generation</span>
          </li>
          <li>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-4 me-2 inline-block text-success"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>Customizable style templates</span>
          </li>
          <li>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-4 me-2 inline-block text-success"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>Batch processing capabilities</span>
          </li>
          <li>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-4 me-2 inline-block text-success"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>AI-driven image enhancements</span>
          </li>
          <li className="opacity-50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-4 me-2 inline-block text-base-content/50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="line-through">Seamless cloud integration</span>
          </li>
          <li className="opacity-50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-4 me-2 inline-block text-base-content/50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="line-through">Real-time collaboration tools</span>
          </li>
        </ul>
        <div className="mt-6">
          <button className="btn btn-primary btn-block">Subscribe</button>
        </div>
      </div>
    </div>
  );
};
const Button3Component = () => {
  return (
    <div className="card card-side w-96 bg-base-200 shadow-sm">
      <figure>
        <img
          src="https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp"
          alt="Movie"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">New movie is released!</h2>
        <p>Click the button to watch on Jetflix app.</p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary">Watch</button>
        </div>
      </div>
    </div>
  );
};
