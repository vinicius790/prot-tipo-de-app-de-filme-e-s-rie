const API_KEY = '3fd2be6f0c70a2a598f084ddfb75487c';
const API_URL = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}&page=1`;
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';
const SEARCH_API = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query="`;

const movieList = document.getElementById('movie-list');
const form = document.getElementById('form');
const search = document.getElementById('search');
const genreSelect = document.getElementById('genre');
const filterBtn = document.getElementById('filter-btn');
const movieDetails = document.getElementById('movie-details');
const favoritesList = document.getElementById('favorites-list');
const reviewForm = document.getElementById('review-form');
const reviewText = document.getElementById('review-text');
const reviewList = document.getElementById('review-list');

let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
displayFavorites();

// Função para buscar filmes da API (com paginação)
async function getMovies(url, page = 1) {
    const urlWithPage = `<span class="math-inline">\{url\}&page\=</span>{page}`;
    const res = await fetch(urlWithPage);
    const data = await res.json();
    showMovies(data.results);
    updatePagination(data.page, data.total_pages);
}

// Função para exibir filmes na página
function showMovies(movies) {
    movieList.innerHTML = '';

    movies.forEach((movie) => {
        const { id, title, poster_path, vote_average, overview } = movie;

        const movieEl = document.createElement('div');
        movieEl.classList.add('movie', 'col-md-4', 'mb-4');

        movieEl.innerHTML = `
            <div class="card"> 
                <img src="<span class="math-inline">\{IMG\_PATH \+ poster\_path\}" alt\="</span>{title}" class="card-img-top">
                <div class="card-body">
                    <h5 class="card-title"><span class="math-inline">\{title\}</h5\>
<span class\="</span>{getClassByRate(vote_average)}"><span class="math-inline">\{vote\_average\}</span\>
<p class\="card\-text"\></span>{overview}</p>
                    <button onclick="showMovieDetails(<span class="math-inline">\{id\}\)" class\="btn btn\-primary"\>Detalhes</button\>
<button onclick\="addToFavorites\(</span>{id}, '<span class="math-inline">\{title\}', '</span>{poster_path}', <span class="math-inline">\{vote\_average\}, '</span>{overview}')" class="btn btn-secondary">Favoritos</button>
                </div>
            </div>
        `;
        movieList.appendChild(movieEl);
    });
}

// Função para obter a classe CSS de acordo com a avaliação
function getClassByRate(vote) {
    if (vote >= 8) {
        return 'green';
    } else if (vote >= 5) {
        return 'orange';
    } else {
        return 'red';
    }
}

// Event listener para o formulário de pesquisa
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const searchTerm = search.value;

    if (searchTerm && searchTerm !== '') {
        getMovies(SEARCH_API + searchTerm);
        search.value = '';
    } else {
        getMovies(API_URL); // Volta para a lista inicial se a pesquisa estiver vazia
    }
});

// Event listener para o botão de filtro
filterBtn.addEventListener('click', () => {
    const genre = genreSelect.value;
    filterMoviesByGenre(genre);
});

// Função para filtrar filmes por gênero
function filterMoviesByGenre(genre) {
    const genreFilterURL = `https://api.themoviedb.org/3/discover/movie?api_key=<span class="math-inline">\{API\_KEY\}&with\_genres\=</span>{genre}`;
    getMovies(genreFilterURL);
}

// Função para exibir detalhes do filme (com informações adicionais)
function showMovieDetails(movieId) {
    const movieDetailsURL = `https://api.themoviedb.org/3/movie/<span class="math-inline">\{movieId\}?api\_key\=</span>{API_KEY}&language=pt-BR&append_to_response=credits`;
    fetch(movieDetailsURL)
        .then(res => res.json())
        .then(movie => {
            movieDetails.innerHTML = `
                <div class="card">
                    <img src="<span class="math-inline">\{IMG\_PATH \+ movie\.poster\_path\}" alt\="</span>{movie.title}" class="card-img-top">
                    <div class="card-body">
                        <h5 class="card-title"><span class="math-inline">\{movie\.title\}</h5\>
<span class\="</span>{getClassByRate(movie.vote_average)}"><span class="math-inline">\{movie\.vote\_average\}</span\>
<p class\="card\-text"\></span>{movie.overview}</p>
                        <p class="card-text"><strong>Gêneros:</strong> ${movie.genres.map(genre => genre.name).join(', ')}</p>
                        <p class="card-text"><strong>Data de lançamento:</strong> <span class="math-inline">\{movie\.release\_date\}</p\>
<p class\="card\-text"\><strong\>Site oficial\:</strong\> <a href\="</span>{movie.homepage}" target="_blank">${movie.homepage}</a></p>
                        <p class="card-text"><strong>Orçamento:</strong> ${movie.budget}</p>
                        <p class="card-text"><strong>Receita:</strong> ${movie.revenue}</p>
                        <p class="card-text"><strong>Duração:</strong> ${movie.runtime} minutos</p>
                        <p class="card-text"><strong>Tagline:</strong> ${movie.tagline}</p> 

                        <div class="cast" *ngIf="selectedMovie.credits">
                          <h3>Elenco</h3>
                          <ul>
                            <li *ngFor="let cast of selectedMovie.credits.cast">
                              ${movie.credits.cast.map(cast => `<p>${cast.name} como ${cast.character}</p>`).join('')}
                            </li>
                          </ul>
                        </div>
                    </div>
                </div>
            `;
            movieDetails.style.display = 'block';
        });
}

// Função para adicionar um filme aos favoritos
function addToFavorites(id, title, poster_path, vote_average, overview) {
    const movie = { id, title, poster_path, vote_average, overview };

    const existing = favorites.find(favorite => favorite.id === id);

    if (!existing) {
        favorites.push(movie);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        displayFavorites();
    }
}

// Função para exibir os filmes favoritos
function displayFavorites() {
    favoritesList.innerHTML = '';

    if (favorites.length === 0) {
        const message = document.createElement('p');
        message.textContent = "Você ainda não adicionou nenhum filme aos favoritos.";
        favoritesList.appendChild(message);
        return;
    }

    favorites.forEach(movie => {
        const { id, title, poster_path, vote_average, overview } = movie;

        const favoriteEl = document.createElement('div');
        favoriteEl.classList.add('favorite', 'col-md-4', 'mb-4');

        favoriteEl.innerHTML = `
            <div class="card">
                <img src="<span class="math-inline">\{IMG\_PATH \+ poster\_path\}" alt\="</span>{title}" class="card-img-top">
                <div class="card-body">
                    <h5 class="card-title"><span class="math-inline">\{title\}</h5\>
<span class\="</span>{getClassByRate(vote_average)}"><span class="math-inline">\{vote\_average\}</span\>
<p class\="card\-text"\></span>{overview}</p>
                    <button onclick="removeFromFavorites(${id})" class="btn btn-danger">Remover</button>
                </div>
            </div>
        `;
        favoritesList.appendChild(favoriteEl);
    });
}

// Função para remover um filme dos favoritos
function removeFromFavorites(id) {
    favorites = favorites.filter(favorite => favorite.id !== id);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    displayFavorites();
}

// Event listener para o formulário de avaliação
reviewForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const review = reviewText.value;
    addReview(review);
});

// Função para adicionar uma avaliação
function addReview(review) {
    const reviewElement = document.createElement('div');
    reviewElement.classList.add('review');
    reviewElement.textContent = review;
    reviewList.appendChild(reviewElement);
    reviewText.value = '';
}

// ... (código anterior) ...

// Funções para lidar com a exibição da página inicial
function showHomePage() {
    // 1. Ocultar as seções de filmes, séries, atores, detalhes, etc.
    hideSections(['#filmes', '#series', '#atores', '#movie-details', '#actor-details', '#serie-details', '#favoritos', '#login', '#criar-conta', '#user-profile']);

    // 2. Exibir a seção da página inicial
    showSection('#home');

    // 3. Carregar os filmes em cartaz
    loadFeaturedMovies();

    // 4. Carregar as categorias de filmes
    loadMovieCategories();
}

// Funções para lidar com a exibição da seção de filmes
function showMoviesSection() {
    // 1. Ocultar as seções da página inicial, séries, atores, detalhes, etc.
    hideSections(['#home', '#series', '#atores', '#movie-details', '#actor-details', '#serie-details', '#favoritos', '#login', '#criar-conta', '#user-profile']);

    // 2. Exibir a seção de filmes
    showSection('#filmes');

    // 3. Carregar os filmes (se necessário)
    if (movieList.innerHTML === '') {
        getMovies(API_URL);
    }
}

// Funções para lidar com a exibição da seção de séries (implementar lógica)
function showSeriesSection() {
    // 1. Ocultar as seções da página inicial, filmes, atores, detalhes, etc.
    hideSections(['#home', '#filmes', '#atores', '#movie-details', '#actor-details', '#serie-details', '#favoritos', '#login', '#criar-conta', '#user-profile']);

    // 2. Exibir a seção de séries
    showSection('#series');

    // 3. Implementar lógica para carregar e exibir as séries
}

// Funções para lidar com a exibição da seção de atores (implementar lógica)
function showActorsSection() {
    // 1. Ocultar as seções da página inicial, filmes, séries, detalhes, etc.
    hideSections(['#home', '#filmes', '#series', '#movie-details', '#actor-details', '#serie-details', '#favoritos', '#login', '#criar-conta', '#user-profile']);

    // 2. Exibir a seção de atores
    showSection('#atores');

    // 3. Implementar lógica para carregar e exibir os atores
}

// Função auxiliar para ocultar seções
function hideSections(sections) {
    sections.forEach(section => {
        const element = document.querySelector(section);
        if (element) {
            element.style.display = 'none';
        }
    });
}

// Função auxiliar para exibir uma seção
function showSection(section) {
    const element = document.querySelector(section);
    if (element) {
        element.style.display = 'block';
    }
}

// Event listeners para os links da navbar
document.querySelector('a[href="#home"]')?.addEventListener('click', showHomePage);
document.querySelector('a[href="#filmes"]')?.addEventListener('click', showMoviesSection);
document.querySelector('a[href="#series"]')?.addEventListener('click', showSeriesSection);
document.querySelector('a[href="#atores"]')?.addEventListener('click', showActorsSection);
// ... (adicionar event listeners para as outras seções) ...

// ... (restante do código) ...

// Inicialização da aplicação
getMovies(API_URL);

// Carrega os filmes em cartaz (implementar lógica)
loadFeaturedMovies();

// Carrega as categorias de filmes (implementar lógica)
loadMovieCategories();

// Carrega os filmes em cartaz na página inicial
function loadFeaturedMovies() {
    // 1. Construir a URL da API para buscar filmes em cartaz, incluindo a língua portuguesa
    const featuredMoviesURL = `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=pt-BR`;

    // 2. Buscar os filmes em cartaz
    fetch(featuredMoviesURL)
        .then(res => res.json())
        .then(data => {
            // 3. Exibir os filmes em cartaz na seção 'filmes-em-cartaz'
            const featuredMoviesSection = document.getElementById('filmes-em-cartaz').querySelector('.row');

            data.results.slice(0, 4).forEach(movie => { // Exibe os 4 primeiros filmes
                const movieEl = document.createElement('div');
                movieEl.classList.add('col-md-3', 'mb-4');
                movieEl.innerHTML = `
                    <div class="card">
                        <img src="${IMG_PATH + movie.poster_path}" alt="${movie.title}" class="card-img-top">
                        <div class="card-body">
                            <h5 class="card-title">${movie.title}</h5>
                        </div>
                    </div>
                `;
                featuredMoviesSection.appendChild(movieEl);
            });
        });
}

// Carrega as categorias de filmes na página inicial
function loadMovieCategories() {
    // 1. Buscar a lista de gêneros da API
    const genresURL = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=pt-BR`;

    fetch(genresURL)
        .then(res => res.json())
        .then(data => {
            // 2. Exibir as categorias na seção 'categorias'
            const categoriesSection = document.getElementById('categorias').querySelector('.row');

            data.genres.forEach(genre => { // Exibe todos os gêneros
                const categoryEl = document.createElement('div');
                categoryEl.classList.add('col-md-3', 'mb-4');
                categoryEl.innerHTML = `
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${genre.name}</h5>
                            <a href="#" class="btn btn-primary" onclick="filterMoviesByGenre(${genre.id})">Ver filmes</a>
                        </div>
                    </div>
                `;
                categoriesSection.appendChild(categoryEl);
            });
        });
}

// Função para atualizar a paginação
function updatePagination(currentPage, totalPages) {
    const pagination = document.querySelector('.pagination');
    pagination.innerHTML = '';

    // Botão "Anterior"
    const prevButton = document.createElement('li');
    prevButton.classList.add('page-item');
    prevButton.innerHTML = `<a class="page-link" href="#" aria-label="Previous" onclick="getMovies(API_URL, ${currentPage - 1})"><span aria-hidden="true">&laquo;</span></a>`;
    if (currentPage === 1) {
        prevButton.classList.add('disabled');
    }
    pagination.appendChild(prevButton);

    // Números das páginas
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('li');
        pageButton.classList.add('page-item');
        pageButton.innerHTML = `<a class="page-link" href="#" onclick="getMovies(API_URL, ${i})">${i}</a>`;
        if (i === currentPage) {
            pageButton.classList.add('active');
        }
        pagination.appendChild(pageButton);
    }

    // Botão "Próximo"
    const nextButton = document.createElement('li');
    nextButton.classList.add('page-item');
    nextButton.innerHTML = `<a class="page-link" href="#" aria-label="Next" onclick="getMovies(API_URL, ${currentPage + 1})"><span aria-hidden="true">&raquo;</span></a>`;
    if (currentPage === totalPages) {
        nextButton.classList.add('disabled');
    }
    pagination.appendChild(nextButton);
}
