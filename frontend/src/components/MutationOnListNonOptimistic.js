import React from "react";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "react-query";

async function fetchPosts() {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const posts = await axios
    .get("http://localhost:4000/posts")
    .then((res) => res.data);

  return posts;
}

function Posts() {
  const postsQuery = useQuery("posts", fetchPosts);

  return (
    <div>
      <h1>POSTS {postsQuery.isFetching ? " ..." : null}</h1>
      <div>
        {postsQuery.isLoading ? (
          "Loading posts...."
        ) : (
          <ul>
            {postsQuery.data.map((post) => {
              return <li key={post.id}>{post.title}</li>;
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

function PostForm() {
  const queryClient = useQueryClient();
  const [title, setTitle] = React.useState("");

  const postMutation = useMutation(
    async (value) => {
      await new Promise((resolve) => setTimeout(() => resolve(), 1000));

      return await axios.post("http://localhost:4000/posts", {
        title: value,
        body: "lorem ggito",
      });
    },
    {
      /** The same value as the one sent to useMutation async function */
      onMutate: (value) => {
        console.log(value);

        // For race conditions
        queryClient.cancelQueries('posts');

        const oldPosts = queryClient.getQueryData("posts");

        queryClient.setQueryData("posts", (oldData) => {
          console.log(oldData);
          return [
            ...oldData,
            {
              id: Date.now(),
              title: value,
              body: "lorem",
            },
          ];
        });

        return () => queryClient.setQueryData("posts", oldPosts);
      },
      /** rollback is the one returned from onMutate, here it is oldPosts */
      onError: (error, values, rollback) => {
        console.log(error.response.data);

        if (rollback) {
          rollback();
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries(["posts"]);
      },
    }
  );

  return (
    <div>
      <h2>Create a new post</h2>
      <p>Title</p>
      <input
        id="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <br />
      <button
        disabled={postMutation.isLoading}
        onClick={() => postMutation.mutate(title)}
      >
        {postMutation.isLoading ? "Saving ..." : "Create te post"}
      </button>
      <br />
      {postMutation.isError && <pre>{postMutation.error.response.data}</pre>}
    </div>
  );
}

export default function MutationOnListNonOptimistic() {
  return (
    <div>
      <Posts />
      <PostForm />
    </div>
  );
}
