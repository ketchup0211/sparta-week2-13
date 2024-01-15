import { getMovieData } from "./movieAPI.js";
const MOVIE_API = config.apikey;
const base_url = "https://api.themoviedb.org/3/";

function convertToEnglishGenre(genreName) {
  const genreMap = {
    액션: "액션",
    모험: "모험",
    판타지: "판타지",
    드라마: "드라마",
    코미디: "코미디",
    가족: "가족",
    공포: "공포",
    미스터리: "미스터리",
    스릴러: "스릴러",
    역사: "역사",
    전쟁: "전쟁",
    애니메이션: "애니메이션",
    음악: "음악",
    범죄: "범죄",
    서부: "서부",
    "TV 영화": "TV 영화",
    로맨스: "로맨스"
  };

  const mappedGenre = genreMap[genreName] || genreName;

  return mappedGenre;
}

function convertToEnglishGenreClass(genreName) {
  const genreMapClass = {
    액션: "Action",
    모험: "Adventure",
    판타지: "Fantasy",
    드라마: "Drama",
    코미디: "Comedy",
    가족: "Family",
    공포: "Fear",
    미스터리: "Mystery",
    스릴러: "Thriller",
    역사: "History",
    전쟁: "War",
    애니메이션: "Animation",
    음악: "Music",
    범죄: "Crime",
    서부: "Western",
    "TV 영화": "tv-movie",
    로맨스: "romance"
  };
  // genreName이 매핑에 있는 경우 해당 값을 반환하고, 그렇지 않은 경우 원래의 문자열 반환
  const mappedGenreClass = genreMapClass[genreName] || genreName;
  // 영어로 변환 후 소문자로 변환하여 반환
  return mappedGenreClass.toLowerCase();
}

async function getGenreId(genreName) {
  try {
    const response = await fetch(`${base_url}genre/movie/list?language=ko&api_key=${MOVIE_API}`);
    const jsonData = await response.json();

    // 장르 목록에서 해당 장르의 ID 찾기
    const genre = jsonData.genres.find((genre) => genre.name === convertToEnglishGenre(genreName));

    if (genre) {
      return genre.id;
    } else {
      console.log(`'${genreName}' 장르를 찾을 수 없습니다.`);
      return null;
    }
  } catch (err) {
    console.error(err);
    return null;
  }
}

// 특정 장르로 영화 검색
async function getMoviesByGenre(genreName) {
  const genreId = await getGenreId(convertToEnglishGenre(genreName));

  if (genreId !== null) {
    try {
      const response = await fetch(`${base_url}discover/movie?with_genres=${genreId}&language=ko&api_key=${MOVIE_API}`);
      const jsonData = await response.json();
      return jsonData.results;
    } catch (err) {
      console.error(err);
      return [];
    }
  } else {
    return [];
  }
}

document.addEventListener("DOMContentLoaded", async function () {
  // detailPage.html에서 URL 매개변수 읽기
  const urlParams = new URLSearchParams(window.location.search);
  const movieId = urlParams.get("id");

  try {
    // API 호출
    const movieData = await getMovieData.getMovieDetails(movieId);

    const main = document.querySelector("main");
    const info = document.querySelector(".info");

    const overviewWithBreaks = movieData.overview ? movieData.overview.replace(/\.+(?!\.{1,})/g, ".<br>") : "";

    main.setAttribute("style", `background-image:url(https://image.tmdb.org/t/p/original/${movieData.backdrop_path}`);

    if ("genres" in movieData) {
      const genres = movieData.genres.map((genre) => genre.name.toLowerCase());

      // HTML에 장르 정보 추가
      info.innerHTML = `
                <article class="movie_info">
                    <h3>${movieData.title}<br/><span>${movieData.original_title}</span></h3>
                    <img class="m_poster" src="https://image.tmdb.org/t/p/w500/${movieData.poster_path}" alt="">
                    <p class="genre">장르 : ${movieData.genres
                      .map((genre) => `<span class="${convertToEnglishGenreClass(genre.name)}">${genre.name}</span>`)
                      .join(" ")}</p>
                    <p class="release_data">개봉일 : ${movieData.release_date}</p>
                    <p class="runtime">상영시간 : ${movieData.runtime}분</p>
                    <p class="rating">평점 : ${movieData.vote_average}</p>
                    <p class="summary">${overviewWithBreaks}</p>
                </article>
                <article class="poster">
                    <img src="https://image.tmdb.org/t/p/w500/${movieData.poster_path}" alt="">
                </article>
            `;

      // 해당 영화의 장르 정보를 가져오고, 영어로 변환
      const movieGenres = movieData.genres.map((genre) => convertToEnglishGenre(genre.name));

      // 비슷한 장르의 영화를 추천하기 위한 API 호출
      const similarMovies = await getSimilarMoviesByAllGenres(movieGenres);

      // 추천 영화 목록을 동적으로 생성
      const similarList = document.querySelector(".similar-list");
      if (similarMovies.length > 0) {
        similarList.innerHTML = similarMovies
          .map((movie) => {
            return `<div id="${movie.id}" class="similar-item">
                        <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="${movie.title}">
                    </div>`;
          })
          .join("");
      } else {
        similarList.innerHTML = "<p>추천 영화가 없습니다.</p>";
      }

      // 추천영화 클릭시 상세페이지로

      document.querySelector(".similar-list").addEventListener("click", function (event) {
        const clickedMovieElement = event.target.closest(".similar-item");

        if (clickedMovieElement) {
          const clickedMovieId = clickedMovieElement.id;

          // 클릭한 영화의 ID를 가지고 detailPage.html로 이동
          window.location.href = `detailPage.html?id=${clickedMovieId}`;
        }
      });
    }
  } catch (error) {
    console.error("API 호출 중 에러 발생:", error);
  }

  async function getSimilarMoviesByAllGenres(genres, maxMoviesPerGenre = 5) {
    const similarMovies = [];

    // 각 장르에 대해 API 호출 및 결과를 저장
    for (const genre of genres) {
      const moviesByGenre = await getMoviesByGenre(genre);

      // 최대 5개의 영화만 랜덤으로 선택
      const selectedMovies = getRandomMovies(moviesByGenre, maxMoviesPerGenre);

      // selectedMovies를 사용하여 필요한 작업 수행
      console.log(`${genre} 영화:`, selectedMovies);

      // 선택된 영화를 similarMovies 배열에 추가
      similarMovies.push(...selectedMovies);
    }

    // 중복된 영화 제거
    const uniqueMovies = Array.from(new Set(similarMovies.map((movie) => movie.id))).map((id) =>
      similarMovies.find((movie) => movie.id === id)
    );

    // uniqueMovies를 반환
    return uniqueMovies;
  }

  // 랜덤으로 배열에서 일정 개수의 요소 선택하는 함수
  function getRandomMovies(array, count) {
    const shuffledArray = array.sort(() => Math.random() - 0.5);
    return shuffledArray.slice(0, count);
  }
});

//   review

window.onload = function () {
  loadReviews();

  document.addEventListener("click", function (e) {
    if (e.target && e.target.id == "removeBtn") {
      e.preventDefault();
      // 클릭된 삭제 버튼의 부모 요소인 review_box를 찾음
      const reviewBox = e.target.closest(".review_box");

      // review_box에서 user 정보를 가져와 해당 리뷰를 삭제
      const userName = reviewBox.querySelector(".output_Name").textContent;
      const userPass = prompt("비밀번호를 입력하세요"); // 사용자에게 비밀번호를 입력받음

      if (userPass !== null) {
        // 취소를 누르지 않은 경우에만 비밀번호 확인 및 리뷰 삭제
        if (removeReview(userName, userPass)) {
          // 삭제 후 리뷰 다시 로드
          alert("비밀번호가 일치하여 해당리뷰를 삭제합니다.");
          loadReviews();
        } else {
          alert("비밀번호가 일치하지 않습니다.");
        }
      }
    }
  });
};

document.getElementById("writeBtn").addEventListener("click", function (e) {
  e.preventDefault();

  const inputName = document.getElementById("userName").value;
  const inputPass = document.getElementById("password").value;
  const inputReview = document.getElementById("reviewWrite").value;

  const urlParams = new URLSearchParams(window.location.search);
  const movieId = urlParams.get("id");

  // 유효성 검사 함수 호출
  if (validateInput(inputName, inputPass, inputReview)) {
    // 유효한 경우에만 리뷰 추가
    let newReview = {
      user: inputName,
      password: inputPass,
      userReview: inputReview,
      movieId: movieId // 영화 ID 추가
    };

    let reviews = getReviews();

    reviews.push(newReview);

    localStorage.setItem("inputReview", JSON.stringify(reviews));
    localStorage.setItem("movieID", movieId);

    loadReviews();

    document.getElementById("reviewForm").reset();
  }
});

function validateInput(name, pass, review) {
  if (name.length < 2 || name.length > 10) {
    alert("이름은 2자에서 10자 사이여야 합니다.");
    return false;
  }

  if (pass.length < 4 || pass.length > 10) {
    alert("비밀번호는 최소 4자이상 10자이하 이어야 합니다.");
    return false;
  }

  if (review.length < 5) {
    alert("리뷰는 최소 5자 이상이어야 합니다.");
    return false;
  }

  return true;
}

function getReviews() {
  let reviews = localStorage.getItem("inputReview");

  if (reviews) {
    return JSON.parse(reviews);
  } else {
    return [];
  }
}

function loadReviews() {
  let reviewList = document.getElementById("reviewOutput");
  reviewList.innerHTML = "";

  let reviews = getReviews();

  // detailPage.html에서 URL 매개변수 읽기
  const urlParams = new URLSearchParams(window.location.search);
  const movieId = urlParams.get("id");

  // 리뷰 역순으로 (최신화)
  for (let i = reviews.length - 1; i >= 0; i--) {
    let review = reviews[i];

    // 해당 영화 ID에 대한 리뷰만 표시
    if (review.movieId === movieId) {
      let newReviewWrite = document.createElement("div");
      let temp = document.querySelector(".review_output");
      let divReviewBox = temp.appendChild(newReviewWrite);
      divReviewBox.setAttribute("class", "review_box");
      divReviewBox.innerHTML = `
                    <p class="output_Name">${review.user}</p>
                    <p class="output_Review">${review.userReview}</p>
                    <button id="removeBtn">삭제</button>
                `;
      reviewList.appendChild(divReviewBox);
    }
  }
}
function removeReview(userName, userPass) {
  let reviews = getReviews();

  // userName이 일치하는 리뷰를 찾음
  let review = reviews.find((review) => review.user === userName);

  if (review && validatePassword(review.password, userPass)) {
    // 비밀번호 일치 시 리뷰 제거
    reviews = reviews.filter((r) => r.user !== userName);
    localStorage.setItem("inputReview", JSON.stringify(reviews));
    return true; // 제거 성공
  } else {
    return false; // 비밀번호 불일치 또는 리뷰가 없음
  }
}

function validatePassword(savedPass, inputPass) {
  // 비밀번호 일치 여부 확인
  return savedPass === inputPass;
}

// [main page, detail page 공통] input을 클릭하면 search page로 이동
document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("search-input");

  searchInput.addEventListener("click", function () {
    // 검색창(input)이 클릭되면 검색 페이지로 이동
    window.location.href = "searchPage.html";
  });
});

/*
 * loadLatestReview
 * 최신 리뷰를 main-page.js로 반환하기 위한 함수
 */
function loadLatestReview() {
  let reviews = getReviews();
  let movidID = localStorage.getItem("movieID");

  if (!reviews.length) {
    let review = reviews[reviews.length - 1];
    return { review: reviews, movieID: movidID };
  }

  return null;
}

export { loadLatestReview };
