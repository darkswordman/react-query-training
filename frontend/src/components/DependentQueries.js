import axios from "axios";
import React from "react";
import { useQuery } from "react-query";

const email = "Sincere@april.biz";

const MyPosts = () => {
  const userQuery = useQuery("user", () =>
    axios
      .get(`https://jsonplaceholder.typicode.com/users?email=${email}`)
      .then((res) => res.data[0])
  );

  const userId = userQuery.data ? userQuery.data.id : false;

  const postsQuery = useQuery(
    "posts",
    async () => {
      await new Promise((resolve) => setTimeout(() => {resolve()}, 1000));
      return axios
        .get(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`)
        .then((res) => res.data);
    },
    {
      enabled: userId !== false,
    }
  );

  return userQuery.isLoading ? (
    "Loading user ..."
  ) : (
    <div>
      <p>User Name: {userQuery.data.name}</p>
      <p>User id: {userQuery.data.id}</p>
      {postsQuery.isIdle ? null : postsQuery.isLoading ? (
        "Loading posts ...."
      ) : (
        <div>Post count {postsQuery.data.length}</div>
      )}
    </div>
  );
};

export default function DependentQueries() {
  return (
    <div>
      <MyPosts />
    </div>
  );
}
