import type { Meta, StoryObj } from "@storybook/react";

import Sample from "./Sample";

const meta = {
  component: Sample,
} satisfies Meta<typeof Sample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    primary: true,
  },
};

export const secondary: Story = {
  args: {
    primary: false,
  },
};
