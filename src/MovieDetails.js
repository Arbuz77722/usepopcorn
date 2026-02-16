import { useState, useEffect, useRef } from "react";
import { KEY, Loader } from "./App";
import StarRating from "./StarRating";
import { useKey } from "./useKey";

export function MovieDetails({
  selectedId,
  onMovieClose,
  onAddWatch,
  watched,
}) {
  const [movie, setMovie] = useState({});
  const [userRating, setUserRating] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  const {
    Title: title,
    Runtime: runtime,
    Poster: poster,
    Year: year,
    imdbRating,
    Plot: plot,
    Released: released,
    Director: director,
    Actors: actors,
    Genre: genre,
  } = movie;

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: +imdbRating,
      runtime: +runtime.split(" ").at(0),
      userRating,
      userRatingClicks: countRef.current,
    };
    onAddWatch(newWatchedMovie);
    onMovieClose();
  }

  const countRef = useRef(0);

  useEffect(function () {
    if (userRating) countRef.current++;
  });

  useEffect(
    function () {
      async function getMovieDetails() {
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
        );
        const data = await res.json();
        setMovie(data);
        setIsLoading(false);
      }
      getMovieDetails();
    },
    [selectedId]
  );

  useKey("Escape", onMovieClose);

  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;
      return () => (document.title = "usePopcorn");
    },
    [title]
  );

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onMovieClose}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${title}`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      + Add to list
                    </button>
                  )}
                </>
              ) : (
                <p>
                  You already rated this movie {watchedUserRating}
                  <span>⭐</span>
                </p>
              )}
            </div>

            <p>{plot}</p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
