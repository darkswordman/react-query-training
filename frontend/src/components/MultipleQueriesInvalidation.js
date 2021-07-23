// LESSON 29

import axios from "axios";
import React from "react";
import { useQuery, useQueryClient } from "react-query";

const RenderTime = ({ subKey }) => {
  const timeQuery = useQuery(
    ["time", subKey],
    async () => {
      const randTime = Math.random() * 3000;
      await new Promise((resolve) => setTimeout(() => resolve(), randTime));
      return axios
        .get("http://worldtimeapi.org/api/timezone/America/Santiago/")
        .then((res) => res.data);
    },
    {
      staleTime: Infinity,
    }
  );

  return (
    <div>
      <h1>Server Time</h1>
      <br />
      {timeQuery.isFetching && "Fetching..."}
      <br />
      {timeQuery.isLoading
        ? "Loading time ..."
        : new Date(timeQuery.data.utc_datetime).toLocaleString()}
      <br />
    </div>
  );
};

export default function MultipleQueriesInvalidation() {
  const queryClient = useQueryClient();

  return (
    <div>
      <button onClick={() => queryClient.invalidateQueries("time")}>
        Invalidate tALL queries at once
      </button>
      <button onClick={() => queryClient.invalidateQueries(["time", "A"])}>
        Invalidate One query
      </button>
      <button onClick={() => queryClient.invalidateQueries(["time", "B"])}>
        Invalidate Two query
      </button>
      <button onClick={() => queryClient.invalidateQueries(["time", "C"])}>
        Invalidate Three query
      </button>
      <br />
      <RenderTime subKey="A" />
      <RenderTime subKey="B" />
      <RenderTime subKey="C" />
    </div>
  );
}
