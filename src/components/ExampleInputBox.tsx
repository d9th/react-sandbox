import { Suspense, ChangeEvent, FocusEvent, FormEvent, useState } from "react";
import useUser from "../hooks/useUser";
import UserInfo from "./UserInfo";
import { ErrorBoundary } from "react-error-boundary";

type UserDisplayProps = {
  userId: number;
};

const UserDisplay: React.FC<UserDisplayProps> = ({ userId }) => {
  const { data: user } = useUser(userId);

  return <UserInfo user={user} />;
};

const ExampleLoading: React.FC = () => {
  return (
    <div className="card border shadow-lg m-2 w-1/3">
      <div className="card-body">
        <div className="skeleton h-4 w-full mb-2"></div>
        <div className="skeleton h-4 w-full mb-2"></div>
        <div className="skeleton h-4 w-full mb-2"></div>
        <div className="skeleton h-4 w-full mb-2"></div>
      </div>
    </div>
  );
};

const ExampleInputBox: React.FC = () => {
  const [inputValue, setInputValue] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === "") {
      setInputValue(null);
      return;
    }
    setInputValue(event.target.value);
  };

  const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
    event.target.select();
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (inputValue !== null) {
      const newValue = Number(inputValue);
      if (!isNaN(newValue)) {
        setUserId(newValue);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label className="input input-primary">
        <input
          type="text"
          className="grow"
          placeholder="Enter user ID"
          value={inputValue ?? ""}
          onChange={handleChange}
          onFocus={handleFocus}
        />
      </label>
      <button type="submit" className="btn btn-primary">
        Search
      </button>
      {userId !== null && (
        <Suspense fallback={<ExampleLoading />}>
          <ErrorBoundary
            FallbackComponent={fallbackRender}
            onReset={() => {
              setInputValue(null);
              setUserId(null);
            }}
          >
            <UserDisplay userId={userId} />
          </ErrorBoundary>
        </Suspense>
      )}
    </form>
  );
};

const fallbackRender = ({
  error,
  resetErrorBoundary,
}: { error: Error; resetErrorBoundary: () => void }) => {
  return (
    <div className="error">
      <p>Error: {error.message}</p>
      <button className="btn btn-warning" onClick={resetErrorBoundary}>
        Try again
      </button>
      <p>Please check your user ID and try again.</p>
    </div>
  );
};

export default ExampleInputBox;
