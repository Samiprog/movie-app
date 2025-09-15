import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [query, setQuery] = useState(""); // search input
  const [movies, setMovies] = useState([]); // search results
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null); // for modal

  const API_KEY = "e4895003"; // your OMDb API key

  // Search movies by title
  const searchMovies = async () => {
    if (!query) return;
    setLoading(true);
    setError("");

    try {
      const res = await axios.get(
        `https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`
      );
      console.log(res.data); // debug

      if (res.data.Response === "True") {
        setMovies(res.data.Search);
      } else {
        setMovies([]);
        setError("No movies found!");
      }
    } catch (err)  {
      console.error(err);
      setError("Something went wrong!");
    }

    setLoading(false);
  };

  // Fetch movie details by imdbID
  const fetchMovieDetails = async (id) => {
    try {
      const res = await axios.get(
        `https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}`
      );
      setSelectedMovie(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="app">
      <h1>🎬 Movie Search</h1>

      {/* Search Box */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Search for a movie..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={searchMovies}>Search</button>
      </div>

      {/* Loading / Error Messages */}
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {/* Movie List */}
      <div className="movie-list">
        {movies.map((movie) => (
          <div key={movie.imdbID} className="movie-card">
            <img
              src={
                movie.Poster !== "N/A"
                  ? movie.Poster
                  : "https://via.placeholder.com/200"
              }
              alt={movie.Title}
            />
            <div className="movie-info">
              <h3>{movie.Title}</h3>
              <p>Year: {movie.Year}</p>
              <button onClick={() => fetchMovieDetails(movie.imdbID)}>
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Movie Details Modal */}
      {selectedMovie && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setSelectedMovie(null)}>
              &times;
            </span>
            <h2>{selectedMovie.Title}</h2>
            <img
              src={selectedMovie.Poster}
              alt={selectedMovie.Title}
              style={{ width: "200px", borderRadius: "10px" }}
            />
            <p>
              <strong>Year:</strong> {selectedMovie.Year}
            </p>
            <p>
              <strong>Genre:</strong> {selectedMovie.Genre}
            </p>
            <p>
              <strong>Director:</strong> {selectedMovie.Director}
            </p>
            <p>
              <strong>Plot:</strong> {selectedMovie.Plot}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
