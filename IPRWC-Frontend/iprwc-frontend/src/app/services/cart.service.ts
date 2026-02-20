import { Injectable } from '@angular/core';
import { Product } from './product.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Offer {
  id?: number;
  kortingsPercentage: number;
  startDatum: string;
  eindDatum: string;
}

export interface AddressDetails {
  straat: string;
  huisnummer: string;
  postcode: string;
  stad: string;
}

export interface OrderItemRequest {
  productId: number;
  quantity: number;
}

export interface OrderRequest {
  straat: string;
  huisnummer: string;
  postcode: string;
  stad: string;
  items: OrderItemRequest[];
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items: CartItem[] = [];
  private apiUrl = `${environment.apiUrl}/orders`;
  private readonly CART_KEY = 'luuk_kroon_cart';

  constructor(private http: HttpClient) {
    this.loadCart();
  }


  private saveCart(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.CART_KEY, JSON.stringify(this.items));
    }
  }

  private loadCart(): void {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem(this.CART_KEY);
      if (savedCart) {
        try {
          this.items = JSON.parse(savedCart);
        } catch (e) {
          this.items = [];
        }
      }
    }
  }


  addToCart(product: Product, quantity: number = 1): void {
    const existingItem = this.items.find(item => item.product.id === product.id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({ product, quantity });
    }
    this.saveCart();
  }

  getItems(): CartItem[] {
    return this.items;
  }

  getCurrentPrice(product: Product): number {
    if (!product.offers || product.offers.length === 0) return product.prijs;
    
    const now = new Date();
    const activeOffer = product.offers.find((offer: Offer) => {
      const start = new Date(offer.startDatum);
      const eind = new Date(offer.eindDatum);
      return now >= start && now <= eind;
    });

    if (activeOffer) {
      const discount = (product.prijs * activeOffer.kortingsPercentage) / 100;
      return product.prijs - discount;
    }
    return product.prijs;
  }

  getTotalPrice(): number {
    return this.items.reduce((total, item) => total + (this.getCurrentPrice(item.product) * item.quantity), 0);
  }

  updateQuantity(productId: number, newQuantity: number): void {
    if (newQuantity <= 0) {
      this.removeItem(productId);
    } else {
      const item = this.items.find(i => i.product.id === productId);
      if (item) {
        item.quantity = newQuantity;
        this.saveCart();
      }
    }
  }

  removeItem(productId: number): void {
    this.items = this.items.filter(i => i.product.id !== productId);
    this.saveCart();
  }

  clearCart(): void {
    this.items = [];
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.CART_KEY);
    }
  }


  checkout(addressDetails: AddressDetails): Observable<any> {
    const orderRequest: OrderRequest = {
      straat: addressDetails.straat,
      huisnummer: addressDetails.huisnummer,
      postcode: addressDetails.postcode,
      stad: addressDetails.stad,
      items: this.items.map(item => ({
        productId: item.product.id,
        quantity: item.quantity
      }))
    };
    
    return this.http.post(this.apiUrl, orderRequest, { withCredentials: true }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Er is een onbekende fout opgetreden bij het afrekenen.';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Netwerkfout: ${error.error.message}`;
    } else {
      if (error.status === 401 || error.status === 403) {
        errorMessage = 'Je bent niet (meer) ingelogd. Log opnieuw in om af te rekenen.';
      } else if (error.status === 400) {
        errorMessage = 'De ingevulde adresgegevens of bestelling zijn ongeldig.';
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }
}