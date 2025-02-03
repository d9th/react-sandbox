import "@testing-library/jest-dom";
import "@testing-library/dom";
import { render, screen, cleanup} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {afterEach, expect, test } from "vitest";
import App from "../App";

afterEach(() => {
  cleanup();
});

test("App has increment button", () => {
  render(<App />);
  const linkElement = screen.getByText(/increment/i);
  expect(linkElement).toBeInTheDocument();
});

test("App has decrement button", () => {
  render(<App />);
  const linkElement = screen.getByText(/decrement/i);
  expect(linkElement).toBeInTheDocument();
});

test("App has counter number", () => {
  render(<App />);
  const linkElement = screen.getByText("0");
  expect(linkElement).toBeInTheDocument();
});

test("Increment buttonをクリックするとカウントが1増える", async () => {
  render(<App />);
  const incrementButton = screen.getByText("Increment");
  userEvent.click(incrementButton);
  const linkElement = await screen.findByText("1");
  expect(linkElement).toBeInTheDocument();
});

