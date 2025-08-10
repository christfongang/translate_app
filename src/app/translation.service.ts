import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, delay, of } from 'rxjs';

export interface Translation {
  id: string;
  originalText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  timestamp: Date;
}

export interface Language {
  code: string;
  name: string;
  flag: string;
}

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private translationsSubject = new BehaviorSubject<Translation[]>([]);
  public translations$ = this.translationsSubject.asObservable();

  private isRecordingSubject = new BehaviorSubject<boolean>(false);
  public isRecording$ = this.isRecordingSubject.asObservable();

  private currentTranslationSubject = new BehaviorSubject<string>('');
  public currentTranslation$ = this.currentTranslationSubject.asObservable();

  public languages: Language[] = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ];

  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];

  constructor() {}

  async startRecording(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        this.audioChunks.push(event.data);
      };

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
        this.processAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      this.mediaRecorder.start(1000); // Collect data every second
      this.isRecordingSubject.next(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      throw new Error('Impossible d\'accéder au microphone. Vérifiez les permissions.');
    }
  }

  stopRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.stop();
      this.isRecordingSubject.next(false);
    }
  }

  private async processAudio(audioBlob: Blob): Promise<void> {
    // Simulate audio processing and translation
    this.currentTranslationSubject.next('Traitement en cours...');
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock translation results
    const mockTranslations = [
      {
        original: "Bonjour, comment allez-vous aujourd'hui?",
        translated: "Hello, how are you today?"
      },
      {
        original: "Nous devons discuter du budget pour le prochain trimestre.",
        translated: "We need to discuss the budget for the next quarter."
      },
      {
        original: "Pouvez-vous répéter cette information importante?",
        translated: "Can you repeat this important information?"
      },
      {
        original: "La réunion est prévue pour demain matin à 9 heures.",
        translated: "The meeting is scheduled for tomorrow morning at 9 AM."
      },
      {
        original: "Merci pour votre présentation très intéressante.",
        translated: "Thank you for your very interesting presentation."
      },
      {
        original: "Je pense que nous devons revoir notre stratégie marketing.",
        translated: "I think we need to review our marketing strategy."
      },
      {
        original: "Les ventes ont augmenté de 15% ce mois-ci.",
        translated: "Sales have increased by 15% this month."
      },
      {
        original: "Avez-vous des questions sur ce projet?",
        translated: "Do you have any questions about this project?"
      },
      {
        original: "Il faut finaliser le rapport avant vendredi.",
        translated: "We need to finalize the report before Friday."
      },
      {
        original: "L'équipe technique travaille sur une nouvelle fonctionnalité.",
        translated: "The technical team is working on a new feature."
      },
      {
        original: "Nous avons besoin de plus de ressources pour ce projet.",
        translated: "We need more resources for this project."
      },
      {
        original: "La deadline a été reportée à la semaine prochaine.",
        translated: "The deadline has been postponed to next week."
      },
      {
        original: "Pouvons-nous programmer une autre réunion?",
        translated: "Can we schedule another meeting?"
      },
      {
        original: "Les résultats sont très encourageants.",
        translated: "The results are very encouraging."
      },
      {
        original: "Il y a un problème avec le serveur principal.",
        translated: "There's an issue with the main server."
      },
      {
        original: "Nous devons améliorer l'expérience utilisateur.",
        translated: "We need to improve the user experience."
      },
      {
        original: "Le client est satisfait de nos services.",
        translated: "The client is satisfied with our services."
      },
      {
        original: "Combien de temps cela va-t-il prendre?",
        translated: "How long will this take?"
      },
      {
        original: "Nous devons respecter les délais convenus.",
        translated: "We must meet the agreed deadlines."
      },
      {
        original: "L'analyse des données montre des tendances positives.",
        translated: "Data analysis shows positive trends."
      }
    ];

    const randomTranslation = mockTranslations[Math.floor(Math.random() * mockTranslations.length)];
    
    // Show current translation first
    this.currentTranslationSubject.next(randomTranslation.translated);
    
    // Wait a bit then add to history
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newTranslation: Translation = {
      id: Date.now().toString(),
      originalText: randomTranslation.original,
      translatedText: randomTranslation.translated,
      sourceLang: 'fr',
      targetLang: 'en',
      timestamp: new Date()
    };

    const currentTranslations = this.translationsSubject.value;
    this.translationsSubject.next([newTranslation, ...currentTranslations]);
    
    // Clear current translation after adding to history
    setTimeout(() => {
      this.currentTranslationSubject.next('');
    }, 3000);
  }

  clearTranslations(): void {
    this.translationsSubject.next([]);
    this.currentTranslationSubject.next('');
  }

  getLanguageByCode(code: string): Language | undefined {
    return this.languages.find(lang => lang.code === code);
  }
}