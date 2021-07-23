import React from "react";
import axios from "axios";
import { useQuery } from "react-query";
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
    .get("https://jsonplaceholder.typicode.com/posts")
    .then((res) => res.data);

  return posts;
}

function Posts() {
  const postsQuery = useQuery("posts", fetchPosts);

  return (
    <div>
      <h1>POSTS</h1>
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
                  <Link to={`/${post.id}`}>{post.title}</Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
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
        .get(`https://jsonplaceholder.typicode.com/posts/${postId}`)
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
      {postQuery.isLoading ? "Loading ..." : postQuery.data.title}
      <br />
      <br />
      {postQuery.isFetching ? "Updating ..." : null}
    </div>
  );
}

export default function ScrollRestoration() {
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
