// API로부터 id, title, overview, popularity, poster_path 가져오기
const MOVIE_API = config.apikey;
const base_url = "https://api.themoviedb.org/3/movie/";
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyYjRiZDE4MjE1N2I1Njk3NzdiNDY2MmI4Y2YwYjRjZiIsInN1YiI6IjY1OWI4MjM0Y2E0ZjY3MDBmMDQzZmNkZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.evSRwAo9ZsM7AIVmH0vskk5w3H6aFJBBPclFZwRsBHE"
  }
};

// fetching movie data from TMDB(base_url)
const fetchMovieData = async (endpoint) => {
  try {
    const response = await fetch(`${base_url}${endpoint}?language=ko&api_key=${MOVIE_API}`);
    const jsonData = await response.json();
    return jsonData.results;
  } catch (err) {
    console.log(err);
    return [];
  }
};

// get data from TMDB
const getMovieData = {
  //  get Top Rated Movie Data frome TMDB API
  getTopRated: async () => await fetchMovieData("top_rated"),

  //  get Now Playing Movie Data from TMDB API
  getNowPlaying: async () => await fetchMovieData("now_playing"),

  //  get Polular Movie Data from TMDB API
  getPolular: async () => await fetchMovieData("popular"),

  getMovieDetails: async (movieId) => {
    try {
      const response = await fetch(`${base_url}${movieId}?language=ko&api_key=${MOVIE_API}`);
      const jsonData = await response.json();
      return jsonData;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
};

export { getMovieData, fetchMovieData, options };
