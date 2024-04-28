import { Children, useEffect, useState } from "react";
import StarRating from "./StarRating";
const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const OMDB_KEY = 'ee10d2e5'
const BASE_URL  = `http://www.omdbapi.com/?apikey=${OMDB_KEY}`
export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [query, setQuery] = useState("Hey");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("")
  const [selectedId, setSelectedId] = useState(null);

  function handleSelectMovie(id){
    if(selectedId !== id)setSelectedId(id);
    else setSelectedId(null)
  }
  function closeSelectMovie(){
    setSelectedId(null);
  }
  function handleWatchedMovie(movie){
    const watchedMovie = watched.find(watchedMovie=> watchedMovie.imdbID == movie.imdbID);
    if(watchedMovie){
        return false;
      }
      setWatched(watched=> [...watched, movie])
      return true;
  }
  function removeFromWatchedList(id){
    setWatched(watched=> watched.filter(movie=> movie.imdbID !== id))
  }
  useEffect(function() {
    async function fetchMovies(){
      try {
        setErrorMsg("") //on searching movie reset the error message
        setIsLoading(true);
        const res = await fetch(`${BASE_URL}&s=${query}`);
        if(!res.ok){
          throw new Error('Error to fetch movie')
        }
        let movieData = await res.json()
        if(movieData.Response === 'False'){ throw new Error('Movie not Found!!')}
        setMovies(movieData.Search || [])
        setIsLoading(false)
        
      } catch (error) {
        setErrorMsg(error.message)
      }finally{
        setIsLoading(false)
      }
    }

    if(query.length<=2){ //if movie search query is less than 2 words don't search
      setErrorMsg("");
      setMovies([]);
      return;
    }
    fetchMovies()
  },[query])
  return (
    <>
      <Navbar>
        <Logo></Logo>
        <Search query={query} setQuery={setQuery}></Search>
        <NumResults movies={movies}></NumResults>
      </Navbar>

      <Main>
        <Box>
          {/* {isLoading ? <Loader/> :< MovieList movies={movies}/>} */}
          {isLoading && <Loader></Loader>}
          {errorMsg && <ErrorMessage message={errorMsg}></ErrorMessage>}
          {!isLoading && !errorMsg && (
            <MovieList movies={movies} setSelectedId={handleSelectMovie} />
          )}
        </Box>

        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              closeSelectMovie={closeSelectMovie}
              onAddWatched={handleWatchedMovie}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList watched={watched} removeFromWatchedList={removeFromWatchedList}/>
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function MovieDetails({selectedId, closeSelectMovie, onAddWatched, watched}){
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  // const [errorMsg, setErrorMsg] = useState("");
  const [userRating, setUserRating] = useState(0)
  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId) 
  const watchedMovieData =  watched.find((movie) => movie.imdbID === selectedId);
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;
  function handleAdd(){
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
    };
    const addedMovie = onAddWatched(newWatchedMovie);
    closeSelectMovie()
  }
  useEffect(function() {
    async function fetchMovie(){
      try {
        // setErrorMsg("") //on searching movie reset the error message
        setIsLoading(true);
        const res = await fetch(`${BASE_URL}&i=${selectedId}`);
        if(!res.ok){
          throw new Error('Error to fetch movie')
        }
        let movieData = await res.json()
        if(movieData.Response === 'False'){ throw new Error('Movie not Found!!')}
        setMovie(movieData || [])
        setIsLoading(false)
        
      } catch (error) {
        // setErrorMsg(error.message)
      }finally{
        setIsLoading(false)
      }
    }
    fetchMovie()
  },[selectedId]);
  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;

      return function () {
        document.title = "usePopcorn";
        // console.log(`Clean up effect for movie ${title}`);
      };
    },
    [title]
  );
  return (<div className="details" >
  {isLoading ? (
    <Loader />
  ) : (
    <>
      <header>
        <button className="btn-back" onClick={closeSelectMovie}>
          &larr;
        </button>
        <img src={poster} alt={`Poster of ${movie} movie`} />
        <div className="details-overview">
          <h2>{title}</h2>
          <p>
            {released} &bull; {runtime}
          </p>
          <p>{genre}</p>
          <p>
            <span>⭐️</span>
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
                  {"+ Add to list"}
                </button>
              )} 
            </>
          ) : (
            <p>
              You rated with movie {watchedMovieData?.userRating} <span>⭐️</span>
            </p>
          )}
        </div>
        <p>
          <em>{plot}</em>
        </p>
        <p>Starring {actors}</p>
        <p>Directed by {director}</p>
      </section>
    </>
  )}
</div>
);
}

function Loader(){
  return (<div className="loader">Loading...</div>)
}
function ErrorMessage({message}){
  return (<div className="error">{message}</div>)
}
function Main({children}){
  return (
    <main className="main">
      {children}
    </main>

  )
}

// function WatchedBox(){
//   const [watched, setWatched] = useState(tempWatchedData);
//   const [isOpen2, setIsOpen2] = useState(true);

//     return (<div className="box">
//   <button
//     className="btn-toggle"
//     onClick={() => setIsOpen2((open) => !open)}
//   >
//     {isOpen2 ? "–" : "+"}
//   </button>
//   {isOpen2 && (
    
//   )}
// </div>)
// }

function WatchedMoviesList({watched, removeFromWatchedList}){
  return (<ul className="list">
  {watched.map((movie) => (
     <WatchedMovie movie={movie } key={movie.imdbID} removeFromWatchedList={removeFromWatchedList}/>
  ))}
</ul>)
}

function WatchedMovie({movie, removeFromWatchedList}){
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
      <button className="btn-delete" onClick={()=>removeFromWatchedList(movie.imdbID)}>X</button>
      </div>
    </li>

  )
}

function WatchedSummary({watched}) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function Box({children}){
  const [isOpen, setIsOpen] = useState(true);

  return (<div className="box">
  <button
    className="btn-toggle"
    onClick={() => setIsOpen((open) => !open)}
  >
    {isOpen ? "–" : "+"}
  </button>
  {isOpen && children}
</div>)
}

function MovieList({movies,setSelectedId}){
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} setSelectedId={setSelectedId} />
      ))}
    </ul>
  );
}

function Movie({movie, setSelectedId}){
  return <li onClick={()=>setSelectedId(movie.imdbID)}>
  <img src={movie.Poster} alt={`${movie.Title} poster`} />
  <h3>{movie.Title}</h3>
  <div>
    <p>
      <span>🗓</span>
      <span>{movie.Year}</span>
    </p>
  </div>
</li>
}

function Navbar({children}) {

  return (
    <nav className="nav-bar">
      {children}
    </nav>
  );
}

function NumResults({movies}){
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Logo(){
 return <div className="logo">
        <span role="img">🍿</span>
        <h1>usePopcorn</h1>
      </div>
}

function Search({query, setQuery}){
  return ( <input
    className="search"
    type="text"
    placeholder="Search movies..."
    value={query}
    onChange={(e) => setQuery(e.target.value)}
  />)
}