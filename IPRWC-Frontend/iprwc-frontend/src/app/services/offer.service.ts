import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product } from './product.service';

export interface Offer {
  id?: number;
  kortingsPercentage: number;
  startDatum: string;
  eindDatum: string;
  product?: Product;
}

@Injectable({
  providedIn: 'root'
})
export class OfferService {
  private apiUrl = `${environment.apiUrl}/offers`;

  constructor(private http: HttpClient) {}

  getOffers(): Observable<Offer[]> {
    return this.http.get<Offer[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  addOffer(productId: number, offer: Offer): Observable<Offer> {
    return this.http.post<Offer>(`${this.apiUrl}/product/${productId}`, offer).pipe(
      catchError(this.handleError)
    );
  }

  deleteOffer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let message = 'Er is een fout opgetreden bij de aanbiedingen.';
    if (error.status === 403) message = 'Alleen beheerders kunnen aanbiedingen aanpassen.';
    return throwError(() => new Error(message));
  }
}