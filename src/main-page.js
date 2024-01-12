import { getMovieData } from "./movieAPI.js";

// TODO#1 : getTop3MoviePoster size setting (@media)
// TODO#2 : click 시 영화 id return
// TODO#3 : Top3 movie slide 기능 추가
// TODO#4 : 함수 최적화하기
// TODO#5 : .movie-list 내부 영화에 마우스 hover 시 애니메이션 및 요약 보여주기

// Top Rated Movie
const getTop3Movie = async () => {
  const topRatedData = await getMovieData.getTopRated();
  let top3 = topRatedData.slice(0, 3);

  const topMovies = document.querySelector("#top-movies");

  top3.forEach((movie, idx) => {
    const rankSuffix = idx === 0 ? "st" : idx === 1 ? "nd" : idx === 2 ? "rd" : "th";

    const contents = `<img
    class="poster-img"
    id = ${movie.id}
    src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
    alt="${movie.title}"
  />
  <p class="ranking">${idx + 1}${rankSuffix}</p>
  <p class="title-top">${movie.title}</p>`;
    topMovies.innerHTML = contents;
  });
};

// get Movie List
const renderMovies = async (getDataFunction, containerId, cardClass) => {
  const movieData = await getDataFunction();
  const container = document.querySelector(containerId);

  const movieList = movieData
    .map(
      (movie) => `
      <div class="${cardClass}" id="${movie.id}">
        <img class="poster-img" src="https://image.tmdb.org/t/p/w500${movie.poster_path}" />
        <p class="title-list">${movie.title}</p>
      </div>`
    )
    .join("");

  container.innerHTML = movieList;
};

// Now Playing Movie
const getNowMovie = async () => {
  await renderMovies(getMovieData.getNowPlaying, "#now-movies", "now");
};

// Popular Movie
const getPopularMovie = async () => {
  await renderMovies(getMovieData.getPolular, "#popular-movies", "popular");
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
