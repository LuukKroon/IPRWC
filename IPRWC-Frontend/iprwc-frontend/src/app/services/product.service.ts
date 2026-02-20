import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ProductCategory {
  id: number;
  naam: string;
  beschrijving: string;
}

export interface ProductOffer {
  id: number;
  kortingsPercentage: number;
  startDatum: string;
  eindDatum: string;
}

export interface Product {
  id: number;
  naam: string;
  beschrijving: string;
  prijs: number;
  offers?: ProductOffer[];
  category?: ProductCategory;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }
  
  addProduct(formData: FormData): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, formData).pipe(
      catchError(this.handleError)
    );
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  getProductImageUrl(id: number): string {
    return `${this.apiUrl}/${id}/image`;
  }

  private handleError(error: HttpErrorResponse) {
    let message = 'Er is een fout opgetreden bij het verwerken van de producten.';
    
    if (error.status === 403) {
      message = 'Je hebt geen toestemming om deze productactie uit te voeren.';
    } else if (error.status === 404) {
      message = 'Het opgevraagde product kon niet worden gevonden.';
    } else if (error.status === 400) {
      message = 'De ingevoerde productgegevens zijn ongeldig.';
    }
    
    return throwError(() => new Error(message));
  }
}