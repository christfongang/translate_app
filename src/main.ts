import { Component, OnInit, OnDestroy } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { TranslationService, Translation } from './app/translation.service';
import { LanguageSelectorComponent } from './app/language-selector.component';
import { AudioControlsComponent } from './app/audio-controls.component';
import { TranslationDisplayComponent } from './app/translation-display.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    LanguageSelectorComponent,
    AudioControlsComponent,
    TranslationDisplayComponent
  ],
  template: `
    <div class="app-container">
      <header class="app-header">
        <div class="container">
          <div class="header-content">
            <h1 class="app-title">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.01-4.65.75-6.84-.36-.63-1.36-.63-1.72 0-1.26 2.19-.99 4.9.75 6.84l.03.03-2.54 2.51c-.33.33-.33.87 0 1.21l2.97 2.97c.33.33.87.33 1.21 0L12.87 16.28c.33-.33.33-.87 0-1.21z"/>
                <circle cx="7.5" cy="14.5" r="1.5"/>
                <circle cx="16.5" cy="9.5" r="1.5"/>
              </svg>
              MeetingTranslate
            </h1>
            <p class="app-subtitle">Traduction de réunions en temps réel</p>
          </div>
        </div>
      </header>

      <main class="main-content">
        <div class="container">
          <!-- Language Selection -->
          <div class="language-panel card">
            <div class="panel-header">
              <h2>Configuration des langues</h2>
              <p>Sélectionnez la langue source et la langue de traduction</p>
            </div>
            <div class="language-selectors">
              <app-language-selector
                [languages]="translationService.languages"
                [selectedLanguage]="sourceLang"
                [label]="'Langue source (ce que vous entendez)'"
                [id]="'source-lang'"
                (languageChange)="onSourceLanguageChange($event)"
              />
              
              <div class="language-arrow">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
              
              <app-language-selector
                [languages]="translationService.languages"
                [selectedLanguage]="targetLang"
                [label]="'Langue cible (traduction)'"
                [id]="'target-lang'"
                (languageChange)="onTargetLanguageChange($event)"
              />
            </div>
          </div>

          <!-- Audio Controls -->
          <app-audio-controls
            [isRecording]="isRecording"
            [canRecord]="canRecord"
            [currentStatus]="currentStatus"
            (startRecording)="startRecording()"
            (stopRecording)="stopRecording()"
            (clearAll)="clearTranslations()"
          />

          <!-- Translation Display -->
          <app-translation-display
            [translations]="translations"
            [currentTranslation]="currentTranslation"
          />
        </div>
      </main>

      <footer class="app-footer">
        <div class="container">
          <p>&copy; 2025 MeetingTranslate - Traduction intelligente de réunions</p>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .app-header {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      padding: 1rem 0;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .header-content {
      text-align: center;
      color: var(--white);
    }

    .app-title {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      margin: 0 0 0.5rem 0;
      font-size: 1.875rem;
      font-weight: 700;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .app-subtitle {
      margin: 0;
      font-size: 1rem;
      opacity: 0.9;
      font-weight: 400;
    }

    .main-content {
      flex: 1;
      padding: 2rem 0;
    }

    .language-panel {
      margin-bottom: 2rem;
      padding: 2rem;
    }

    .panel-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .panel-header h2 {
      margin: 0 0 0.5rem 0;
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--gray-800);
    }

    .panel-header p {
      margin: 0;
      color: var(--gray-600);
      font-size: 0.875rem;
    }

    .language-selectors {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
      gap: 1.5rem;
      max-width: 600px;
      margin: 0 auto;
    }

    .language-arrow {
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--primary);
      margin-top: 1.5rem; /* Align with form inputs */
    }

    .app-footer {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-top: 1px solid rgba(255, 255, 255, 0.2);
      padding: 1rem 0;
      text-align: center;
      color: var(--white);
      font-size: 0.875rem;
      margin-top: auto;
    }

    .app-footer p {
      margin: 0;
      opacity: 0.8;
    }

    @media (max-width: 768px) {
      .app-title {
        font-size: 1.5rem;
      }

      .app-subtitle {
        font-size: 0.875rem;
      }

      .main-content {
        padding: 1rem 0;
      }

      .language-panel {
        margin-bottom: 1rem;
        padding: 1.5rem;
      }

      .language-selectors {
        grid-template-columns: 1fr;
        gap: 1rem;
        text-align: center;
      }

      .language-arrow {
        transform: rotate(90deg);
        margin: 0;
      }

      .panel-header h2 {
        font-size: 1.25rem;
      }
    }

    @media (max-width: 480px) {
      .container {
        padding: 0 0.75rem;
      }

      .language-panel {
        padding: 1rem;
      }

      .app-title {
        font-size: 1.25rem;
      }
    }
  `]
})
export class App implements OnInit, OnDestroy {
  sourceLang = 'fr';
  targetLang = 'en';
  isRecording = false;
  translations: Translation[] = [];
  currentTranslation = '';
  
  private subscriptions = new Subscription();

  constructor(public translationService: TranslationService) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.translationService.isRecording$.subscribe(recording => {
        this.isRecording = recording;
      })
    );

    this.subscriptions.add(
      this.translationService.translations$.subscribe(translations => {
        this.translations = translations;
      })
    );

    this.subscriptions.add(
      this.translationService.currentTranslation$.subscribe(translation => {
        this.currentTranslation = translation;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  get canRecord(): boolean {
    return this.sourceLang !== '' && this.targetLang !== '' && this.sourceLang !== this.targetLang;
  }

  get currentStatus(): 'idle' | 'recording' | 'processing' {
    if (this.isRecording) return 'recording';
    if (this.currentTranslation && this.currentTranslation.includes('Traitement en cours')) return 'processing';
    return 'idle';
  }

  onSourceLanguageChange(langCode: string): void {
    this.sourceLang = langCode;
  }

  onTargetLanguageChange(langCode: string): void {
    this.targetLang = langCode;
  }

  async startRecording(): Promise<void> {
    try {
      await this.translationService.startRecording();
    } catch (error) {
      console.error('Error starting recording:', error);
      // In a real app, you'd show a toast notification here
      alert('Erreur lors du démarrage de l\'enregistrement. Vérifiez les permissions du microphone.');
    }
  }

  stopRecording(): void {
    this.translationService.stopRecording();
  }

  clearTranslations(): void {
    this.translationService.clearTranslations();
  }
}

bootstrapApplication(App);

// Enregistrement du Service Worker pour PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW enregistré avec succès:', registration);
        
        // Vérifier les mises à jour
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // Nouvelle version disponible
                if (confirm('Une nouvelle version est disponible. Recharger ?')) {
                  window.location.reload();
                }
              }
            });
          }
        });
      })
      .catch((error) => {
        console.log('Échec enregistrement SW:', error);
      });
  });
}

// Support des notifications push (optionnel)
if ('Notification' in window && 'serviceWorker' in navigator) {
  // Demander permission pour les notifications
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      console.log('Permission notifications accordée');
    }
  });
}