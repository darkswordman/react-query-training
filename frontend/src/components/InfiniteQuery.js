// Lesson 43
import React, { useState } from "react";
import { useInfiniteQuery, useQueryClient } from "react-query";
import axios from "axios";

async function fetchPosts({ pageParam = 0}) {
  console.log('fetch prps:', pageParam);

  await new Promise((resolve) => setTimeout(resolve, 1000));
  return axios
    .get("http://localhost:4000/posts", {
      params: {
        pageSize: 10,
        pageOffset: pageParam,
      },
    })
    .then((res) => {
      const formattedRes = {
        data: res.data.items,
        nextPageOffset: res.data.nextPageOffset,
      };

      console.log("formattedOne:", formattedRes);

      return formattedRes;
    });
}

function InifiniteQuery() {
  const postsQuery = useInfiniteQuery("posts", fetchPosts, {
    getNextPageParam: (lastPage) => {
      console.log("lastPage: ", lastPage);
      return lastPage.nextPageOffset;
    },
  });

  console.log(postsQuery.data);
  return (
    <div>
      <h1>POSTS {postsQuery.isFetching ? "Updating ..." : null}</h1>
      <div>
        {postsQuery.isLoading ? (
          "Loading posts...."
        ) : (
          <ul>
            {postsQuery.data.pages.map((page, index) => {
              return (
                <React.Fragment key={index}>
                  {page.data.map((post) => (
                    <li key={post.id}>{post.title}</li>
                  ))}
                </React.Fragment>
              );
            })}
          </ul>
        )}
      </div>
      <div>
        <button
          onClick={() => postsQuery.fetchNextPage()}
          disabled={!postsQuery.hasNextPage || postsQuery.isFetchingNextPage}
        >
          {postsQuery.isFetchingNextPage
            ? "Loading more..."
            : postsQuery.hasNextPage
            ? "Load More"
            : "Nothing more to load"}
        </button>
      </div>

      <div>
        {postsQuery.isFetching && !postsQuery.isFetchingNextPage
          ? "Fetching..."
          : null}
      </div>
    </div>
  );
}

export default InifiniteQuery;
