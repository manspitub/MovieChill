import { Component, inject, OnInit, signal } from '@angular/core';
import { MovieService } from '../../services/movie.service';
import { Movie, MovieDetails } from '../../shared/interfaces/movies';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-smart-pick',
  imports: [CommonModule],
  templateUrl: './smart-pick.component.html',
  styleUrl: './smart-pick.component.css',
})
export class SmartPickComponent implements OnInit {
  movieService = inject(MovieService);
  loading = signal(true); // Iniciar en true para ocultar contenido al recargar
  backdropPath = 'https://image.tmdb.org/t/p/original';
  movie = signal<Movie | null>(null);
  movieDetails = signal<MovieDetails | null>(null);
  genres = signal<string[]>([]);

  ngOnInit(): void {
    // Asegurarse de que los géneros estén cargados
    this.movieService.getGenresSignal().subscribe({
      next: () => {
        this.pickMovie();
      },
      error: () => this.pickMovie(),
    });
  }

  pickMovie() {
    this.loading.set(true);

    this.movieService.getTrendingMovies().subscribe({
      next: () => {
        console.log(
          'Trending movies fetched for Smart Pick.',
          this.movieService.trendingMoviesSignal(),
        );
        const candidates = this.movieService.trendingMoviesSignal().results;

        const random =
          candidates[Math.floor(Math.random() * candidates.length)];

        // Obtener detalles de la película para tener runtime y géneros completos
        this.movieService.getMovieDetails(random.id).subscribe({
          next: (details) => {
            
            // Mapear géneros a nombres
            const genreNames = details.genres.map((genre) => genre.name);


            setTimeout(() => {
              const img = new Image();
              img.src = this.backdropPath + random.backdrop_path;
              img.onload = () => {
                this.movie.set(random);
                this.genres.set(genreNames);
                this.movieDetails.set(details);
                this.loading.set(false);
              };
            }, 1500);
          },
          error: () => {
            // Si falla obtener detalles, usar los genre_ids y mapearlos
            this.mapGenresFromIds(random.genre_ids);
            setTimeout(() => {
              const img = new Image();
              img.src = this.backdropPath + random.backdrop_path;
              img.onload = () => {
                this.movie.set(random);
                this.loading.set(false);
              };
            }, 1500);
          },
        });
      },
      error: () => this.loading.set(false),
    });
  }

  private mapGenresFromIds(genreIds: number[]): void {
    const genresMap = this.movieService.genresSignal().genres || [];
    const genreNames = genreIds
      .map((id) => {
        const genre = genresMap.find((g) => g.id === id);
        return genre ? genre.name : null;
      })
      .filter((name): name is string => name !== null);
    this.genres.set(genreNames);
  }

  formatRuntime(minutes: number | null | undefined): string {
    if (!minutes) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  }
}
