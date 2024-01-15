import { getMovieData } from "./movieAPI.js";

// TODO#4 : .movie-list 내부 영화에 마우스 hover 시 애니메이션 및 요약 보여주기

// Top Rated Movie
const getTop3Movie = async () => {
  const topRatedData = await getMovieData.getTopRated();
  let top3 = topRatedData.slice(0, 3);

  const topMovies = document.querySelector("#top-movies");

  let movieList = "";
  top3.forEach((movie, idx) => {
    const rankSuffix = idx === 0 ? "st" : idx === 1 ? "nd" : idx === 2 ? "rd" : "th";

    const contents = `<div class ="idx${idx}" id = ${movie.id} >
    <img
    class="poster-img"
    src="https://image.tmdb.org/t/p/original${movie.backdrop_path}"
    alt="${movie.title}"
  />
  <p class="ranking">${idx + 1}${rankSuffix}</p>
  <p class="title-top">${movie.title}</p></div>`;
    movieList = movieList.concat("", contents);
  });
  topMovies.innerHTML = movieList;

  let idx0 = topMovies.querySelector("div");
  idx0.classList.add("active");
};

// get Movie List
const renderMovies = async (getDataFunction, containerId, cardClass) => {
  const movieData = await getDataFunction();
  const container = document.querySelector(containerId);

  const movieList = movieData
    .map(
      (movie) => `
      <div class="${cardClass}" id="${movie.id}">
        <img class="poster-img" src="https://image.tmdb.org/t/p/original${movie.poster_path}" />
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

// btn event
document.querySelector("#left-btn").addEventListener("click", () => {
  // 현재 active인 query의 이전 인덱스를 active로 한다. 없을 경우, 변화 없음
  let activeQuery = document.querySelector(".active");
  if (activeQuery) {
    let currentIdx = parseInt(activeQuery.classList[0].substring(3));
    let prevIdx = (currentIdx - 1 + 3) % 3; // 이전 인덱스 계산

    activeQuery.classList.remove("active");

    let nextActive = document.querySelector(`.idx${prevIdx}`);
    if (nextActive) {
      nextActive.classList.add("active");
    }
  }
});

document.querySelector("#right-btn").addEventListener("click", () => {
  // 현재 active인 query의 다음 인덱스를 active로 한다. 없을 경우, 변화 없음
  let activeQuery = document.querySelector(".active");
  if (activeQuery) {
    let currentIdx = parseInt(activeQuery.classList[0].substring(3));
    let nextIdx = (currentIdx + 1) % 3; // 다음 인덱스 계산

    activeQuery.classList.remove("active");

    let nextActive = document.querySelector(`.idx${nextIdx}`);
    if (nextActive) {
      nextActive.classList.add("active");
    }
  }
});

//main

getTop3Movie();
getNowMovie();
getPopularMovie();

// Render Now Playing Movies
renderMovies(getMovieData.getNowPlaying, "#now-movies", "now");

// Render Popular Movies
renderMovies(getMovieData.getPolular, "#popular-movies", "popular");

// Click event handler for both now-movies and popular-movies
document.querySelector(".container").addEventListener("click", function (event) {
  const clickedMovieElement = event.target.closest(".now, .popular");

  if (clickedMovieElement) {
    const clickedMovieId = clickedMovieElement.id;

    // 클릭한 영화의 ID를 가지고 detailPage.html로 이동
    window.location.href = `detailPage.html?id=${clickedMovieId}`;
  }
});

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

// [main page, detail page 공통] input을 클릭하면 search page로 이동
document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("search-input");

  searchInput.addEventListener("click", function () {
    // 검색창(input)이 클릭되면 검색 페이지로 이동
    window.location.href = "searchPage.html";
  });
});
