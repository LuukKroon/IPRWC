import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router'; 
import { CartService, CartItem } from '../../../services/cart.service';
import { AuthService } from '../../../services/auth.service'; 
import { Product } from '../../../services/product.service'; 
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html'
})
export class CartComponent implements OnInit {
  items: CartItem[] = [];
  totalPrice: number = 0;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
    private snackbar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.updateCart();
  }

  updateCart(): void {
    this.items = this.cartService.getItems();
    this.totalPrice = this.cartService.getTotalPrice();
  }

  getItemPrice(product: Product): number {
    return this.cartService.getCurrentPrice(product);
  }

  increase(item: CartItem): void {
    this.cartService.updateQuantity(item.product.id, item.quantity + 1);
    this.updateCart();
  }

  decrease(item: CartItem): void {
    this.cartService.updateQuantity(item.product.id, item.quantity - 1);
    this.updateCart();
  }

  remove(item: CartItem): void {
    this.cartService.removeItem(item.product.id);
    this.updateCart();
    this.snackbar.showSuccess(`${item.product.naam} is verwijderd.`);
  }

  goToCheckout(): void {
    if (!this.authService.isLoggedIn()) {
      this.snackbar.showError('Je moet ingelogd zijn om te kunnen afrekenen.');
      this.router.navigate(['/login']);
      return;
    }
    this.router.navigate(['/checkout']); 
  }
}