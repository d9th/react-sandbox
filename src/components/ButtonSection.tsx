import type { ReactNode } from "react";

export const ButtonSection = ({ children }: { children: ReactNode }) => {
  return <div className="space-x-4">{children}</div>;
};
