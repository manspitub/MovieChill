import { Component, inject, OnInit, signal } from '@angular/core';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../shared/interfaces/movies';
import { Genre } from '../../shared/interfaces/genres';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movie-section',
  imports: [CommonModule],
  templateUrl: './movie-section.component.html',
  styleUrl: './movie-section.component.css',
})
export class MovieSectionComponent implements OnInit {
  movieService = inject(MovieService);
  loadingGenres = signal<{ [genreId: number]: boolean }>({});
  imageLoading = signal<{ [movieId: number]: boolean }>({});

  ngOnInit(): void {
    // Primero obtenemos los géneros desde el servicio
    this.movieService.getGenresSignal().subscribe({
      next: () => {
        // Obtenemos el array real de géneros desde el signal
        const genres = this.movieService.genresSignal().genres;

        console.log('Fetched Genres:', genres);
        // Iteramos sobre cada género
        genres.forEach((genre: Genre) => {
          // Marcar como cargando
          this.loadingGenres.set({
            ...this.loadingGenres(),
            [genre.id]: true,
          });

          // Por cada género pedimos las películas
          this.movieService.getMoviesByGenre(genre.id).subscribe({
            next: (movies) => {
              // Añadimos las películas al signal de películas
              console.log(`Movies for ${genre.name}:`, movies.results);
              
              // Inicializar estados de carga de imágenes
              movies.results.forEach((movie: Movie) => {
                if (movie.poster_path) {
                  this.imageLoading.set({
                    ...this.imageLoading(),
                    [movie.id]: true,
                  });
                }
              });

              // Marcar género como cargado
              this.loadingGenres.set({
                ...this.loadingGenres(),
                [genre.id]: false,
              });
            },
            error: (err) => {
              console.error(`Error fetching movies for ${genre.name}:`, err);
              this.loadingGenres.set({
                ...this.loadingGenres(),
                [genre.id]: false,
              });
            },
          });
        });
      },
      error: (err) => console.error('Error fetching genres:', err),
    });
  }

  onImageLoad(movieId: number) {
    this.imageLoading.set({
      ...this.imageLoading(),
      [movieId]: false,
    });
  }

  onImageError(movieId: number) {
    this.imageLoading.set({
      ...this.imageLoading(),
      [movieId]: false,
    });
  }

  isLoadingGenre(genreId: number): boolean {
    return this.loadingGenres()[genreId] === true;
  }

  isLoadingImage(movieId: number): boolean {
    return this.imageLoading()[movieId] === true;
  }

  getSkeletonArray(count: number): number[] {
    return Array(count).fill(0);
  }
}
