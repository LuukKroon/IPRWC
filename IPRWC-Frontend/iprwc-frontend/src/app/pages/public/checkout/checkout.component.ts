import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartService, AddressDetails } from '../../../services/cart.service';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './checkout.component.html'
})
export class CheckoutComponent implements OnInit {
  address: AddressDetails = {
    straat: '',
    huisnummer: '',
    postcode: '',
    stad: ''
  };
  totalPrice: number = 0;

  constructor(
    private cartService: CartService, 
    private router: Router,
    private snackbar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.totalPrice = this.cartService.getTotalPrice();
    if (this.totalPrice === 0) {
      this.router.navigate(['/cart']);
    }
  }

  placeOrder(): void {
    if (!this.address.straat || !this.address.huisnummer || !this.address.postcode || !this.address.stad) {
      this.snackbar.showError('Vul alstublieft alle verplichte bezorggegevens in.');
      return;
    }

    this.cartService.checkout(this.address).subscribe({
      next: () => {
        this.snackbar.showSuccess(`Bestelling geplaatst! Deze wordt verzonden naar ${this.address.straat}.`);
        this.cartService.clearCart();
        this.router.navigate(['/']); 
      },
      error: (err) => {
        this.snackbar.showError(err.message || 'Er is een fout opgetreden bij het afrekenen.');
      }
    });
  }
}