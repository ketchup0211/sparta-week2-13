// API TMDB API data 가져오기
import { getMovieData } from "./movieAPI.js";

// 카드 만들기
const makeCards = async (getDataType, container, cardType) => {
  const movieData = await getDataType();
  const Cards = document.querySelector(container);

  if (!Array.isArray(movieData)) {
    throw new Error("Invalid data format");
  }

  Cards.innerHTML = movieData
    .map(
      (movie) => `
    <div class ="movie-card" name="${cardType}">
    <h1 class="movie-title" id="${movie.id}"></h1>
    <img class="movie-img" src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt=${movie.title}/>
    </div>
    `
    )
    .join("");
  console.log(Cards);
};

// 검색 -
const searchAndUpdateCards = async (searchKeyword) => {
  try {
    if (!searchKeyword.trim()) {
      console.log("유효하지 않은 검색어");
      return;
    }

    // TMDB API : search movie
    const searchResult = await getMovieData.search(searchKeyword);

    // TMDB API : search, Top Rated, Now Playing, Popular
    const topMovies = await getMovieData.getTopRated();
    const nowPlayingMovies = await getMovieData.getNowPlaying();
    const popularMovies = await getMovieData.getPolular();

    const allMovies = [...topMovies, ...nowPlayingMovies, ...popularMovies];

    // 검색 결과 메세지
    const searchContainer = document.querySelector("#search-list");
    const messageContainer = document.querySelector("#search-message");
    const messageElement = document.createElement("h4");

    searchContainer.innerHTML = "";
    messageContainer.innerHTML = "";

    messageElement.textContent = `"${searchKeyword}"에 대한 검색 결과`;
    messageContainer.appendChild(messageElement);

    // 검색 결과 필터링 : 전체 영화 중에서 top, now playing, popular
    const filteredSearchResults = searchResult.results.filter((searchedMovie) =>
      allMovies.some((movie) => movie.id === searchedMovie.id && movie.title === searchedMovie.title)
    );

    if (filteredSearchResults.length > 0) {
      makeCards(async () => filteredSearchResults, "#search-list", "search");
    } else {
      const noResultsMessage = document.createElement("h5");
      noResultsMessage.textContent = `"${searchKeyword}"에 대한 검색 결과가 없습니다.`;
      searchContainer.appendChild(noResultsMessage);
    }
  } catch (error) {
    console.error(error);
  }
};

// 검색어를 입력하고  제출 시 검색 결과 표시
const form = document.querySelector("#search-form");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const searchInput = document.querySelector("#search-input");
  searchAndUpdateCards(searchInput.value);
});

// 검색어 입력 시 실시간으로 검색 결과 표시
const searchInput = document.querySelector("#search-input");
searchInput.addEventListener("keyup", () => {
  searchAndUpdateCards(searchInput.value);
});

// 검색 결과 나온 영화 카드를 클릭하면 상세 페이지로 이동
document.querySelector("#search-list").addEventListener("click", function (event) {
  const clickedMovieElement = event.target.closest(".movie-card");

  if (clickedMovieElement) {
    const clickedMovieId = clickedMovieElement.querySelector(".movie-title").id;

    // 클릭한 영화의 ID를 가지고 detailPage.html로 이동
    window.location.href = `detailPage.html?id=${clickedMovieId}`;
  }
});
