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

  

  ngOnInit(): void {
    // Primero obtenemos los géneros desde el servicio
    this.movieService.getGenresSignal().subscribe({
      next: () => {
        // Obtenemos el array real de géneros desde el signal
        const genres = this.movieService.genresSignal().genres;

        console.log('Fetched Genres:', genres);
        // Iteramos sobre cada género
        genres.forEach((genre: Genre) => {
          // Por cada género pedimos las películas
          this.movieService.getMoviesByGenre(genre.id).subscribe({
            next: (movies) => {
              // Añadimos las películas al signal de películas
              console.log(`Movies for ${genre.name}:`, movies.results);
            },
            error: (err) =>
              console.error(`Error fetching movies for ${genre.name}:`, err),
          });
        });
      },
      error: (err) => console.error('Error fetching genres:', err),
    });
  }
}
