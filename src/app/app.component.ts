import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { UserSurveyComponent } from "./components/user-survey/user-survey.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, CommonModule, UserSurveyComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  showSurvey = signal(false);

  constructor() {
    const seenSurvey = localStorage.getItem('seenSurvey');
    if (!seenSurvey) {
      this.showSurvey.set(true); // mostrar encuesta
    }
  }

  surveyFinished() {
    
    this.showSurvey.set(false);

    localStorage.setItem('seenSurvey', 'true'); // marca como hecha
  }
}
