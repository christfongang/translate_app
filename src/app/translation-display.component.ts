import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Translation } from './translation.service';

@Component({
  selector: 'app-translation-display',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="translation-display">
      <!-- Current Translation -->
      <div *ngIf="currentTranslation && currentTranslation.trim().length > 0" class="current-translation animate-fadeIn">
        <div class="translation-header">
          <h3>Traduction en cours</h3>
          <div class="live-indicator">
            <div class="live-dot"></div>
            <span>LIVE</span>
          </div>
        </div>
        <div class="translation-text current">
          {{ currentTranslation }}
        </div>
      </div>

      <!-- Translation History -->
      <div *ngIf="translations.length > 0" class="history-section">
        <h3 class="history-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
          </svg>
          Historique des traductions
        </h3>
        
        <div class="translations-list">
          <div 
            *ngFor="let translation of translations; trackBy: trackByTranslation" 
            class="translation-item animate-fadeIn"
          >
            <div class="translation-meta">
              <span class="timestamp">
                {{ translation.timestamp | date:'HH:mm:ss' }}
              </span>
              <div class="language-indicators">
                <span class="lang-badge source">{{ getLanguageName(translation.sourceLang) }}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                <span class="lang-badge target">{{ getLanguageName(translation.targetLang) }}</span>
              </div>
            </div>
            
            <div class="translation-content">
              <div class="original-text">
                <span class="label">Original:</span>
                {{ translation.originalText }}
              </div>
              <div class="translated-text">
                <span class="label">Traduit:</span>
                {{ translation.translatedText }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!currentTranslation && translations.length === 0" class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.01-4.65.75-6.84-.36-.63-1.36-.63-1.72 0-1.26 2.19-.99 4.9.75 6.84l.03.03-2.54 2.51c-.33.33-.33.87 0 1.21l2.97 2.97c.33.33.87.33 1.21 0L12.87 16.28c.33-.33.33-.87 0-1.21z"/>
          <path d="M21 9c0-4.97-4.03-9-9-9s-9 4.03-9 9c0 2.16.76 4.15 2.04 5.69l1.42-1.42C5.6 12.38 5 10.75 5 9c0-3.86 3.14-7 7-7s7 3.14 7 7-3.14 7-7 7c-1.75 0-3.38-.6-4.69-1.46l-1.42 1.42C7.85 17.24 9.84 18 12 18c4.97 0 9-4.03 9-9z"/>
        </svg>
        <h3>Aucune traduction pour le moment</h3>
        <p>Commencez à écouter pour voir les traductions apparaître ici</p>
      </div>
    </div>
  `,
  styles: [`
    .translation-display {
      background: var(--white);
      border-radius: var(--border-radius);
      box-shadow: var(--shadow-lg);
      overflow: hidden;
      min-height: 400px;
    }

    .current-translation {
      background: linear-gradient(135deg, var(--primary), var(--accent));
      color: var(--white);
      padding: 1.5rem;
      margin-bottom: 0;
    }

    .translation-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .translation-header h3 {
      margin: 0;
      font-size: 1.125rem;
      font-weight: 600;
    }

    .live-indicator {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.75rem;
      font-weight: 600;
      background: rgba(255, 255, 255, 0.2);
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
    }

    .live-dot {
      width: 8px;
      height: 8px;
      background: #ef4444;
      border-radius: 50%;
      animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    .translation-text.current {
      font-size: 1.125rem;
      font-weight: 500;
      line-height: 1.6;
      background: rgba(255, 255, 255, 0.1);
      padding: 1rem;
      border-radius: var(--border-radius-sm);
      backdrop-filter: blur(5px);
    }

    .history-section {
      padding: 1.5rem;
    }

    .history-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 0 0 1.5rem 0;
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--gray-700);
    }

    .translations-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-height: 400px;
      overflow-y: auto;
      padding-right: 0.5rem;
    }

    .translations-list::-webkit-scrollbar {
      width: 6px;
    }

    .translations-list::-webkit-scrollbar-track {
      background: var(--gray-100);
      border-radius: 3px;
    }

    .translations-list::-webkit-scrollbar-thumb {
      background: var(--gray-300);
      border-radius: 3px;
    }

    .translations-list::-webkit-scrollbar-thumb:hover {
      background: var(--gray-400);
    }

    .translation-item {
      border: 1px solid var(--gray-200);
      border-radius: var(--border-radius-sm);
      padding: 1rem;
      background: var(--gray-50);
      transition: all 0.2s ease;
    }

    .translation-item:hover {
      border-color: var(--primary);
      background: var(--white);
      transform: translateX(4px);
    }

    .translation-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid var(--gray-200);
    }

    .timestamp {
      font-size: 0.75rem;
      color: var(--gray-500);
      font-weight: 500;
    }

    .language-indicators {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .lang-badge {
      font-size: 0.75rem;
      font-weight: 500;
      padding: 0.25rem 0.5rem;
      border-radius: 9999px;
    }

    .lang-badge.source {
      background: var(--gray-200);
      color: var(--gray-700);
    }

    .lang-badge.target {
      background: var(--primary);
      color: var(--white);
    }

    .language-indicators svg {
      color: var(--gray-400);
    }

    .translation-content {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .original-text,
    .translated-text {
      font-size: 0.875rem;
      line-height: 1.5;
    }

    .original-text {
      color: var(--gray-600);
    }

    .translated-text {
      color: var(--gray-800);
      font-weight: 500;
    }

    .label {
      font-weight: 600;
      margin-right: 0.5rem;
      color: var(--gray-500);
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem 1.5rem;
      text-align: center;
      color: var(--gray-400);
      min-height: 300px;
    }

    .empty-state svg {
      margin-bottom: 1rem;
      opacity: 0.5;
    }

    .empty-state h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--gray-500);
    }

    .empty-state p {
      margin: 0;
      font-size: 0.875rem;
      color: var(--gray-400);
      max-width: 300px;
    }

    @media (max-width: 768px) {
      .translation-meta {
        flex-direction: column;
        gap: 0.5rem;
        align-items: flex-start;
      }

      .language-indicators {
        align-self: flex-end;
      }

      .translation-content {
        gap: 0.5rem;
      }

      .original-text,
      .translated-text {
        font-size: 0.8125rem;
      }

      .translation-text.current {
        font-size: 1rem;
      }
    }
  `]
})
export class TranslationDisplayComponent {
  @Input() translations: Translation[] = [];
  @Input() currentTranslation: string = '';

  trackByTranslation(index: number, translation: Translation): string {
    return translation.id;
  }

  getLanguageName(code: string): string {
    const langMap: { [key: string]: string } = {
      'fr': 'FR',
      'en': 'EN',
      'es': 'ES',
      'de': 'DE',
      'it': 'IT',
      'pt': 'PT',
      'nl': 'NL',
      'ru': 'RU',
      'zh': 'ZH',
      'ja': 'JA',
      'ko': 'KO',
      'ar': 'AR'
    };
    return langMap[code] || code.toUpperCase();
  }
}