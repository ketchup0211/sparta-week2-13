import { getMovieData } from "./movieAPI.js";
//import { loadLatestReview } from "./detailPage.js";

// TODO#4 : 최근에 올라온 리뷰 보여주기
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
      displayOverview(cardClass, movieID);
      movieCard.style.cssText = "transform: scale(1.05)"
    });

    movieCard.addEventListener("mouseleave", () => {
      showElements(movieCard);
      const movieID = movieCard.id;
      hideOverview(movieID);
      movieCard.style.cssText = "";
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

/*
 *
 * Silde container Button evenet
 * 좌, 우 버튼 클릭 시 TOP3 영화 정보를 슬라이드하여 볼 수 있다.
 *
 */
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

/*
 *
 * Display Overview event
 * 마우스 over 시 해당 영화에 대한 overview를 표시한다.
 *
 */
const hideElements = (movieCard) => {
  const imgElement = movieCard.querySelector(".poster-img");
  const titleElement = movieCard.querySelector(".title-list");

  // 이미지와 텍스트 숨기기
  // imgElement.style.display = "none";
  // titleElement.style.display = "none";
};

const showElements = (movieCard) => {
  const imgElement = movieCard.querySelector(".poster-img");
  const titleElement = movieCard.querySelector(".title-list");

  // 이미지와 텍스트 표시
  // imgElement.style.display = "block";
  // titleElement.style.display = "block";
};

const displayOverview = async (cardClass, movieID) => {
  const overview = await getMovieData.getMovieDetails(movieID);

  // element 생성 및 설정
  const overviewContainer = document.createElement("div");
  overviewContainer.id = "overview-container";
  overviewContainer.style.fontSize = "14px";
  overviewContainer.style.padding = "23px";
  overviewContainer.style.lineHeight = "20px";

  // overview 설정
  if (overview["overview"].length > 100) {
    overviewContainer.innerHTML = overview["overview"].slice(0, 130).trim() + "...";
  } else if (!overview["overview"].length) {
    overviewContainer.innerHTML = "줄거리를 제공하지 않는 영화입니다.";
  } else {
    overviewContainer.innerHTML = overview["overview"];
  }

  // 특정 카드에 overview 추가
  const cardElements = document.getElementsByClassName(cardClass);
  const targetCard = Array.from(cardElements).find((element) => element.id === movieID);

  if (targetCard) {
    targetCard.prepend(overviewContainer);
    // targetCard.style.background = "rgba(255,255,255,0.8)";
  }
};

const hideOverview = (movieID) => {
  const overviewContainer = document.getElementById("overview-container");

  if (overviewContainer) {
    overviewContainer.remove();
  }
};

/*
 * 최신 리뷰 중 하나를 가져와서 보여준다.
 */
// const latestReview = loadLatestReview();

// if (latestReview) {
//   // 최신 리뷰와 관련된 작업 수행
//   console.log("최신 리뷰:", latestReview);
// } else {
//   // 특정 영화에 대한 리뷰가 없을 때 처리
//   console.log("지정된 영화에 대한 리뷰가 없습니다.");
// }

/*
 *
 * Page move event
 * 영화에 대한 상세 정보 페이지, 또는 검색 페이지로 이동한다.
 *
 */
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
