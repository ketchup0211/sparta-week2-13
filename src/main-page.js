import { getMovieData } from "./movieAPI.js";

// Top Rated Card Create
const createMovieCards = async () => {
  const data = await getMovieData.getTopRated();

  const card_container = document.querySelector("#card_container");

  card_container.innerHTML = data
    .map(
      (movie) =>
        `<div class ="card" id=${movie.id}>
      <img class="img" src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
      <h3 class="title">${movie.title}</h3>
      <p>${movie.overview}</p>
      <p>Rating : ${movie.vote_average}</p>
    </div>`
    )
    .join("");

  card_container.addEventListener("click", clickCard);
  function clickCard({ target }) {
    if (target === card_container) return;
    if (target.matches(".card")) alert(`영화 id : ${target.id}`);
    else alert(`영화 id : ${target.parentNode.id}`);
  }
};
