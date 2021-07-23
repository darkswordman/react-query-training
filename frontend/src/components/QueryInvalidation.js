import axios from "axios";
import React from "react";
import { useQuery, useQueryClient } from "react-query";

const useTime = () => {
  return useQuery("time", async () => {
    await new Promise((resolve) => setTimeout(() => resolve(), 1000));
    return axios
      .get("http://worldtimeapi.org/api/timezone/America/Santiago/")
      .then((res) => res.data);
  });
};

export default function QueryInvalidation() {
  const queryClient = useQueryClient();

  const timeQuery = useTime();

  return (
    <div>
      <h1>Server Time</h1>
      {timeQuery.isFetching && "Fetching..."}
      <br />
      {timeQuery.isLoading
        ? "Loading time ..."
        : new Date(timeQuery.data.utc_datetime).toLocaleString()}
      <br />
      <button onClick={() => queryClient.invalidateQueries("time")}>
        Invalidate tha query
      </button>
    </div>
  );
}
