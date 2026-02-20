import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { Router, RouterModule } from '@angular/router';
import { AuthService, LoginCredentials } from '../../../services/auth.service';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  credentials: LoginCredentials = {
    username: '',
    password: ''
  };

  constructor(
    private authService: AuthService, 
    private router: Router,
    private snackbar: SnackbarService
  ) {}

  onSubmit(): void {
    if (!this.credentials.username || !this.credentials.password) {
      this.snackbar.showError('Vul alstublieft alle velden in.');
      return;
    }

    this.authService.login(this.credentials).subscribe({
      next: (res) => {
        this.snackbar.showSuccess(`Welkom terug, ${res.username}!`);
        
        if (res.role === 'ROLE_ADMIN' || res.role === 'ADMIN') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/']); 
        }
      },
      error: (err) => {
        this.snackbar.showError(err.message || 'Inloggen mislukt.');
      }
    });
  }
}