import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Product {
  id: number;
  naam: string;
  prijs: number;
  beschrijving: string;
  imageName?: string;
  imageType?: string;
}

export interface OrderItem {
  id: number;
  product: Product;
  quantity: number;
  priceAtOrder: number;
}

export interface Order {
  id: number;
  orderDate: string;
  totalPrice: number;
  straat: string;
  huisnummer: string;
  postcode: string;
  stad: string;
  user?: { username: string };
  items?: OrderItem[];
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) { }

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/all`).pipe(
      catchError(this.handleError)
    );
  }

  checkout(orderRequest: any): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, orderRequest).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let message = 'Er is een fout opgetreden bij het verwerken van de bestellingen.';
    if (error.status === 403) message = 'Je bent niet bevoegd om bestellingen in te zien.';
    return throwError(() => new Error(message));
  }

  getMyOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/my-orders`).pipe(
      catchError(this.handleError)
    );
  }
}