import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Movie, Movies } from '../shared/interfaces/movies';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  http: HttpClient = inject(HttpClient);

  moviesSignal = signal<Movies>({} as Movies);
  userLang = navigator.language || 'en-US';

  constructor() {}

  sliderMovies(page: number = 1): Observable<Movies> {
    console.log('User Language:', this.userLang);
    return this.http
      .get<Movies>(
        `${environment.tmdbBaseUrl}/movie/now_playing?api_key=${environment.tmdbApiKey}&page=${page}&language=${this.userLang}`
      )
      .pipe(tap((data) => this.moviesSignal.set(data)));
  }
}
