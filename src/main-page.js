import { getMovieData } from "./movieAPI.js";

// TODO#1 : .movie-list 내부 영화에 마우스 hover 시 애니메이션 및 요약 보여주기
// TODO#2 : 애니메이션 구현
// TODO#3 : 디테일 및 꾸미기
// TODO#4 : 리뷰 기능 구현 된건가? 안된거면 2순위로 !
// LAST : 파일 정리 (파일명, 폴더, 최적화 등)

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

  // 각 영화 카드에 마우스 이벤트 리스너 추가
  container.querySelectorAll(`.${cardClass}`).forEach((movieCard) => {
    movieCard.addEventListener("mouseenter", () => {
      hideElements(movieCard);
      const movieID = movieCard.id;
      displayOverview(movieID);
    });

    movieCard.addEventListener("mouseleave", () => {
      showElements(movieCard);
      const movieID = movieCard.id;
      hideOverview(movieID);
    });
  });
};

// Top Rated Movie
const getTop3Movie = async () => {
  const topRatedData = await getMovieData.getTopRated();
  let top3 = topRatedData.slice(0, 3);

  const topMovies = document.querySelector("#top-movies");

  let movieList = "";
  top3.forEach((movie, idx) => {
    const rankSuffix = idx === 0 ? "st" : idx === 1 ? "nd" : idx === 2 ? "rd" : "th";

    const contents = `<div class ="idx${idx} top" id = ${movie.id} >
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

// Now Playing Movie
const getNowMovie = async () => {
  await renderMovies(getMovieData.getNowPlaying, "#now-movies", "now");
};

// Popular Movie
const getPopularMovie = async () => {
  await renderMovies(getMovieData.getPolular, "#popular-movies", "popular");
};

/* button event */
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

/* 마우스 over 시 해당 영화에 대한 디테일 표시 */
const hideElements = (movieCard) => {
  const imgElement = movieCard.querySelector(".poster-img");
  const titleElement = movieCard.querySelector(".title-list");

  // 이미지와 텍스트 숨기기
  imgElement.style.display = "none";
  titleElement.style.display = "none";
};

const showElements = (movieCard) => {
  const imgElement = movieCard.querySelector(".poster-img");
  const titleElement = movieCard.querySelector(".title-list");

  // 이미지와 텍스트 표시
  imgElement.style.display = "block";
  titleElement.style.display = "block";
};

const displayOverview = async (movieID) => {
  const overview = await getMovieData.getMovieDetails(movieID);
  let overviewContainer = document.createElement("div");
  overviewContainer.id = "overview-container";

  // 가져온 개요를 해당 요소에 표시
  overviewContainer.innerHTML = overview["overview"];

  // 개요를 표시할 위치를 찾아서 추가
  const movieCard = document.getElementById(movieID);
  movieCard.appendChild(overviewContainer);
};

const hideOverview = (movieID) => {
  const overviewContainer = document.getElementById("overview-container");

  // 개요를 숨기기
  if (overviewContainer) {
    overviewContainer.remove();
  }
};

/* 페이지 이동 */
// Click event handler for both now-movies and popular-movies
document.querySelector(".container").addEventListener("click", function (event) {
  const clickedMovieElement = event.target.closest(".now, .popular, .top");

  if (clickedMovieElement) {
    const clickedMovieId = clickedMovieElement.id;

    // 클릭한 영화의 ID를 가지고 detailPage.html로 이동
    window.location.href = `detailPage.html?id=${clickedMovieId}`;
  }
});

// [main page, detail page 공통] input을 클릭하면 search page로 이동
document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("search-input");

  searchInput.addEventListener("click", function () {
    // 검색창(input)이 클릭되면 검색 페이지로 이동
    window.location.href = "searchPage.html";
  });
});

//  main
getTop3Movie();
getNowMovie();
getPopularMovie();
