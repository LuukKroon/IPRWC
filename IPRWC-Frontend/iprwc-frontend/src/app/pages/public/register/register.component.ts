import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, RegisterUser } from '../../../services/auth.service';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  user: RegisterUser = {
    username: '',
    password: ''
  };

  constructor(
    private authService: AuthService, 
    private router: Router,
    private snackbar: SnackbarService
  ) {}

  onSubmit(): void {
    this.authService.register(this.user).subscribe({
      next: () => {
        this.snackbar.showSuccess('Registratie succesvol! Je kunt nu inloggen.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.snackbar.showError(err.message || 'Registratie mislukt. Kies mogelijk een andere naam.');
      }
    });
  }
}