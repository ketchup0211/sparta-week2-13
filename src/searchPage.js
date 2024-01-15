// API TMDB API data 가져오기
import { getMovieData } from "./movieAPI.js";

// 카드 만들기
const makeCards = async (getDataType, container, cardType) => {
  const movieData = await getDataType();
  const Cards = document.querySelector(container);

  if (!Array.isArray(movieData)) {
    throw new Error(`유효하지 않은 데이터입니다.`);
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

// 검색 메세지
const showMessage = (container, message) => {
  const messageElement = document.createElement("h4");
  messageElement.textContent = message;
  container.innerHTML = "";
  container.appendChild(messageElement);
};

// 검색 결과에 맞는 카드 나타내기
const searchAndUpdateCards = async (searchKeyword) => {
  try {
    // 유효성 검사 : 빈문자열 검색 시
    if (!searchKeyword.trim()) {
      showMessage(document.querySelector("#search-validation"), `유효하지 않은 검색값입니다.`);
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
    showMessage(document.querySelector("#search-validation"), `"${searchKeyword}"에 대한 검색 결과`);

    // 검색 결과 필터링 : 전체 영화 중에서 top, now playing, popular
    const filteredSearchResults = searchResult.results.filter((searchedMovie) =>
      allMovies.some((movie) => movie.id === searchedMovie.id && movie.title === searchedMovie.title)
    );

    const searchContainer = document.querySelector("#search-list");

    if (filteredSearchResults.length > 0) {
      makeCards(async () => filteredSearchResults, "#search-list", "search");
    } else {
      showMessage(searchContainer, `"${searchKeyword}"에 대한 검색 결과가 없습니다.`);
    }
  } catch (error) {
    console.error(error);
  }
};

// 검색어를 입력하고 제출 시 검색 결과 표시
const form = document.querySelector("#search-form");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const searchInput = document.querySelector("#search-input");
  searchAndUpdateCards(searchInput.value);
});

// 검색어 입력 시 실시간으로 검색 결과 표시
const searchInput = document.querySelector("#search-input");
searchInput.addEventListener("input", () => {
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

// 마우스 over 시 해당 영화에 대한 title과 바로가기?
