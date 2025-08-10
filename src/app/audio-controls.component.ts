import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-audio-controls',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="audio-controls">
      <div class="controls-row">
        <button
          *ngIf="!isRecording"
          class="btn btn-primary record-btn"
          (click)="onStartRecording()"
          [disabled]="!canRecord"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
            <path d="M19 10v1a7 7 0 0 1-14 0v-1a1 1 0 0 1 2 0v1a5 5 0 0 0 10 0v-1a1 1 0 1 1 2 0Z"/>
            <path d="M12 18.5a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1Z"/>
          </svg>
          Commencer l'écoute
        </button>

        <button
          *ngIf="isRecording"
          class="btn btn-danger record-btn animate-pulse"
          (click)="onStopRecording()"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="6" width="12" height="12" rx="2"/>
          </svg>
          Arrêter l'écoute
        </button>

        <button
          class="btn btn-secondary"
          (click)="onClearAll()"
          [disabled]="isRecording"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 6h18l-1.5 14H4.5L3 6zm5-4h8v2H8V2z"/>
          </svg>
          Effacer
        </button>
      </div>

      <div class="status-indicator" [ngClass]="statusClass">
        <div class="status-dot"></div>
        <span>{{ statusText }}</span>
      </div>
    </div>
  `,
  styles: [`
    .audio-controls {
      text-align: center;
      padding: 1.5rem;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: var(--border-radius);
      margin-bottom: 1.5rem;
    }

    .controls-row {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
      margin-bottom: 1rem;
    }

    .record-btn {
      min-width: 180px;
    }

    @media (max-width: 768px) {
      .controls-row {
        flex-direction: column;
        align-items: center;
      }
      
      .btn {
        width: 100%;
        max-width: 280px;
      }
    }

    .status-indicator {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: currentColor;
    }

    .status-recording {
      color: var(--error);
    }

    .status-recording .status-dot {
      animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    .status-idle {
      color: var(--gray-400);
    }

    .status-processing {
      color: var(--accent);
    }
  `]
})
export class AudioControlsComponent {
  @Input() isRecording: boolean = false;
  @Input() canRecord: boolean = false;
  @Input() currentStatus: 'idle' | 'recording' | 'processing' = 'idle';
  
  @Output() startRecording = new EventEmitter<void>();
  @Output() stopRecording = new EventEmitter<void>();
  @Output() clearAll = new EventEmitter<void>();

  get statusClass(): string {
    return `status-${this.currentStatus}`;
  }

  get statusText(): string {
    switch (this.currentStatus) {
      case 'recording':
        return 'Écoute en cours...';
      case 'processing':
        return 'Traduction en cours...';
      default:
        return this.canRecord ? 'Prêt à écouter' : 'Sélectionnez les langues';
    }
  }

  onStartRecording(): void {
    this.startRecording.emit();
  }

  onStopRecording(): void {
    this.stopRecording.emit();
  }

  onClearAll(): void {
    this.clearAll.emit();
  }
}