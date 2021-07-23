// Lesson 33

import axios from "axios";
import React from "react";
import { useQuery, useQueryClient } from "react-query";

const Posts = () => {
  const queryClient = useQueryClient();

  const postsQuery = useQuery("posts", fetchPosts);

  return postsQuery.isLoading ? (
    "Loading posts ..."
  ) : (
    <div>
      <ul>
        {postsQuery.data.map((post) => (
          <li
            key={post.id}
            onMouseEnter={() => {
              queryClient.prefetchQuery(
                ["post", post.id],
                () => fetchPost(post.id),
                {
                  staleTime: Infinity, // only fetch once
                }
              );
            }}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <br />
      {postsQuery.isFetching && <p>Updating ...</p>}
    </div>
  );
};

async function fetchPosts() {
  await new Promise((resolve) => setTimeout(() => resolve(), 1000));
  return axios
    .get(`https://jsonplaceholder.typicode.com/posts`)
    .then((res) => res.data);
}

async function fetchPost(postId) {
  await new Promise((resolve) => setTimeout(() => resolve(), 1000));
  return axios
    .get(`https://jsonplaceholder.typicode.com/posts/${postId}`)
    .then((res) => res.data);
}

export default function PrefetchWithHover() {
  const queryClient = useQueryClient();

  React.useEffect(() => {
    queryClient.prefetchQuery("posts", fetchPosts);
  }, []);
  return (
    <div>
      <h1>POSTS</h1>
      <Posts />
    </div>
  );
}
