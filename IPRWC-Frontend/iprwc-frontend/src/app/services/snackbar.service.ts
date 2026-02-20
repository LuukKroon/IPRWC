import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface SnackbarState {
  show: boolean;
  message: string;
  type: 'success' | 'error';
}

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  private snackbarSubject = new BehaviorSubject<SnackbarState>({ 
    show: false, 
    message: '', 
    type: 'success' 
  });
  
  public snackbarState$ = this.snackbarSubject.asObservable();

  showSuccess(message: string): void {
    this.show(message, 'success');
  }

  showError(message: string): void {
    this.show(message, 'error');
  }


  private show(message: string, type: 'success' | 'error'): void {
    const sanitizedMessage = message.length > 200 
      ? message.substring(0, 197) + '...' 
      : message;

    this.snackbarSubject.next({ 
      show: true, 
      message: sanitizedMessage, 
      type 
    });
  }

  clear(): void {
    this.snackbarSubject.next({ 
      show: false, 
      message: '', 
      type: 'success' 
    });
  }
}