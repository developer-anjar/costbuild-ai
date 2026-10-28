import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly _toasts = signal<ToastMessage[]>([]);
  readonly toasts = this._toasts.asReadonly();

  show(type: 'success' | 'error' | 'warning' | 'info', message: string, title?: string, duration: number = 4000): void {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastMessage = { id, type, title, message, duration };

    this._toasts.update(current => [...current, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, duration);
    }
  }

  success(message: string, title: string = 'Success'): void {
    this.show('success', message, title);
  }

  error(message: string, title: string = 'Error'): void {
    this.show('error', message, title);
  }

  warning(message: string, title: string = 'Notice'): void {
    this.show('warning', message, title);
  }

  info(message: string, title: string = 'Information'): void {
    this.show('info', message, title);
  }

  dismiss(id: string): void {
    this._toasts.update(current => current.filter(t => t.id !== id));
  }
}

