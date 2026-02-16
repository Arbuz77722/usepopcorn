import { useEffect } from "react";
import { useMovie } from "./MovieContext";

const KEY = "f98302b3";
export function useMovies(query) {
  const { isLoading, error, dispatch, movies } = useMovie();

  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          dispatch({ type: "SET_ERROR", payload: "" });
          dispatch({ type: "SET_LOADING", payload: true });

          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );
          if (!res.ok)
            throw new Error("Something went wrong with the fetching!");
          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie not found");

          dispatch({ type: "SET_MOVIES", payload: data.Search });
        } catch (err) {
          if (err.name !== "AbortError") {
            dispatch({ type: "SET_ERROR", payload: err.message });
          }
        } finally {
          dispatch({ type: "SET_LOADING", payload: false });
        }
      }

      if (query.length < 3) {
        dispatch({ type: "SET_MOVIES", payload: [] });
        dispatch({ type: "SET_ERROR", payload: "" });
        return;
      }
      //   handleMovieClose();
      fetchMovies();
      return () => controller.abort();
    },
    [query, dispatch]
  );
  return { movies, isLoading, error };
}
