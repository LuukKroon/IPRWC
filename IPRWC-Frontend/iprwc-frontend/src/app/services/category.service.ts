import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Category {
  id?: number;
  naam: string;
  beschrijving: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  addCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category).pipe(
      catchError(this.handleError)
    );
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let message = 'Er is een fout opgetreden bij het beheren van de categorieën.';
    if (error.status === 403) message = 'Je hebt geen toestemming om categorieën te wijzigen.';
    return throwError(() => new Error(message));
  }
}