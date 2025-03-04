import type { ReactNode } from "react";

export const CounterNumber = ({ children }: { children: ReactNode }) => {
  return (
    <div className="stats shadow-md border border-primary bg-base-300">
      <div className="stat">
        <h3 className="stat-title">Total count</h3>
        <div>
          <code className="stat-value">{children}</code>
        </div>
        <div className="stat-desc">foo bar foobar</div>
      </div>
    </div>
  );
};
