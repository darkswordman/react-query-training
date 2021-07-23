import React from "react";
import axios from "axios";
import { useQuery } from "react-query";

async function fetchPosts() {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const posts = await axios
    .get("https://jsonplaceholder.typicode.com/posts")
    .then((res) => res.data);

  return posts;
}

function Posts({ setPostId }) {
  const [count, increment] = React.useReducer((d) => d + 1, 0);
  const postsQuery = useQuery("posts", fetchPosts, {
    onSuccess: (data) => {
      increment();
    },
    onSettled: (data, error) => {
      console.log(
        "Will get data undefined if error, otherwise error willbe undefined"
      );
    },
  });

  return (
    <div>
      <h1>POSTS</h1>
      <h6>{count}</h6>
      <h3>{postsQuery.isFetching ? "Updating ..." : null}</h3>
      <div>
        {postsQuery.isLoading ? (
          "Loading posts...."
        ) : (
          <ul>
            {postsQuery.data.map((post, index) => {
              return (
                <li key={post.id}>
                  {index}
                  <a onClick={() => setPostId(post.id)} href="#">
                    {post.title}
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

function Post({ postId, setPostId }) {
  const postQuery = useQuery(
    ["post", postId],
    async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return axios
        .get(`https://jsonplaceholder.typicode.com/posts/${postId}`)
        .then((res) => res.data);
    },
    {
      initialData: () => {},
    }
  );

  return (
    <div>
      <a onClick={() => setPostId(-1)} href="#">
        Back
      </a>
      <br />
      <br />
      {postQuery.isLoading ? "Loading ..." : postQuery.data.title}
      <br />
      <br />
      {postQuery.isFetching ? "Updating ..." : null}
    </div>
  );
}

export default function CountRequests() {
  const [postId, setPostId] = React.useState(-1);

  return (
    <div>
      {postId > -1 ? (
        <Post postId={postId} setPostId={setPostId} />
      ) : (
        <Posts setPostId={setPostId} />
      )}
    </div>
  );
}
