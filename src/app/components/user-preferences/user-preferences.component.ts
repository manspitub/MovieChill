import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-user-preferences',
  imports: [CommonModule],
  templateUrl: './user-preferences.component.html',
  styleUrl: './user-preferences.component.css'
})
export class UserPreferencesComponent {
  

  movieService = inject(MovieService);

  // Géneros que vamos a mostrar
  genres = ['Action', 'Comedy', 'Horror', 'Thriller', 'Romance', 'Sci-Fi'];

  // Tipos de contenido
  types = ['movie', 'tv'] as const;

  setPreference(key: 'genre' | 'type', value: string) {
    this.movieService.preferencesSignal.update((prev) => ({ ...prev, [key]: value }));
  }

  resetPreferences() {
    this.movieService.preferencesSignal.set({});
  }
}
