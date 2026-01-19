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
        const candidates = this.movieService
          .trendingMoviesSignal()
          .results.filter(
            (m: Movie) =>
              m.vote_average >= 7 && m.vote_count > 500 && m.backdrop_path,
          );

        const random =
          candidates[Math.floor(Math.random() * candidates.length)];

        this.movie.set(random);
        setTimeout(() => {
          this.loading.set(false);
        }, 400);
      },
      error: () => this.loading.set(false),
    });
  }
}
