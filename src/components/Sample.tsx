import "../index.css";

type Props = {
  primary: boolean;
};

const defaultClassName = "btn shadow-lg";

const Sample: React.FC<Props> = ({ primary }) => {
  const customClassName = primary ? "btn-primary" : "btn-neutral";
  return (
    <button className={`${defaultClassName} ${customClassName}`}>Sample</button>
  );
};

export default Sample;
