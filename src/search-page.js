// API TMDB API data 가져오기
// (1) nowlist 3개 가져오기 => 전체 영화를 sorting
// (2 -1) movie id or title로 정렬 => 하나의 배열로 만들기?
// (2- 2) TMDB search movie api를 가져와서 해보기 => test 필요함
// (3) 검색어에 title이 포함되는 영화만 카드로 보여주기

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
