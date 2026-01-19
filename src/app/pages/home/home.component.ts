import { Component } from '@angular/core';
import { MoviesSliderComponent } from '../../components/movies-slider/movies-slider.component';
import { MovieSectionComponent } from "../../components/movie-section/movie-section.component";


@Component({
  selector: 'app-home',
  imports: [MoviesSliderComponent, MovieSectionComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
