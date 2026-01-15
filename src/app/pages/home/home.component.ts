import { Component } from '@angular/core';
import { MoviesSliderComponent } from '../../components/movies-slider/movies-slider.component';


@Component({
  selector: 'app-home',
  imports: [MoviesSliderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
