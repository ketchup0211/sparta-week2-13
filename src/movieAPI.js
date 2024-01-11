// API로부터 id, title, overview, popularity, poster_path 가져오기
const MOVIE_API = config.apikey;

async function getData() {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyYjRiZDE4MjE1N2I1Njk3NzdiNDY2MmI4Y2YwYjRjZiIsInN1YiI6IjY1OWI4MjM0Y2E0ZjY3MDBmMDQzZmNkZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.evSRwAo9ZsM7AIVmH0vskk5w3H6aFJBBPclFZwRsBHE",
    },
  };
  try {
    const response = await fetch(
      "https://api.themoviedb.org/3/movie/top_rated?api_key=" + MOVIE_API
    );
    const jsonData = await response.json();
    return jsonData.results;
  } catch (err) {
    console.log(err);
  }
}

// Card Create
const createMovieCards = async () => {
  const data = await getData();

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

// Search
const handleSearch = (searchWord) => {
  const cards = document.querySelectorAll(".card");

  cards.forEach((card) => {
    const title = card.querySelector(".title").textContent.toLowerCase();
    const search = searchWord.toLowerCase();

    if (title.includes(search)) card.style.display = "block";
    else card.style.display = "none";
  });
};

//main

createMovieCards();

const searchInput = document.querySelector("#search-input");
const form = document.querySelector("#search");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  handleSearch(searchInput.value);
});
searchInput.addEventListener("keyup", (event) => {
  event.preventDefault();
  handleSearch(searchInput.value);
});
