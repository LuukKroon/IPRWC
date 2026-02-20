import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from './services/auth.service';
import { SnackbarComponent } from './components/snackbar/snackbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, SnackbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  isLoggedIn = false;
  isAdmin = false;
  username: string | null = '';
  isDropdownOpen = false;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
      if (status) {
        this.username = this.authService.getUsername(); 
        this.isAdmin = this.authService.getRole() === 'ROLE_ADMIN';
      } else {
        this.username = '';
        this.isAdmin = false;
        this.isDropdownOpen = false;
      }
    });
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.relative')) {
      this.closeDropdown();
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}