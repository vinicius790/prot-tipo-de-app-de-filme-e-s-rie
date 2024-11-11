// movie-app.component.ts

import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
    selector: 'app-movie-app',
     templateUrl: './movie-app.component.html',
     styleUrls: ['./movie-app.component.css']
})
export class MovieAppComponent implements OnInit {
  API_KEY = '3fd2be6f0c70a2a598f084ddfb75487c';
  API_URL = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${this.API_KEY}`;
  IMG_PATH = 'https://image.tmdb.org/t/p/w1280';
  SEARCH_API = `https://api.themoviedb.org/3/search/movie?api_key=${this.API_KEY}&query="`;

  searchControl = new FormControl();

  movies: any[] = [];
  featuredMovies: any[] = [];
  movieGenres: any[] = [];
  favorites: any[] = [];
  reviews: any[] = [];
  searchTerm: string = '';
  selectedGenre: string = '';
  reviewText: string = '';
  selectedMovie: any = null;
  selectedActor: any = null;
  selectedSerie: any = null;
  user: any = null;
  isLoading: boolean = false;

  // Paginação
  currentPage = 1;
  totalPages = 1;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadMovies();
    this.loadFeaturedMovies();
    this.loadMovieCategories();
    this.loadFavorites();
    this.searchControl.valueChanges
    .pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(searchTerm => {
        if (searchTerm && searchTerm.trim() !== '') {
          const searchUrl = `${this.SEARCH_API}${searchTerm}`;
          return this.http.get<any>(searchUrl);
        } else {
          return this.http.get<any>(this.API_URL);
        }
      })
    )
    .subscribe(data => {
      this.movies = data.results;
    });
  }

  loadMovies(page: number = 1) {
    this.isLoading = true;
    let params = new HttpParams().set('page', page.toString());
    this.http.get<any>(this.API_URL, { params }).subscribe(data => {
      this.movies = data.results;
      this.currentPage = data.page;
      this.totalPages = data.total_pages;
      this.isLoading = true;
  let params = new HttpParams().set('page', page.toString());
  this.http.get<any>(this.API_URL, { params })
    .pipe(
      catchError(error => {
        console.error('Erro ao carregar filmes:', error);
        this.isLoading = false;
        // Exibir mensagem de erro ao usuário (implementar lógica)
        return of(null); 
      })
    )
    .subscribe(data => {
      if (data) {
        this.movies = data.results;
        this.currentPage = data.page;
        this.totalPages = data.total_pages;
      }
      this.isLoading = false;
    });
    });
  }

  getClassByRate(vote: number): string {
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
      const searchUrl = `${this.SEARCH_API}${this.searchTerm}`;
      this.loadMovies();
      this.searchTerm = '';
    }
  }

  filterMoviesByGenre() {
    const genreFilterURL = `${this.API_URL}&with_genres=${this.selectedGenre}`;
    this.loadMovies();
  }

  showMovieDetails(movieId: number) {
    const movieDetailsURL = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${this.API_KEY}&language=pt-BR&append_to_response=credits`;
    this.http.get(movieDetailsURL).subscribe((movie: any) => {
      this.selectedMovie = movie;
    });
  }

  addToFavorites(movie: any) {
    const existing = this.favorites.find(favorite => favorite.id === movie.id);
    if (!existing) {
      this.favorites.push(movie);
      localStorage.setItem('favorites', JSON.stringify(this.favorites));
    }
  }

  removeFromFavorites(movieId: number) {
    this.favorites = this.favorites.filter(favorite => favorite.id !== movieId);
    localStorage.setItem('favorites', JSON.stringify(this.favorites));
  }

  loadFavorites() {
    this.favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
  }

  addReview(event: Event) {
    event.preventDefault();
    if (this.reviewText.trim() !== '' && this.selectedMovie) { 
      this.reviews.push({ text: this.reviewText, movieId: this.selectedMovie.id });
      this.reviewText = '';
    }
  }

  loadFeaturedMovies() {
    const featuredMoviesURL = `https://api.themoviedb.org/3/movie/now_playing?api_key=${this.API_KEY}&language=pt-BR`;
    this.http.get(featuredMoviesURL).subscribe((data: any) => {
      this.featuredMovies = data.results.slice(0, 4);
    });
  }

  loadMovieCategories() {
    const genresURL = `https://api.themoviedb.org/3/genre/movie/list?api_key=${this.API_KEY}&language=pt-BR`;
    this.http.get(genresURL).subscribe((data: any) => {
      this.movieGenres = data.genres;
    });
  }

  showActorDetails(actorId: number) {
    const actorDetailsURL = `https://api.themoviedb.org/3/person/${actorId}?api_key=${this.API_KEY}&language=pt-BR`;
    this.http.get(actorDetailsURL).subscribe((actor: any) => {
      this.selectedActor = actor;
    });
  }

  // Paginação
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.loadMovies(page);
    }
  }

  // Função para exibir séries (implementar lógica) - exemplo
  showSeries() {
    const seriesURL = `https://api.themoviedb.org/3/discover/tv?sort_by=popularity.desc&api_key=${this.API_KEY}&language=pt-BR`;
    this.http.get(seriesURL).subscribe((data: any) => {
      // Lógica para exibir séries na página
      console.log("Séries:", data.results);
    });
  }

  // Função para exibir detalhes da série (implementar lógica) - exemplo
  showSerieDetails(serieId: number) {
    const serieDetailsURL = `https://api.themoviedb.org/3/tv/${serieId}?api_key=${this.API_KEY}&language=pt-BR`;
    this.http.get(serieDetailsURL).subscribe((serie: any) => {
      this.selectedSerie = serie;
      console.log("Detalhes da série:", serie);
    });
  }

  // Event listener para o formulário de login (implementar lógica) - exemplo
  onLogin(event: Event) {
    event.preventDefault();
    // Lógica para realizar o login (exemplo)
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;
    console.log("Realizar login com:", email, password);
  }

  // Event listener para o formulário de cadastro (implementar lógica) - exemplo
  onSignup(event: Event) {
    event.preventDefault();
    // Lógica para realizar o cadastro (exemplo)
    console.log("Realizar cadastro");
  }

  // Função para exibir o perfil do usuário (implementar lógica) - exemplo
  showUserProfile() {
    // Lógica para exibir o perfil do usuário (exemplo)
    console.log("Exibir perfil do usuário");
  }

  createPageRange(): number[] {
    const range = [];
    for (let i = Math.max(1, this.currentPage - 2); i <= Math.min(this.totalPages, this.currentPage + 2); i++) {
      range.push(i);
    }
    return range;
  }
}
function of(arg0: null) {
    throw new Error('Function not implemented.');
}

