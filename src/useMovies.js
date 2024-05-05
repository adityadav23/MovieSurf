import { useEffect, useState } from "react";

const OMDB_KEY = 'ee10d2e5'
const BASE_URL  = `http://www.omdbapi.com/?apikey=${OMDB_KEY}`

export function useMovies(query, ){
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("")

    useEffect(function() {
        // callback?.()
        const controler = new AbortController()
        async function fetchMovies(){
          try {
            setErrorMsg("") //on searching movie reset the error message
            setIsLoading(true);
            const res = await fetch(`${BASE_URL}&s=${query}`,{signal: controler.signal});
            if(!res.ok){
              throw new Error('Error to fetch movie')
            }
            let movieData = await res.json()
            if(movieData.Response === 'False'){ throw new Error('Movie not Found!!')}
            setMovies(movieData.Search || [])
    
          } catch (error) {
            if(error.name !== "AbortError")
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
        return function(){ controler.abort()}
      },[query])
    
    return {movies, isLoading, errorMsg}
}