import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService, Order } from '../../../services/order.service'; 
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-orders.component.html'
})
export class MyOrdersComponent implements OnInit {
  orders: Order[] = [];
  isLoading = true;

  constructor(
    private orderService: OrderService,
    private snackbar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.loadMyOrders();
  }

  loadMyOrders(): void {
    this.isLoading = true;
    this.orderService.getMyOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.snackbar.showError(err.message || 'Kon je bestellingen niet ophalen.');
        this.isLoading = false;
      }
    });
  }
}