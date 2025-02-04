import type { ComponentPropsWithoutRef } from "react";
import "../index.css";

type Props = ComponentPropsWithoutRef<"button">;

const defaultClassName = "btn";

const Button = (props: Props) => {
  const { children } = props;
  return (
    <button {...props} className={`${defaultClassName} ${props.className}`}>
      {children}
    </button>
  );
};

export default Button;
