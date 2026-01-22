import { CommonModule } from '@angular/common';
import { Component, Host, HostListener, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { Genre } from '../../shared/interfaces/genres';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  router = inject(Router);
  movieService = inject(MovieService);
  scrolled = false;
  navBackground: any;
  showGenresDropdown = signal(false);
  genres = signal<Genre[]>([]);

  ngOnInit(): void {
    // Cargar géneros al inicializar
    this.movieService.getGenresSignal().subscribe({
      next: () => {
        this.genres.set(this.movieService.genresSignal().genres || []);
      },
    });
  }

  @HostListener('document:scroll') scrollover() {
    console.log(document.body.scrollTop, 'scrolllength#');

    if (document.body.scrollTop > 0 || document.documentElement.scrollTop > 0) {
      this.navBackground = {
        'backdrop-filter': 'blur(10px)',
        '-webkit-backdrop-filter': 'blur(10px)',
      };
    } else {
      this.navBackground = {};
    }
  }

  toggleGenresDropdown() {
    this.showGenresDropdown.set(!this.showGenresDropdown());
  }

  closeGenresDropdown() {
    this.showGenresDropdown.set(false);
  }

  scrollToGenre(genreId: number) {
    this.closeGenresDropdown();
    
    // Navegar a home si no estamos ahí
    if (this.router.url !== '/home' && this.router.url !== '/') {
      this.router.navigate(['/home']).then(() => {
        setTimeout(() => this.scrollToGenreElement(genreId), 300);
      });
    } else {
      this.scrollToGenreElement(genreId);
    }
  }

  private scrollToGenreElement(genreId: number) {
    const element = document.getElementById(`genre-${genreId}`);
    if (element) {
      const navbarHeight = 80; // Altura aproximada del navbar
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navbarHeight - 20; // 20px de espacio adicional

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  }
}
