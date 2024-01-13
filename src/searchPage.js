// API TMDB API data 가져오기
import { getMovieData } from "./movieAPI.js";

// 카드 만들기
const makeCards = async (getDataType, container, cardType) => {
  const movieData = await getDataType();

  const Cards = document.querySelector(container);
  Cards.innerHTML = movieData
    .map(
      (movie) =>
        `<li class =${cardType} id =${movie.id} >
    <img class="movie-img" src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}"/>
    </li>`
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
// (4) 검색어를 바탕으로 카드 생성
const form = document.querySelector("form");
const searchInput = document.querySelector("#search-input");

const showSearchResult = (searchKeyword) => {
  const movieCards = document.querySelectorAll(".${cardType}");

  movieCards.forEach((Card) => {
    const title = Card.querySelector(".movie.title").textContent.toLowerCase();
    const searchedValue = searchKeyword.toLowerCase();

    if (title.includes(searchedValue)) {
      Cards.style.display = "block";
    } else {
      Cards.style.display = "none";
    }
  });
};
form.addEventListener("submit", (event) => {
  event.preventDefault();
  showSearchResult(searchInput.value);
});

// [main page, detail page 공통] input을 클릭하면 search-page로 이동
// document.addEventListener("DOMContentLoaded", function () {
//   const searchInput = document.getElementById("search-input");

//   searchInput.addEventListener("click", function () {
//     // 검색창(input)이 클릭되면 검색 페이지로 이동
//     window.location.href = "searchPage.html";
//   });
// });

// const showSearchResult = async (searchKeyword) => {
//   // const searchedList = await getMovieData();
//   const searchedList = document.querySelector("searched-list");
//   searchedList.innerHTML = movies
//     .map(
//       (movie) => `
//       <li class="movie-card" id=${movie.id}>
//       <img class="movie-img" src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="...">
//       </li>
//     `
//     )
//     .join("");
// };

// searchInput.addEventListener("submit", (event) => {
//   event.preventDefault();
//   showSearchResult(searchInput.value);
// });

// searchInput.addEventListener("Enter", (event) => {
//   event.preventDefault();
//   let searchWord = searchInput.value;
//   window.location.href = "searchPage.html";
//   searchWord = "";

//   //   showSearchResult(searchInput.value);
// });

// const enterKey = (event) => {
//   if (event.code === "Enter") {
//     showSearchResult();
//   }
// };

// (3) 검색어에 title이 포함된 영화만 filtering and valdiation

// const filter = () => {
//   const searchElement = document.getElementById("search-input"); // input 태그
//   const searchElementInputValue = searchElement.value.toLowerCase();
//   const listInner = document.getElementsByClassName("searched-list");

//   for (let i = 0; i < listInner.length; i++) {
//     let searchTitle = listInner[i].querySelector(".movie-title");

//     if (searchTitle.textContent.toLowerCase().includes(searchElementInputValue)) {
//       listInner[i].style.display = "block";
//     } else {
//       listInner[i].style.display = "none";
//     }
//   }
// };
