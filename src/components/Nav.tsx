import type { ReactNode } from "react";

export const Nav = ({ children }: { children: ReactNode }) => {
  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="text-xl font-bold">{children}</div>
    </div>
  );
};
