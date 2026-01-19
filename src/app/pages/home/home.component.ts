import { Component } from '@angular/core';
import { MovieSectionComponent } from '../../components/movie-section/movie-section.component';
import { SmartPickComponent } from "../../components/smart-pick/smart-pick.component";

@Component({
  selector: 'app-home',
  imports: [MovieSectionComponent, SmartPickComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
