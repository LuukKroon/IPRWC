import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, Product } from '../../../services/product.service';
import { CategoryService, Category } from '../../../services/category.service';
import { OfferService, Offer } from '../../../services/offer.service';
import { OrderService, Order } from '../../../services/order.service';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-home.component.html'
})
export class AdminHomeComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  offers: Offer[] = [];
  orders: Order[] = []; 

  newCategory = { naam: '', beschrijving: '' };
  newProduct = { naam: '', beschrijving: '', prijs: 0, categoryId: null as number | null };
  selectedFile: File | null = null;
  newOffer = { kortingsPercentage: 10, startDatum: '', eindDatum: '', productId: null };

  isLoading = false;
  isLoadingOrders = true; 

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private offerService: OfferService,
    private orderService: OrderService,
    private snackbar: SnackbarService
  ) {}

  ngOnInit(): void {  
    this.loadAllData();
  }

  loadAllData() {
    this.productService.getProducts().subscribe({
      next: (data) => this.products = data,
      error: () => this.snackbar.showError('Kon producten niet laden.')
    });

    this.categoryService.getCategories().subscribe({
      next: (data) => this.categories = data,
      error: () => this.snackbar.showError('Kon categorieën niet laden.')
    });

    this.offerService.getOffers().subscribe({
      next: (data) => this.offers = data,
      error: () => this.snackbar.showError('Kon aanbiedingen niet laden.')
    });

    this.isLoadingOrders = true;
    this.orderService.getAllOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.isLoadingOrders = false;
      },
      error: () => {
        this.snackbar.showError('Kon bestellingen niet ophalen.');
        this.isLoadingOrders = false;
      }
    });
  }

  addCategory() {
    if (!this.newCategory.naam.trim()) {
      this.snackbar.showError('Categorienaam is verplicht.');
      return;
    }

    this.categoryService.addCategory(this.newCategory).subscribe({
      next: () => {
        this.newCategory = { naam: '', beschrijving: '' }; 
        this.loadAllData(); 
        this.snackbar.showSuccess('Categorie succesvol toegevoegd!');
      },
      error: (err) => this.snackbar.showError(err.message)
    });
  }

  deleteCategory(id: number) {
    if (confirm('Weet je zeker dat je deze categorie wilt verwijderen?')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => {
          this.loadAllData();
          this.snackbar.showSuccess('Categorie verwijderd!');
        },
        error: (err) => this.snackbar.showError(err.message)
      });
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  addProduct() {
    if (!this.selectedFile) {
      this.snackbar.showError('Kies eerst een foto!');
      return;
    }
    this.isLoading = true;

    const formData = new FormData();
    formData.append('naam', this.newProduct.naam);
    formData.append('beschrijving', this.newProduct.beschrijving);
    formData.append('prijs', this.newProduct.prijs.toString());
    formData.append('image', this.selectedFile);
    if (this.newProduct.categoryId) {
      formData.append('categoryId', this.newProduct.categoryId.toString());
    }

    this.productService.addProduct(formData).subscribe({
      next: () => {
        this.snackbar.showSuccess('Product succesvol toegevoegd!');
        this.isLoading = false;
        this.selectedFile = null;
        this.newProduct = { naam: '', beschrijving: '', prijs: 0, categoryId: null };
        this.loadAllData();
      },
      error: (err) => {
        this.isLoading = false;
        this.snackbar.showError(err.message);
      }
    });
  }

  deleteProduct(id: number) {
    if (confirm('Product verwijderen?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.loadAllData();
          this.snackbar.showSuccess('Product verwijderd!');
        },
        error: (err) => this.snackbar.showError(err.message)
      });
    }
  }

  addOffer() {
    if (!this.newOffer.productId) {
      this.snackbar.showError('Kies een product om korting op te geven!');
      return;
    }
    
    this.offerService.addOffer(this.newOffer.productId, this.newOffer).subscribe({
      next: () => {
        this.newOffer = { kortingsPercentage: 10, startDatum: '', eindDatum: '', productId: null };
        this.loadAllData();
        this.snackbar.showSuccess('Aanbieding opgeslagen!');
      },
      error: (err) => this.snackbar.showError(err.message)
    });
  }

  deleteOffer(id: number) {
    if (confirm('Aanbieding verwijderen?')) {
      this.offerService.deleteOffer(id).subscribe({
        next: () => {
          this.loadAllData();
          this.snackbar.showSuccess('Aanbieding verwijderd!');
        },
        error: (err) => this.snackbar.showError(err.message)
      });
    }
  }
}