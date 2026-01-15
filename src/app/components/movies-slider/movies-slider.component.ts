import { Component, inject, OnInit, signal } from '@angular/core';
import { MovieService } from '../../services/movie.service';
import { CommonModule } from '@angular/common';
import { Movie } from '../../shared/interfaces/movies';

@Component({
  selector: 'app-movies-slider',
  imports: [CommonModule],
  templateUrl: './movies-slider.component.html',
  styleUrl: './movies-slider.component.css',
})
export class MoviesSliderComponent implements OnInit {
  private Movies = inject(MovieService);

  movies = signal<Movie[]>([]);

  paused = false;

  backdropPath: string = 'https://image.tmdb.org/t/p/w780';

  ngOnInit(): void {
    this.Movies.sliderMovies().subscribe((result) => {
      console.log('Slider Movies Result:', result);
      this.movies.set(result.results);
    });
  }

  pauseCarousel() {
    this.paused = true;
  }

  resumeCarousel() {
    this.paused = false;
  }
}
