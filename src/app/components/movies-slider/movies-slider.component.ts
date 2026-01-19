import {
  Component,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
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
  dragSpeed = 2; // Adjust this value to change drag sensitivity

  @ViewChild('group', { static: false })
  group!: ElementRef<HTMLElement>;

  groupWidth: number = 0;

  ngOnInit(): void {
    this.Movies.sliderMovies().subscribe((result) => {
      console.log('Slider Movies Result:', result);
      this.movies.set(result.results);
    });
  }

  ngAfterViewInit() {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        this.groupWidth = entry.target.scrollWidth;
        console.log('Group Width:', this.groupWidth);
      }
    });

    observer.observe(this.group.nativeElement);
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
    const delta = currentX - this.startX;
    this.currentTranslate = this.prevTranslate + delta * this.dragSpeed;

    this.checkInfiniteScroll();
  }

  checkInfiniteScroll() {
    console.log('Current Translate:', this.currentTranslate);
    console.log('Group Width:', this.groupWidth);
    // Cuando el grupo se ha desplazado completamente
    if (Math.abs(this.currentTranslate) >= this.groupWidth) {
      console.log('Resetting translate for infinite scroll');
      this.currentTranslate = 0;
      this.prevTranslate = 0;
    }
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
