import { Suspense } from "react";
import useUser from "../hooks/useUser";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

type Props = {
  id: number;
};

const ExampleSWR = ({ id }: Props) => {
  const { data, error } = useUser(id);

  if (error) return <div>Error: {error.message}</div>;
  return (
    <div className="card border shadow-lg m-2 w-1/3">
      <div className="card-body">
        <h2 className="card-title">SWR Example</h2>
        <Suspense fallback={<Skeleton count={4} />}>
          {data && (
            <div>
              <h3>Name: {data.name}</h3>
              <p>Email: {data.email}</p>
              <p>Phone: {data.phone}</p>
              <p>Website: {data.website}</p>
            </div>
          )}
        </Suspense>
      </div>
    </div>
  );
};

export default ExampleSWR;
