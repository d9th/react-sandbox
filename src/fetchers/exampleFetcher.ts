import wretch from "wretch";

export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
};

export const exampleFetcher = (url: string) => {
  return wretch(url)
    .get()
    .notFound(() => {
      throw new Error("User not found");
    })
    .json<User>();
};
