import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  getItem<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      return JSON.parse(item) as T;
    } catch (e) {
      console.warn(`Error reading localStorage key "${key}":`, e);
      return defaultValue;
    }
  }

  setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error saving to localStorage key "${key}":`, e);
    }
  }

  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error(`Error removing localStorage key "${key}":`, e);
    }
  }

  clear(): void {
    try {
      localStorage.clear();
    } catch (e) {
      console.error('Error clearing localStorage:', e);
    }
  }

  exportAllData(): string {
    const backup: Record<string, any> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('costbuild_')) {
        try {
          backup[key] = JSON.parse(localStorage.getItem(key) || 'null');
        } catch {
          backup[key] = localStorage.getItem(key);
        }
      }
    }
    return JSON.stringify(backup, null, 2);
  }
}

