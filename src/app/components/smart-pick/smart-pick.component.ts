import { Component, inject, OnInit, signal } from '@angular/core';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../shared/interfaces/movies';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-smart-pick',
  imports: [CommonModule],
  templateUrl: './smart-pick.component.html',
  styleUrl: './smart-pick.component.css',
})
export class SmartPickComponent implements OnInit {
  movieService = inject(MovieService);
  loading = signal(false);
  backdropPath = 'https://image.tmdb.org/t/p/original';
  movie = signal<Movie | null>(null);
  ngOnInit(): void {
    this.pickMovie();
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

        setTimeout(() => {
          const img = new Image();
          img.src = this.backdropPath + random.backdrop_path;
          img.onload = () => {
            this.movie.set(random); // solo actualizar cuando la nueva imagen esté lista
            this.loading.set(false);
          };
        }, 1500);
      },
      error: () => this.loading.set(false),
    });
  }
}
