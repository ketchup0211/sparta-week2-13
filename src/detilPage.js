import { getMovieData } from "./movieAPI.js";

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

        main.setAttribute("style", `background-image:url(https://image.tmdb.org/t/p/original/${movieData.backdrop_path}`);

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
                    alert("비밀번호가 일치하여 해당리뷰를 삭제합니다.")
                    loadReviews();
                } else {
                    alert("비밀번호가 일치하지 않습니다.");
                }
            }
        }
    });
};

const MASTER_PASSWORD = "131313";

document.getElementById("writeBtn").addEventListener("click", function (e) {
    e.preventDefault();

    const inputName = document.getElementById("userName").value;
    const inputPass = document.getElementById("password").value;
    const inputReview = document.getElementById("reviewWrite").value;

    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');

    // 유효성 검사 함수 호출
    if (validateInput(inputName, inputPass, inputReview)) {
        // 유효한 경우에만 리뷰 추가
        let newReview = {
            user: inputName,
            password: inputPass,
            userReview: inputReview,
            movieId: movieId, // 영화 ID 추가
        };

        let reviews = getReviews();

        reviews.push(newReview);

        localStorage.setItem('inputReview', JSON.stringify(reviews));

        loadReviews();

        document.getElementById('reviewForm').reset();
    }
});

function validateInput(name, pass, review) {
    if (name.length < 2 || name.length > 10) {
        alert("이름은 3자에서 10자 사이여야 합니다.");
        return false;
    }

    if (pass.length < 4) {
        alert("비밀번호는 최소 6자 이상이어야 합니다.");
        return false;
    }

    if (review.length < 5) {
        alert("리뷰는 최소 10자 이상이어야 합니다.");
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
    const movieId = urlParams.get('id');

    for (let i = 0; i < reviews.length; i++) {
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
    let review = reviews.find(review => review.user === userName);

    if (review && validatePassword(review.password, userPass)) {
        // 비밀번호 일치 시 리뷰 제거
        reviews = reviews.filter((r) => r.user !== userName);
        localStorage.setItem('inputReview', JSON.stringify(reviews));
        return true; // 제거 성공
    } else {
        return false; // 비밀번호 불일치 또는 리뷰가 없음
    }
}

function validatePassword(savedPass, inputPass) {
    // 비밀번호 일치 여부 확인
    return savedPass === inputPass;
}