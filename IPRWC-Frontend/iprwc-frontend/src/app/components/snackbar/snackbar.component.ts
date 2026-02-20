import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SnackbarService } from '../../services/snackbar.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="show" 
         [ngClass]="type === 'success' ? 'bg-green-600' : 'bg-red-600'"
         class="fixed bottom-5 right-5 text-white px-6 py-3 rounded-lg shadow-xl z-50 transition-all duration-300 transform translate-y-0 opacity-100 flex items-center justify-between min-w-[300px]">
      <span class="font-semibold">{{ message }}</span>
      <button (click)="close()" class="ml-4 text-white hover:text-gray-200 font-bold">&times;</button>
    </div>
  `
})
export class SnackbarComponent implements OnInit, OnDestroy {
  show = false;
  message = '';
  type: 'success' | 'error' = 'success';
  private subscription!: Subscription;

  constructor(private snackbarService: SnackbarService) {}

  ngOnInit() {
    this.subscription = this.snackbarService.snackbarState$.subscribe(state => {
      if (state.show) {
        this.message = state.message;
        this.type = state.type;
        this.show = true;
        
        setTimeout(() => this.close(), 3000);
      } else {
        this.show = false;
      }
    });
  }

  close() {
    this.show = false;
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}