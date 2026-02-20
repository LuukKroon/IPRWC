import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Product, ProductService } from '../../../services/product.service';
import { CartService } from '../../../services/cart.service';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-detail.component.html'
})
export class ProductDetailComponent implements OnInit {
  product: Product | undefined;
  quantity: number = 1;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private snackbar: SnackbarService 
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.productService.getProductById(id).subscribe({
        next: (data) => {
          this.product = data;
        },
        error: (err) => {
          this.snackbar.showError(err.message || 'Product kon niet worden geladen.');
        }
      });
    }
  }

  getProductImageUrl(id: number): string {
    return this.productService.getProductImageUrl(id);
  }

  getCurrentPrice(): number {
    return this.product ? this.cartService.getCurrentPrice(this.product) : 0;
  }

  increaseQuantity(): void { 
    this.quantity++; 
  }
  
  decreaseQuantity(): void { 
    if (this.quantity > 1) this.quantity--; 
  }

  addToCart(): void {
    if (this.product) {
      this.cartService.addToCart(this.product, this.quantity);
      this.snackbar.showSuccess(`${this.quantity}x ${this.product.naam} is toegevoegd aan je winkelmandje!`);
    }
  }
}