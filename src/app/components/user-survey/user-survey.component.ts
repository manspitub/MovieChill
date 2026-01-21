import { Component, signal } from '@angular/core';
import { SurveyAnswers } from '../../shared/interfaces/survey';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-survey',
  imports: [CommonModule],
  templateUrl: './user-survey.component.html',
  styleUrl: './user-survey.component.css'
})
export class UserSurveyComponent {
// Señal para guardar las respuestas
  answers = signal<SurveyAnswers>({
    genres: [],
    type: 'movie',
    mood: '',
    runtime: ''
  });

  currentStep = signal(0);
  steps = ['Tipo', 'Géneros', 'Mood', 'Duración'];

  // Opciones para cada paso
  genreOptions = ['Action', 'Comedy', 'Drama', 'Thriller', 'Romance', 'Horror', 'Sci-Fi'];
  moodOptions = ['Feel-good', 'Exciting', 'Sad', 'Romantic', 'Scary', 'Funny'];
  runtimeOptions = ['Short (<90 min)', 'Medium (90-120 min)', 'Long (>120 min)'];

  // Avanzar al siguiente paso
  nextStep() {
    if (this.currentStep() < this.steps.length - 1) {
      this.currentStep.set(this.currentStep() + 1);
    } else {
      this.finishSurvey();
    }
  }

  prevStep() {
    if (this.currentStep() > 0) {
      this.currentStep.set(this.currentStep() - 1);
    }
  }

  toggleGenre(genre: string) {
    const genres = [...this.answers().genres];
    if (genres.includes(genre)) {
      this.answers.set({ ...this.answers(), genres: genres.filter(g => g !== genre) });
    } else {
      this.answers.set({ ...this.answers(), genres: [...genres, genre] });
    }
  }

  selectMood(mood: string) {
    this.answers.set({ ...this.answers(), mood });
  }

  selectType(type: 'movie' | 'tv') {
    this.answers.set({ ...this.answers(), type });
  }

  selectRuntime(runtime: string) {
    this.answers.set({ ...this.answers(), runtime });
  }

  finishSurvey() {
    localStorage.setItem('seenSurvey', 'true');
    console.log('Survey complete:', this.answers());
    // Mando a la IA o guardo en LocalStorage según se decida
  }
}
