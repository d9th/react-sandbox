import { useQuery } from "@tanstack/react-query";
import wretch from "wretch";
import type { User } from "../fetchers/exampleFetcher";

const fetcher = (id: string) => {
  const api = wretch("https://jsonplaceholder.typicode.com/users/");
  return api.get(id).json<User>();
};

type props = {
  id: string;
};
const ExampleComponentReactQuery = (props: props) => {
  const id = props.id || "1";
  const { data, isLoading, isError } = useQuery<User>({
    queryKey: ["example", id],
    queryFn: () => fetcher(id),
  });

  if (isError) {
    return <div>Error fetching data</div>;
  }

  return (
    <div>
      <h1>React Query Example</h1>
      {isLoading && <UserInfoSkeleton />}
      {data && <UserInfo user={data} />}
    </div>
  );
};

const UserInfo = ({ user }: { user: User }) => {
  return (
    <div className="card border shadow-lg m-2 w-1/3">
      <div className="card-body">
        <h2 className="card-title">{user.name}</h2>
        <p>ID: {user.id}</p>
        <p>Name: {user.email}</p>
        <p>Phone: {user.phone}</p>
      </div>
    </div>
  );
};

const UserInfoSkeleton = () => {
  return (
    <div className="card border shadow-lg m-2 w-1/3">
      <div className="card-body">
        <div className="skeleton h-4 w-1/2 mb-2"></div>
        <div className="skeleton h-4 w-full mb-2"></div>
        <div className="skeleton h-4 w-full mb-2"></div>
        <div className="skeleton h-4 w-full mb-2"></div>
      </div>
    </div>
  );
};
export default ExampleComponentReactQuery;
