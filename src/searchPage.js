// API TMDB API data 가져오기
import { getMovieData } from "./movieAPI.js";

// 카드 만들기
const makeCards = async (getDataType, container, cardType) => {
  const movieData = await getDataType();

  const Cards = document.querySelector(container);
  Cards.innerHTML = movieData
    .map(
      (movie) => `
    <li class ="movie-card" name="${cardType}">
    <h1 class="movie-title" id="${movie.title}"></h1>
    <img class="movie-img" src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt=${movie.title}/>
    </li>
    `
    )
    .join("");
};

// Top-Rated
const getTopMovie = async () => {
  await makeCards(getMovieData.getTopRated, "#top-list", "top");
};

// Now-Playing
const getNowMovie = async () => {
  await makeCards(getMovieData.getNowPlaying, "#now-list", "now");
};

// Popular
const getPopularMovie = async () => {
  await makeCards(getMovieData.getPolular, "#popular-list", "popular");
};

getTopMovie();
getNowMovie();
getPopularMovie();

// 검색
// 검색어에 title이 포함된 영화만 filtering
const showSearchResult = (searchKeyword) => {
  const movieCards = document.querySelectorAll(".movie-card");

  movieCards.forEach((card) => {
    const title = card.querySelector(".movie-title").id.toLowerCase();
    const searchedValue = searchKeyword.toLowerCase();

    if (title.includes(searchedValue)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
};

// form 제출 시 검색 결과 표시
const form = document.querySelector("#search-form");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const searchInput = document.querySelector("#search-input");
  showSearchResult(searchInput.value);
});

// 검색어 입력 시 실시간으로 검색 결과 표시
const searchInput = document.querySelector("#search-input");
searchInput.addEventListener("input", () => {
  showSearchResult(searchInput.value);
});

// 검색
// const filter = () => {
//   const searchElement = document.getElementById("search-input"); // input 태그
//   const searchElementInputValue = searchElement.value.toLowerCase();
//   const listInner = document.getElementsByName("cardType");

//   for (let i = 0; i < listInner.length; i++) {
//     let searchTitle = listInner[i].querySelector("${movie.title}");

//     if (searchTitle.textContent.toLowerCase().includes(searchElementInputValue)) {
//       listInner[i].style.display = "";
//     } else {
//       listInner[i].style.display = "none";
//     }
//   }
// };

// [main page, detail page 공통] input을 클릭하면 search page로 이동
// document.addEventListener("DOMContentLoaded", function () {
//   const searchInput = document.getElementById("search-input");

//   searchInput.addEventListener("click", function () {
//     // 검색창(input)이 클릭되면 검색 페이지로 이동
//     window.location.href = "searchPage.html";
//   });
// });
