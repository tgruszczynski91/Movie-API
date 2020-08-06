//Variables
const search = document.querySelector('.search-movie');
const input = document.querySelector('#input');
const jumbotron = document.querySelector('.jumbotron');
const jumbotronDesc = document.querySelector('.jumbotron-desc');
const moviePoster = document.querySelector('.movie-poster');
const description = document.querySelector('.description');
const director = document.querySelector('.movie-details-director');
const writer = document.querySelector('.movie-details-writer');
const genre = document.querySelector('.movie-details-genre');
const countryProduction = document.querySelector('.movie-details-countryProduction');
const releaseDate = document.querySelector('.movie-details-releaseDate');
const budget = document.querySelector('.movie-details-budget');
const revenue = document.querySelector('.movie-details-revenue');
const castContainer = document.querySelector('.row');
const castHeader = document.querySelector('.cast-header');
const buttonDiv = document.querySelector('.cast-button-div');
const recomendedHeader = document.querySelector('.recomended-Header');
const recomendedMain = document.querySelector('.scrolling-wrapper');
const reviewDiv = document.querySelector('.reviews-container-main');
const alertContainer = document.querySelector('.alert-danger');

//Search Function
search.addEventListener('click', function(e){

    fetch(`https://api.themoviedb.org/3/search/movie?api_key=9250b9e19854d9deaa571f4074bc38a3&language=en-US&query=${input.value}&page=1&include_adult=false` ,{
    method: "GET",
    })
    .then(response => {
    return response.json();
    })
    .then(data => {
    const id = data.results[0].id;
    const movieTitle = data.results[0].title
    getMovieData(id);
    recomended(id, movieTitle);
    reviews(id);
    })
    .catch(function(error){
    console.log(error)  
    })
    input.value = ''
    e.preventDefault()
    })

//Fetching Data Function
function getMovieData(id){
    fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=9250b9e19854d9deaa571f4074bc38a3&language=en-US&append_to_response=credits` ,{
    method: "GET",
})
.then(response => {
    return response.json();
})
.then(data => {
    //Jumbotron Data 
    jumbotron.style.background = `linear-gradient(rgba(28, 28, 28, 0) 40%, rgba(28, 28, 28, 1)), url(https://image.tmdb.org/t/p/original/${data.backdrop_path}) no-repeat center / cover`;
    const date = data.release_date;
    jumbotronDesc.innerHTML = `
    <h2 class="display-4 font-weight-bold">${data.title}</h2>
    <p class="lead">${date.substring(0,4)} ${data.runtime} minutes</p>
    <div class="rating-div">
      <p class="origin">${data.original_language !== "en" ? data.original_title : ''}</p>
      <p class="ratings">${data.vote_average}</p> 
      <svg class="bi bi-star-fill" width="2em" height="2em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
      </svg>
      <p class="votes">${data.vote_count} votes</p>
    </div>
    `

    //Movie Details Data
    const crew = data.credits.crew;
    moviePoster.innerHTML = `
    <img src="https://image.tmdb.org/t/p/w500/${data.poster_path}" alt="Responsive Image" class="img-fluid ">
    `
    description.textContent = data.overview;
    crew.forEach(function(crew){
        if(crew.job === "Director") {
            director.textContent = crew.name;
        }
        if(crew.job === "Screenplay" || crew.job === "Writer") {
            writer.textContent = crew.name;
        }
        })

    //Fetching Genres
    const genreArr = data.genres;
    let arr = [];
    let sentence = '';
    genreArr.forEach(el => {
      arr.push(el.name);
      sentence += el.name + ' / ';
    })
    sentenceFinal = sentence.slice(0, -3);
    genre.innerHTML = sentenceFinal;

    //Fetching Prodution credits
    const productionArr = data.production_countries;
    let arr1 = [];
    let sentence1 = '';
    productionArr.forEach(el => {
      arr1.push(el.name);
      sentence1 += ' ' + el.name + ' / ';
    })
    sentenceFinal1 = sentence1.slice(0, -3);
    countryProduction.innerHTML = sentenceFinal1;
    
    //Checking if a movie is released
        if(data.status === 'Released'){
            releaseDate.textContent = data.release_date;
        }
        else {releaseDate.textContent = 'This movie is not released yet'}
    
    //Budget and revenue Fetch and checking if there's a data
        if(data.budget !== 0) {budget.textContent = `${separator(data.budget)} $`}
        else {budget.textContent = "unknown"};
        if(data.revenue !== 0) {revenue.textContent = `${separator(data.revenue)} $`}
        else {revenue.textContent = "unknown"}

    //Cast Fetch
    const cast = data.credits.cast;
            castHeader.innerHTML = `Cast of ${data.title}`
            output = '';
            for(i = 0; i < 6; i++){
                output += `
                <div class="col-lg-2 col-md-4 col-sm-4 col-6">
                <div class="card" style="width: 18rem;">
                  <img src="${cast[i].profile_path === null ? 'Images/blank-profile.png' : `https://image.tmdb.org/t/p/w500/${cast[i].profile_path}` }" class="card-img-top actor-image" alt="...">
                  <div class="card-body">
                    <p class="card-title actor">${cast[i].name}</p>
                    <p class="card-title role">${cast[i].character}</p>
                  </div>
                </div>
              </div>
                `
            castContainer.innerHTML = output;
            }
            buttonDiv.innerHTML = `<button class="cast-Button">See full cast</button>`
            })


.catch(function(error){
    console.log(error)
    })
}

//Fetching recomended 
function recomended(id, currentMovie){
fetch(`https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=9250b9e19854d9deaa571f4074bc38a3&language=en-US&page=1` ,{
    method: "GET",
})
.then(response => {
    return response.json();
})
.then(data => {
    const recomendedMovie = data.results;
    recomendedHeader.innerHTML = `Similar to ${currentMovie}`
    output = ''
    for(i = 0; i < 7; i++){
        output +=
        `<div class="cards">
         <img src="${recomendedMovie[i].backdrop_path === null ? 'Images/recomended-blank.jpg' : `https://image.tmdb.org/t/p/w500${recomendedMovie[i].backdrop_path}`}" class="cards-img" alt="">
         <span class="recomended-span">${recomendedMovie[i].title}</span>
         </div>`
         recomendedMain.innerHTML = output;
    }
})
.catch(function(error){
    console.log(error)  
    })
}

function reviews(id){
fetch(`https://api.themoviedb.org/3/movie/${id}/reviews?api_key=9250b9e19854d9deaa571f4074bc38a3&language=en-US&page=1` ,{
    method: "GET",
})
.then(response => {
    return response.json();
})
.then(data => {
    const reviewAll = data.results;
    output = '';
    if(reviewAll.length !== 0) {
        reviewAll.forEach(i => {
            output += `
            <div class="media">
            <img src="Images/blank-profile.png" class="align-self-start mr-3 rounded-circle" alt="...">
            <div class="media-body">
            <h5 class="mt-0 review-title"> Review by ${i.author}</h5>
            <p class="review-author">${i.author}</p>
            <p class="review-paragraph">${i.content.substring(0,200)}... <a href="#" class="see-more">see more</a></p>
            </div>
            </div>
            `  
        })
        reviewDiv.innerHTML = output;
    }
    else{reviewDiv.innerHTML = 'There are no reviews for this movie'};

})
.catch(function(error){
    console.log(error)  
    })
}

//Show alert
function showAlert(){
    if(input.value === '') {
        alertContainer.style.display = "flex";
        setTimeout(() => alertContainer.remove(), 3000)
    }
}

//Seperator functiion
function separator(num) {
    const num_parts = num.toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return num_parts.join(".");
    }
