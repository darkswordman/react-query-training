import axios from "axios";
import React from "react";
import { useQuery, useQueryClient } from "react-query";

const Posts = () => {
  const postsQuery = useQuery('posts', fetchPosts);

  return postsQuery.isLoading ? (
    "Loading posts ..."
  ) : (
    <div>
      <ul>{postsQuery.data.map(post => <li key={post.id}>{post.title}</li>)}</ul>
      <br />
      {postsQuery.isFetching && <p>Updating ...</p>}
    </div>
  );
};

async function fetchPosts () {
    await new Promise((resolve) => setTimeout(() => resolve(), 1000));
    return axios
      .get(`https://jsonplaceholder.typicode.com/posts`)
      .then((res) => res.data);
}

export default function PrefetchQuery() {
  const queryClient = useQueryClient();
  const [show, toggle] = React.useState(false);

  React.useEffect(() => {
    queryClient.prefetchQuery('posts', fetchPosts);

  }, []);
  return (
    <div>
      <button onClick={() => toggle(!show)}>Toggle</button>
      {show && <Posts />}
    </div>
  );
}
