// LESSON 29

import axios from "axios";
import React from "react";
import { useQuery, useQueryClient } from "react-query";

const RenderTime = () => {
  const timeQuery = useQuery(
    "time",
    async () => {
      await new Promise((resolve) => setTimeout(() => resolve(), 1000));
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
      {timeQuery.isFetching && "Fetching..."}
      <br />
      {timeQuery.isLoading
        ? "Loading time ..."
        : new Date(timeQuery.data.utc_datetime).toLocaleString()}
      <br />
    </div>
  );
};

export default function QueryInvalidationOnInactive() {
  const [show, toggle] = React.useState(true);

  const queryClient = useQueryClient();


  return (
    <div>
      <h1>Server Time</h1>
      <br />
      <button onClick={() => toggle(!show)}>{show ? "Toggle" : "Show"}</button>
      <br />
      <button
        onClick={() =>
          queryClient.invalidateQueries("time", {
            refetchActive: true, // Only stale the active query from fresh, not refetch
          })
        }
      >
        Invalidate tha query
      </button>
      <br />
      {show && <RenderTime />}
    </div>
  );
}
