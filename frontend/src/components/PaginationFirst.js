// Lesson 43
import React, { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import axios from "axios";

async function fetchPosts(page) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log(page);
  return axios
    .get("http://localhost:4000/posts", {
      params: {
        pageSize: 10,
        pageOffset: page,
      },
    })
    .then((res) => res.data);
}

function PaginationFirst() {
  const [page, setPage] = useState(0);
  const queryClient = useQueryClient();

  const postsQuery = useQuery(["posts", { page }], () => fetchPosts(page), {
    keepPreviousData: true,
  });

  /** Get the next page data to increase user experience */
  React.useEffect(() => {
    const nextPage = postsQuery.data?.nextPageOffset;
    if (nextPage !== null) {
      queryClient.prefetchQuery(["posts", { page: nextPage }], () =>
        fetchPosts(nextPage)
      );
    }
  }, [postsQuery.data?.nextPageOffset]);

  return (
    <div>
      <h1>POSTS {postsQuery.isFetching ? "Updating ..." : null}</h1>
      <div>
        {postsQuery.isLoading ? (
          "Loading posts...."
        ) : (
          <ul>
            {postsQuery.data.items.map((post, index) => {
              return <li key={post.id}>{post.title}</li>;
            })}
          </ul>
        )}
      </div>
      <div>
        <button
          onClick={() => setPage((old) => Math.max(old - 1, 0))}
          disabled={page === 0}
        >
          Previous
        </button>
        <span>
          Page: {page + 1} {postsQuery.isFetching ? "..." : ""}
        </span>
        <button
          onClick={() => setPage((old) => Math.max(old + 1))}
          disabled={
            postsQuery.isPreviousData ||
            postsQuery.data?.nextPageOffset === null
          }
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default PaginationFirst;
