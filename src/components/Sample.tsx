import "../index.css";

type Props = {
  primary: boolean;
  // propから表示を制御する際にはbooleanを使う事
  // 理由は文字列０などを渡すと表示されてしまうため
  show: boolean;
};

const defaultClassName = "btn shadow-lg";

const Sample: React.FC<Props> = ({ primary, show }) => {
  const customClassName = primary ? "btn-primary" : "btn-neutral";
  return (
    show && (
      <button className={`${defaultClassName} ${customClassName}`}>
        Sample
      </button>
    )
  );
};

export default Sample;
