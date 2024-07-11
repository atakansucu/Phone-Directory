// translation.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLanguage: string = 'en'; // Default language
  private translations: any = {}; // Holds translations for each language

  constructor(private http: HttpClient) {}

  setLanguage(language: string): void {
    this.currentLanguage = language;
  }

  loadTranslations(): Observable<any> {
    return this.http.get(`assets/i18n/${this.currentLanguage}.json`);
  }

  getTranslation(key: string): string {
    return this.translations[key] || key;
  }

  init(): Promise<any> {
    return new Promise<void>((resolve) => {
      this.loadTranslations().subscribe((translations) => {
        this.translations = translations;
        resolve();
      });
    });
  }
}
