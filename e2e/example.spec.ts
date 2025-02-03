import { expect, test } from "@playwright/test";

test("h1のテキストが存在する事", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "react sandbox" }),
  ).toBeVisible();
});

test("increment buttonをクリックするとカウント数が1増える事", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "increment" }).click();
  await expect(page.getByRole("code")).toHaveText("1");
});

test("decrement buttonをクリックするとカウント数が1減る事", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "decrement" }).click();
  await expect(page.getByRole("code")).toHaveText("-1");
});
