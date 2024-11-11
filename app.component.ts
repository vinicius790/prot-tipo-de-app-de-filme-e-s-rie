import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  API_KEY = '3fd2be6f0c70a2a598f084ddfb75487c';
  API_URL = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${this.API_KEY}&page=1`;
  IMG_PATH = 'https://image.tmdb.org/t/p/w1280';
  SEARCH_API = `https://api.themoviedb.org/3/search/movie?api_key=${this.API_KEY}&query="`;

  movies: any[] = [];
  featuredMovies: any[] = []; // Filmes em cartaz
  movieGenres: any[] = []; // Gêneros de filmes
  favorites: any[] = [];
  reviews: any[] = []; // Array de objetos de avaliação
  searchTerm: string = '';
  selectedGenre: string = '';
  reviewText: string = '';
  selectedMovie: any = null;
  user: any = null; // Objeto para armazenar dados do usuário

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getMovies(this.API_URL);
    this.loadFeaturedMovies();
    this.loadMovieCategories();
    this.loadFavorites(); // Carrega os favoritos do localStorage
  }
  
  loadFavorites() {
    throw new Error('Method not implemented.');
  }

  getMovies(url: string) {
    this.http.get(url).subscribe((data: any) => {
      this.movies = data.results;
    });
  }

  getClassByRate(vote: number) {
    if (vote >= 8) {
      return 'green';
    } else if (vote >= 5) {
      return 'orange';
    } else {
      return 'red';
    }
  }

  onSearch(event: Event) {
    event.preventDefault();
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      this.getMovies(this.SEARCH_API + this.searchTerm);
      this.searchTerm = '';
    }
  }

  filterMoviesByGenre(...args: []) {
    console.log('Filtering by genre:', this.selectedGenre);
    const genreFilterURL = `https://api.themoviedb.org/3/discover/movie?api_key=${this.API_KEY}&with_genres=${this.selectedGenre}`;
    this.getMovies(genreFilterURL);
  }

  addReview(event: Event) {
    event.preventDefault();
    if (this.reviewText.trim() !== '') {
      this.reviews.push({ text: this.reviewText, movieId: this.selectedMovie.id }); // Adiciona o ID do filme à avaliação
      this.reviewText = '';
    }
  }

  // Carrega os filmes em cartaz na página inicial
  loadFeaturedMovies() {
    const featuredMoviesURL = `https://api.themoviedb.org/3/movie/now_playing?api_key=${this.API_KEY}&language=pt-BR`;
    this.http.get(featuredMoviesURL).subscribe((data: any) => {
      this.featuredMovies = data.results.slice(0, 4);
    });
  }

  // Carrega as categorias de filmes na página inicial
  loadMovieCategories() {
    const genresURL = `https://api.themoviedb.org/3/genre/movie/list?api_key=${this.API_KEY}&language=pt-BR`;
    this.http.get(genresURL).subscribe((data: any) => {
      this.movieGenres = data.genres.slice(0, 4);
    });
  }

  // Função para exibir atores (implementar lógica)
  showActors(actors: any[]) {
    // Lógica para exibir atores na página
    console.log("Exibir atores:", actors);
  }

  // Função para exibir detalhes do ator (implementar lógica)
  showActorDetails(actorId: number) {
    console.log('Fetching details for actor ID:', actorId);
    // Lógica para buscar detalhes do ator da API e exibir
  }

  // Função para exibir séries (implementar lógica)
  showSeries(series: any[]) {
    // Lógica para exibir séries na página
    console.log("Exibir séries:", series);
  }

  // Função para exibir detalhes da série (implementar lógica)
  showSerieDetails(serieId: number) {
    console.log('Fetching details for serie ID:', serieId);
    // Lógica para buscar detalhes da série da API e exibir
  }

  // Event listener para o formulário de login (implementar lógica)
  onLogin(event: Event) {
    event.preventDefault();
    // Lógica para realizar o login
    console.log("Realizar login");
  }

  // Event listener para o formulário de cadastro (implementar lógica)
  onSignup(event: Event) {
    event.preventDefault();
    // Lógica para realizar o cadastro
    console.log("Realizar cadastro");
  }

  // Função para exibir o perfil do usuário (implementar lógica)
  showUserProfile() {
    // Lógica para exibir o perfil do usuário
    console.log("Exibir perfil do usuário");
  }
}
