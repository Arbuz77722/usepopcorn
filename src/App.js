import { MovieDetails } from "./MovieDetails";
import { WatchedSummary } from "./WatchedSummary";
import { Box } from "./Box";
import { MoviesList } from "./MoviesList";
import { Main } from "./Main";
import { WatchedMoviesList } from "./WatchedMoviesList";
import { useMovies } from "./hooks/useMovies";
import { useKey } from "./useKey";
import { useMovie } from "./hooks/MovieContext";
import { useRef } from "react";

export const KEY = "f98302b3";

export const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const { query, dispatch, watched, selectedId } = useMovie();

  function handleMovieSelect(id) {
    dispatch({ type: "SELECT_MOVIE", payload: id });
  }

  function handleMovieClose() {
    dispatch({ type: "CLOSE_MOVIE" });
  }

  function handleAddWatched(movie) {
    dispatch({
      type: "ADD_TO_WATCHED",
      payload: movie,
    });
  }

  function handleWatchedDelete(id) {
    dispatch({ type: "DELETE_WATCHED", payload: id });
  }

  const { movies, isLoading, error } = useMovies(query);

  return (
    <>
      <NavBar>
        <Logo />
        <Search
          query={query}
          setQuery={(q) => dispatch({ type: "SET_QUERY", payload: q })}
        />

        <NumResult movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {error && <ErrorMessage message={error} />}
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MoviesList movies={movies} onMovieSelect={handleMovieSelect} />
          )}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onMovieClose={handleMovieClose}
              onAddWatch={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onDeleteWatched={handleWatchedDelete}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function NavBar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function Search({ query, setQuery }) {
  const inputElement = useRef(null);

  useKey("Enter", function () {
    if (document.activeElement === inputElement.current) return;
    inputElement.current.focus();
    setQuery("");
  });
  return (
    <input
      ref={inputElement}
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function NumResult({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}
export function Loader() {
  return <p className="loader">Loading...</p>;
}

function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>⛔</span>
      {message}
    </p>
  );
}
