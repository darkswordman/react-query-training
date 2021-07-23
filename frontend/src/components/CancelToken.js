import { useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { CancelToken } from "axios";

const usePokemon = () => {
  return useQuery(
    "pokemon",
    async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // if (true) {
      //   throw new Error("Test error");
      // }
      return axios
        .get("https://pokeapi.co/api/v2/pokemon")
        .then((res) => res.data.results);
    },
    {
      cacheTime: 5 * 1000,
      // refetchOnWindowFocus: true,
      // staleTime: 5 * 1000,
    }
  );
};

const PokemonSearch = ({ pokemon }) => {
  console.log(pokemon !== "");
  const queryInfo = useQuery(
    ["pokemon-search", pokemon],
    () => {
      const source = CancelToken.source();

      const promise = new Promise((resolve) => setTimeout(resolve, 1000)).then(
        () =>
          axios
            .get(`https://pokeapi.co/api/v2/pokemon/${pokemon}`, {
              cancelToken: source.token,
            })
            .then((res) => res.data)
      );

      promise.cancel = () => {
        source.cancel("Query was cancelled by React Query");
      };

      return promise;
    },
    {
      retry: 0,
      enabled: pokemon !== "",
    }
  );

  console.log(queryInfo.data);

  return queryInfo.isLoading ? (
    "Loading..."
  ) : queryInfo.isError ? (
    queryInfo.error.message
  ) : (
    <div>
      {queryInfo.data?.sprites?.front_default ? (
        <img src={queryInfo.data.sprites.front_default} alt="pokemin" />
      ) : (
        "Pokemon not found"
      )}
      <br />
      {queryInfo.isFetching ? "Updating... " : null}
    </div>
  );
};

const CancelTokenComponent = () => {
  console.log("Re render CancelTokenComponent.sj");
  const [pokemon, setPokemon] = useState("");

  return (
    <div>
      <input value={pokemon} onChange={(e) => setPokemon(e.target.value)} />
      <br />
      <PokemonSearch pokemon={pokemon} />
    </div>
  );
};

export default CancelTokenComponent;
