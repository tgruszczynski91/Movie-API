//Variables
const search = document.querySelector('.search-movie');
const input = document.querySelector('#input');
const image = document.querySelector('.img-fluid');
const jumbotron = document.querySelector('.jumbotron');
const title = document.querySelector('.display-4')
const overview = document.querySelector('.lead');
const alertContainer = document.querySelector('.alert-danger');
const ratings = document.querySelector('.ratings');
const language = document.querySelector('.origin');
const voteCount = document.querySelector('.votes');
const description = document.querySelector('.description');
const director = document.querySelector('.movie-details-director');
const writer = document.querySelector('.movie-details-writer');
const genre = document.querySelector('.movie-details-genre');
const countryProduction = document.querySelector('.movie-details-countryProduction');
const releaseDate = document.querySelector('.movie-details-releaseDate');
const budget = document.querySelector('.movie-details-budget');
const revenue = document.querySelector('.movie-details-revenue');
const actorImage = document.querySelectorAll('.actor-image');
const actor = document.querySelectorAll('.actor');
const role = document.querySelectorAll('.role');
const reviewTitle = document.querySelector('.review-title')
const reviewAuthor = document.querySelector('.review-author')
const reviewParagraph = document.querySelector('.review-paragraph');
const recomendedDiv = document.querySelectorAll('.cards-img');
const recomendedTitle = document.querySelectorAll('.recomended-span');
const castHeader = document.querySelector('.cast-header');
const recomendedHeader = document.querySelector('.recomended-Header')

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

//Fetching Movie Data Function
function getMovieData(id){
    fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=9250b9e19854d9deaa571f4074bc38a3&language=en-US&append_to_response=credits` ,{
    method: "GET",
})
.then(response => {
    return response.json();
})
.then(data => {
    //Jumbotron Data 
    image.src = `https://image.tmdb.org/t/p/w500/${data.poster_path}`;
    jumbotron.style.background = `linear-gradient(rgba(28, 28, 28, 0) 40%, rgba(28, 28, 28, 1)), url(https://image.tmdb.org/t/p/original/${data.backdrop_path}) no-repeat center / cover`;
    const date = data.release_date;
    overview.textContent = `${date.substring(0,4)} ${data.runtime} minutes`;
    title.textContent = data.title;
    ratings.textContent = data.vote_average;
    voteCount.textContent = `${data.vote_count} votes`;
        if(data.original_language !== "en") {
        language.innerHTML = data.original_title;
        } else {
        language.innerHTML = '';
        }

    //Movie Details Data
    description.textContent = data.overview;
    const crew = data.credits.crew;
    crew.forEach(crew => {
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
    console.log(cast)
            castHeader.innerHTML = `Cast of ${data.title}`
            for(i = 0; i < 6; i++){
                actorImage[i].src = `https://image.tmdb.org/t/p/w500/${cast[i].profile_path}`;
                if(cast[i].profile_path === null ) {actorImage[i].src = "Images/blank-profile.png"}
            }
            for (i = 0; i < 6; i ++){
                actor[i].innerHTML = cast[i].name;      
            }
            for(i = 0; i < 6; i++){
                role[i].innerHTML = cast[i].character;
            }
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
    console.log(data)
    const recomendedMovie = data.results;
    for(i = 0; i < 7; i++){
    recomendedDiv[i].src = `https://image.tmdb.org/t/p/w500${recomendedMovie[i].backdrop_path}`;
    if(recomendedMovie[i].backdrop_path === null){recomendedDiv[i].src = "Images/recomended-blank.jpg'"}
    recomendedTitle[i].innerHTML = recomendedMovie[i].title;
    recomendedHeader.innerHTML = `Similar to ${currentMovie}`
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
    console.log(data);
    const reviewAll = data.results;
    output = '';
    if(reviewAll.length !== 0) {
        reviewAll.forEach(i => {
            output += `
            <div class="media">
            <img src="https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png" class="align-self-start mr-3 rounded-circle" alt="...">
            <div class="media-body">
            <h5 class="mt-0 review-title"> Review by ${i.author}</h5>
            <p class="review-author">${i.author}</p>
            <p class="review-paragraph">${i.content.substring(0,200)}... <a href="#" class="see-more">see more</a></p>
            </div>
            </div>
            `  
        })
        document.querySelector('.reviews-container-main').innerHTML = output;
    }
    else{document.querySelector('.reviews-container-main').innerHTML = 'There are no reviews for this movie'}

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

//Seperator function
function separator(num) {
    const num_parts = num.toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return num_parts.join(".");
    }
