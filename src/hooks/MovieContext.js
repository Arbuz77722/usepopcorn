import { createContext, useContext, useEffect, useReducer } from "react";
import { initialState, reducer } from "./MovieReducer";

const MovieContext = createContext();

function MovieProvider({ children }) {
  const [{ query, watched, selectedId, movies, isLoading }, dispatch] =
    useReducer(reducer, {
      ...initialState,
      watched: JSON.parse(localStorage.getItem("watched")) || [],
    });

  useEffect(() => {
    localStorage.setItem("watched", JSON.stringify(watched));
  }, [watched]);

  const values = { query, watched, selectedId, movies, isLoading, dispatch };
  return (
    <MovieContext.Provider value={values}>{children}</MovieContext.Provider>
  );
}

function useMovie() {
  const context = useContext(MovieContext);
  if (context === undefined)
    throw new Error("PostContext was used outside of the PostProvider");
  return context;
}

export { MovieProvider, useMovie };
