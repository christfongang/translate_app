import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Language } from './translation.service';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="form-group">
      <label [for]="id" class="form-label">{{ label }}</label>
      <select 
        [id]="id"
        class="form-select"
        [value]="selectedLanguage"
        (change)="onLanguageChange($event)"
      >
        <option value="" disabled>Sélectionner une langue</option>
        <option 
          *ngFor="let language of languages" 
          [value]="language.code"
        >
          {{ language.flag }} {{ language.name }}
        </option>
      </select>
    </div>
  `,
  styles: []
})
export class LanguageSelectorComponent {
  @Input() languages: Language[] = [];
  @Input() selectedLanguage: string = '';
  @Input() label: string = '';
  @Input() id: string = '';
  
  @Output() languageChange = new EventEmitter<string>();

  onLanguageChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.languageChange.emit(target.value);
  }
}