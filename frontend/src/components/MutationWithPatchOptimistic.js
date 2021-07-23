// LEsson 41

import React from "react";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useParams,
  Link,
} from "react-router-dom";

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
            {postsQuery.data.map((post, index) => {
              return (
                <li key={post.id}>
                  {index}
                  <Link to={`/${post.id}`}>{post.title}</Link>
                </li>
              );
            })}
          </ul>
        )}
        <hr />
      </div>
    </div>
  );
}

function PostForm({ postTitle, postId }) {
  const queryClient = useQueryClient();
  const [title, setTitle] = React.useState(postTitle);

  const postMutation = useMutation(
    async (value) => {
      await new Promise((resolve) => setTimeout(() => resolve(), 1000));

      return await axios
        .patch(`http://localhost:4000/posts/${postId}`, {
          title: value.title,
          body: "lorem ggito",
        })
        .then((res) => res.data);
    },
    {
      /** The same value sent to the useMutation async function as parameter */
      onMutate: ({ title, id }) => {
        queryClient.cancelQueries(["post", String(id)]);

        const oldPost = queryClient.getQueryData(["post", String(id)]);

        queryClient.setQueryData(["post", String(id)], (oldData) => {
          return {
            ...oldData,
            title,
          };
        });

        return () => queryClient.setQueryData(["post", String(id)], oldPost);
      },
      onSuccess: (data, values) => {
        console.log("The values :***", data);
        queryClient.setQueryData(["post", String(postId)], data);
      },
      onError: (error, values, rollback) => {
        console.log('error!', rollback)
        if (rollback) {
          rollback();
        }
      }, 
      onSettled: (data, error, values) => {
        queryClient.invalidateQueries(["post", String(values.id)]);

      },
    }
  );

  return (
    <div>
      <h2>Edit a Post</h2>
      <p>Title</p>
      <input
        id="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <br />
      <button
        disabled={postMutation.isLoading}
        onClick={() => postMutation.mutate({ title, id: postId })}
      >
        {postMutation.isLoading ? "Saving ..." : "update te post"}
      </button>
      <br />
      {postMutation.isError && <pre>{postMutation.error.response.data}</pre>}
    </div>
  );
}

function Post() {
  console.log(useParams());
  const { postId } = useParams();

  const postQuery = useQuery(
    ["post", postId],
    async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return axios
        .get(`http://localhost:4000/posts/${postId}`)
        .then((res) => res.data);
    },
    {
      initialData: () => {},
    }
  );

  return (
    <div>
      <Link to="/">Back</Link>
      <br />
      <br />
      {postQuery.isLoading ? (
        "Loading ..."
      ) : (
        <div>
          <h2>Title: {postQuery.data.title}</h2>
          <p>Post ID: {postId}</p>
        </div>
      )}
      <br />
      <br />
      {postQuery.isFetching ? "Updating ..." : null}
      <hr />
      {!postQuery.isLoading && (
        <PostForm postTitle={postQuery.data.title} postId={postId} />
      )}
    </div>
  );
}

export default function MutationWithOptimistic() {
  return (
    <Router>
      <Switch>
        <Route path="/:postId">
          <Post />
        </Route>
        <Route path="/">
          <Posts />
        </Route>
      </Switch>
    </Router>
  );
}
