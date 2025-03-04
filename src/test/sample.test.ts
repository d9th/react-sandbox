import { expect, test } from "vitest";

const sum = (a: number, b: number) => a + b;

// test example
test("adds 1 + 2 to equal 3", () => {
  expect(sum(1, 2)).toBe(3);
});

test("Number()のテスト", () => {
  expect(Number("1")).toBe(1);
  expect(Number("1.1")).toBe(1.1);
  expect(Number("1.1.1")).toBeNaN();
  expect(Number("")).toBe(0);
  expect(Number(undefined)).toBeNaN();
  expect(Number("0")).toBe(0);
});
