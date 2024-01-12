import { getMovieData } from "./movieAPI.js";

// Top Rated Movie
// TOP 3를 순서대로 받아온다.
const getTop3Movie = async () => {
  const topRatedData = await getMovieData.getTopRated();
  let top3 = topRatedData.slice(0, 3);

  const topMovies = document.querySelector("#top-movies");

  top3.forEach((movie, idx) => {
    // TODO : Poster size setting (@media)
    let rank = "";
    switch (idx) {
      case 0:
        rank = "st";
        break;
      case 1:
        rank = "nd";
        break;
      case 2:
        rank = "rd";
        break;
      default:
        rank = "th";
    }
    const contents = `<img
    class="poster-img"
    id = ${movie.id}
    src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
    alt="${movie.title}"
  />
  <p class="ranking">${idx + 1}${rank}</p>
  <p class="title-top">${movie.title}</p>`;
    topMovies.innerHTML = contents;
  });
};

//  Now Playing Movie
//  현재 상영중인 영화 데이터를 받아온다.
const getNowMovie = async () => {
  const nowPlayingData = await getMovieData.getNowPlaying();

  const nowMovies = document.querySelector("#now-movies");

  let movieList = "";
  nowPlayingData.forEach((movie) => {
    let card = `<div class="now" id=${movie.id}>
    <img
      class="poster-img"
      src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
    />
    <p class="title-list">${movie.title}</p>
  </div>`;
    movieList = movieList.concat(card);
  });
  nowMovies.innerHTML = movieList;
};

//  Now Playing Movie
//  현재 상영중인 영화 데이터를 받아온다.
const getPopularMovie = async () => {
  const popularData = await getMovieData.getPolular();

  const popularMovies = document.querySelector("#popular-movies");

  let movieList = "";
  popularData.forEach((movie) => {
    let card = `<div class="now" id=${movie.id}>
      <img
        class="poster-img"
        src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
      />
      <p class="title-list">${movie.title}</p>
    </div>`;
    movieList = movieList.concat(card);
  });
  popularMovies.innerHTML = movieList;
};

//main

getTop3Movie();
getNowMovie();
getPopularMovie();

// Top Rated Card Create
// const createMovieCards = async () => {
//   const topRatedData = await getMovieData.getTopRated();

//   const topMovies = document.querySelector("#top-movies");

//   topMovies.innerHTML = data
//     .map(
//       (movie) =>
//         `<div class ="card" id=${movie.id}>
//       <img class="img" src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
//       <h3 class="title">${movie.title}</h3>
//       <p>${movie.overview}</p>
//       <p>Rating : ${movie.vote_average}</p>
//     </div>`
//     )
//     .join("");

//   card_container.addEventListener("click", clickCard);
//   function clickCard({ target }) {
//     if (target === card_container) return;
//     if (target.matches(".card")) alert(`영화 id : ${target.id}`);
//     else alert(`영화 id : ${target.parentNode.id}`);
//   }
// };

/**
 * <img
              class="poster-img"
              src="https://d2k5miyk6y5zf0.cloudfront.net/article/MYH/20210204/MYH20210204009900038.jpg"
              alt="movie poster"
            />
            <p class="ranking">1st</p>
            <p class="title-top">미나리</p>
 */
