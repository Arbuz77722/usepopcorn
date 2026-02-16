const initialState = {
  query: "",
  watched: [],
  selectedId: null,
  movies: [],
  isLoading: false,
  error: "",
};

const reducer = function (state, action) {
  switch (action.type) {
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
      };
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    case "SET_QUERY":
      return { ...state, query: action.payload };

    case "SELECT_MOVIE":
      return {
        ...state,
        selectedId: state.selectedId === action.payload ? null : action.payload,
      };

    case "CLOSE_MOVIE":
      return {
        ...state,
        selectedId: null,
      };

    case "ADD_TO_WATCHED":
      return {
        ...state,
        watched: [...state.watched, action.payload],
      };

    case "DELETE_WATCHED":
      return {
        ...state,
        watched: state.watched.filter(
          (movie) => movie.imdbID !== action.payload
        ),
      };

    case "SET_MOVIES":
      return {
        ...state,
        movies: action.payload,
        error: "",
      };
    default:
      throw new Error("Unknown Action");
  }
};

export { reducer, initialState };
