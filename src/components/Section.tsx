import type { ReactNode } from "react";

export const Section = ({ children }: { children: ReactNode }) => {
  return <div className="m-8 space-y-4">{children}</div>;
};
