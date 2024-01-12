
    import { getMovieData } from "./src/movieAPI.js";

    document.addEventListener("DOMContentLoaded", async function () {
      // detailPage.html에서 URL 매개변수 읽기
      const urlParams = new URLSearchParams(window.location.search);
      const movieId = urlParams.get('id');

      console.log("선택한 영화의 ID:", movieId);

      try {
        // API 호출
        const movieData = await getMovieData.getMovieDetails(movieId);

        const main = document.querySelector("main");
        const info = document.querySelector(".info");

        main.setAttribute("style", `background-image:url(https://image.tmdb.org/t/p/original/${movieData.poster_path}`);

        info.innerHTML = `
              <article class="movie_info">
                  <h3>${movieData.original_title}</h3>
                  <p class="release_data">${movieData.release_date}</p>
                  <p class="rating">${movieData.vote_average}</p>
                  <p class="summary">${movieData.overview}</p>
              </article>
              <article class="poster">
                  <img src="https://image.tmdb.org/t/p/w500/${movieData.poster_path}" alt="">
              </article>
               `;

        // API 응답을 이용한 작업 수행
        console.log("영화 정보:", movieData);
        // 여기에서 API로 받은 데이터를 이용하여 페이지에 원하는 내용을 표시하면 됩니다.
      } catch (error) {
        console.error("API 호출 중 에러 발생:", error);
      }
    });
