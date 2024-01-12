// (1) API TMDB API data - list 3개 가져오기 가져오기
getMovieData();

// (2) main page (index.html)에서 검색어 입력 시 search-page로 이동

// (3) 검색어에 title이 포함된 영화만 filtering

const filter = () => {
  const searchElement = document.getElementById("search"); // input 태그
  const searchElementInputValue = searchElement.value.toLowerCase();
  const listInner = document.getElementsByClassName("searched-list");

  for (let i = 0; i < listInner.length; i++) {
    let searchTitle = listInner[i].querySelector(".movie-title");

    if (searchTitle.textContent.toLowerCase().includes(searchElementInputValue)) {
      listInner[i].style.display = "block";
    } else {
      listInner[i].style.display = "none";
    }
  }
};

// (4) searchMovieList를 바탕으로 카드 생성
const searchMovielist = async () => {
  const movies = await getMovieData();

  const searchedList = document.querySelector("searched-list");
  searchedList.innerHTML = movies
    .map(
      (movie) => `
      <li class="movie-card" id=${movie.id}>
      <img class="movie-img" src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="...">
      </li>
    `
    )
    .join("");
};

// const showSearchResult = (searchKeyword) => {
//   const movieCards = document.querySelectorAll(".movie-card");

//   movieCards.forEach((card) => {
//     const title = card.querySelector(".movie-title").textContent.toLowerCase();
//     const searchedValue = searchKeyword.toLowerCase();

//     if (title.includes(searchedValue)) {
//       card.style.display = "block";
//     } else {
//       card.style.display = "none";
//     }
//   });
// };
