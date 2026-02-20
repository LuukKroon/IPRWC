import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterUser {
  username: string;
  password: string;
}

export interface AuthResponse {
  username: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  private loggedInSubject = new BehaviorSubject<boolean>(this.hasValidSession());
  public isLoggedIn$ = this.loggedInSubject.asObservable();

  constructor(private http: HttpClient) { }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials, { withCredentials: true }).pipe(
      tap((response: AuthResponse) => {
        if (response && response.username) {
          localStorage.setItem('role', response.role);
          localStorage.setItem('username', response.username);
          this.loggedInSubject.next(true);
        }
      }),
      catchError(this.handleError)
    );
  }

  logout(): void {
    this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).subscribe({
      next: () => this.clearLocalSession(),
      error: () => this.clearLocalSession()
    });
  }

  public clearLocalSession(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('role');
      localStorage.removeItem('username');
    }
    this.loggedInSubject.next(false);
  }

  isLoggedIn(): boolean {
    return this.hasValidSession();
  }

  register(user: RegisterUser): Observable<string> {
    return this.http.post(`${this.apiUrl}/register`, user, { responseType: 'text' }).pipe(
      catchError(this.handleError)
    );
  }

  private hasValidSession(): boolean {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('username');
    }
    return false;
  }

  getUsername(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('username');
    }
    return null;
  }

  getRole(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('role');
    }
    return null;
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Er is een onbekende fout opgetreden!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Netwerkfout: ${error.error.message}`;
    } else {
      if (error.status === 401) {
        errorMessage = 'Ongeldige gebruikersnaam of wachtwoord.';
      } else if (error.status === 400) {
        errorMessage = error.error;
      }
    }
    return throwError(() => new Error(errorMessage));
  }
}