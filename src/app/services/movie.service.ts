import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Movie, Movies } from '../shared/interfaces/movies';
import { Observable, tap } from 'rxjs';
import { Genre, GenresResponse } from '../shared/interfaces/genres';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  http: HttpClient = inject(HttpClient);

  sliderMoviesSignal = signal<Movies>({} as Movies);
  genreMoviesSignal = signal<{ [genreId: number]: Movies }>({});
  genresSignal = signal<GenresResponse>({} as GenresResponse);
  trendingMoviesSignal = signal<Movies>({} as Movies);
  userLang = navigator.language || 'en-US';

  preferencesSignal = signal<{ genre?: string; type?: 'movie' | 'tv' }>({});

  constructor() {}

  getSliderMovies(page: number = 1): Observable<Movies> {
    console.log('User Language:', this.userLang);
    return this.http
      .get<Movies>(
        `${environment.tmdbBaseUrl}/movie/now_playing?api_key=${environment.tmdbApiKey}&page=${page}&language=${this.userLang}`,
      )
      .pipe(tap((data) => this.sliderMoviesSignal.set(data)));
  }

  getGenresSignal(): Observable<GenresResponse> {
    return this.http
      .get<GenresResponse>(
        `${environment.tmdbBaseUrl}/genre/movie/list?api_key=${environment.tmdbApiKey}&language=${this.userLang}`,
      )
      .pipe(tap((data) => this.genresSignal.set(data)));
  }

  getMoviesByGenre(genreId: number, page: number = 1): Observable<Movies> {
    return this.http
      .get<Movies>(
        `${environment.tmdbBaseUrl}/discover/movie?api_key=${environment.tmdbApiKey}&with_genres=${genreId}&page=${page}&language=${this.userLang}`,
      )
      .pipe(
        tap((data) =>
          this.genreMoviesSignal.set({
            ...this.genreMoviesSignal(),
            [genreId]: data,
          }),
        ),
        tap((data) => data.results),
      );
  }

  getTrendingMovies(page: number = 1): Observable<Movies> {
    return this.http
      .get<Movies>(
        `${environment.tmdbBaseUrl}/trending/movie/week?api_key=${environment.tmdbApiKey}&page=${page}&language=${this.userLang}`,
      )
      .pipe(tap((data) => this.trendingMoviesSignal.set(data)));
  }
}
