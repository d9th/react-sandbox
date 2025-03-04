import useSWR from "swr";
import { exampleFetcher, type User } from "../fetchers/exampleFetcher";

const useUser = (id: number) => {
  const { data } = useSWR<User, Error>(
    `https://jsonplaceholder.typicode.com/users/${id}`,
    exampleFetcher,
    { suspense: true },
  );
  if (!data) {
    throw new Error("User not found");
  }
  return { data };
};

export default useUser;
