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

const getNewMovie = async () => {
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
//main

getTop3Movie();
//getNewMovie();

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
