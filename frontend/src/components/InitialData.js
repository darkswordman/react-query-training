import axios from "axios";
import React from "react";
import { useQuery } from "react-query";

const email = "Sincere@april.biz";
const initialUser = {
  id: 100,
  name: "PEPESITO",
  username: "Bret",
};

const MyPosts = () => {
  const userQuery = useQuery(
    "user",
    async () => {
      await new Promise((resolve) => setTimeout(() => resolve(), 1000));
      return axios
        .get(`https://jsonplaceholder.typicode.com/users?email=${email}`)
        .then((res) => res.data[0]);
    },
    {
      initialData: initialUser,
      staleTime: 2 * 1000,
    }
  );

  return userQuery.isLoading ? (
    "Loading user ..."
  ) : (
    <div>
      <pre>{JSON.stringify(userQuery.data, null, 2)}</pre>
      <br />
      {userQuery.isFetching && <p>Updating ...</p>}
    </div>
  );
};

export default function InitialData() {
  return (
    <div>
      <MyPosts />
    </div>
  );
}
