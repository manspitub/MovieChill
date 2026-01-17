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
  backdropPath: string = 'https://image.tmdb.org/t/p/original';

  // Dragging related properties
  isDragging = false;
  startX = 0;
  currentTranslate = 0;
  prevTranslate = 0;

  

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

  onDragStart(event: MouseEvent | TouchEvent) {
    this.pauseCarousel();
    this.isDragging = true;

    this.startX =
      event instanceof TouchEvent ? event.touches[0].clientX : event.clientX;
  }

  onDragMove(event: MouseEvent | TouchEvent) {
    if (!this.isDragging) return;

    const currentX =
      event instanceof TouchEvent ? event.touches[0].clientX : event.clientX;
    this.currentTranslate = this.prevTranslate + currentX - this.startX;
    
  }

  onDragEnd() {
    this.isDragging = false;
    this.prevTranslate = this.currentTranslate;
    this.resumeCarousel();
  }

  getSliderStyle() {
    return {
      transform: `translateX(${this.currentTranslate}px)`,
      transition: this.isDragging ? 'none' : 'transform 0.3s ease-out',
    };
  }
}
