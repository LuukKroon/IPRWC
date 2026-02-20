import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductService, Product, ProductOffer } from '../../../services/product.service';
import { CategoryService, Category } from '../../../services/category.service';
import { CartService } from '../../../services/cart.service';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit, AfterViewInit {
  @ViewChild('categoryList') categoryList!: ElementRef;

  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  categories: Category[] = [];

  selectedCategoryId: number | 'all' = 'all';
  sortOption: string = 'default';

  // State voor de scroll-knoppen
  showLeftScroll = false;
  showRightScroll = true;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private cartService: CartService,
    private snackbar: SnackbarService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.checkScrollStatus(), 0);
  }

  loadData(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.allProducts = data;
        this.filteredProducts = [...this.allProducts];
        this.applyFiltersAndSort();
      },
      error: () => this.snackbar.showError('Kon producten niet laden.')
    });

    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        setTimeout(() => this.checkScrollStatus(), 0);
      },
      error: () => this.snackbar.showError('Kon categorieën niet laden.')
    });
  }

  selectCategory(categoryId: number | 'all'): void {
    this.selectedCategoryId = categoryId;
    this.applyFiltersAndSort();
  }

  getActiveOffer(product: Product): ProductOffer | null {
    if (!product.offers || product.offers.length === 0) return null;
    const now = new Date();
    return product.offers.find((offer: ProductOffer) => {
      const start = new Date(offer.startDatum);
      const eind = new Date(offer.eindDatum);
      return now >= start && now <= eind;
    }) || null;
  }

  getCurrentPrice(product: Product): number {
    return this.cartService.getCurrentPrice(product);
  }

  applyFiltersAndSort(): void {
    if (this.selectedCategoryId === 'all') {
      this.filteredProducts = [...this.allProducts];
    } else {
      const catId = Number(this.selectedCategoryId);
      this.filteredProducts = this.allProducts.filter(p =>
        p.category && p.category.id === catId
      );
    }

    if (this.sortOption === 'priceAsc') {
      this.filteredProducts.sort((a, b) => this.getCurrentPrice(a) - this.getCurrentPrice(b));
    } else if (this.sortOption === 'priceDesc') {
      this.filteredProducts.sort((a, b) => this.getCurrentPrice(b) - this.getCurrentPrice(a));
    }
  }

  getProductImageUrl(id: number): string {
    return this.productService.getProductImageUrl(id);
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
    this.snackbar.showSuccess(`${product.naam} is toegevoegd aan je winkelmandje!`);
  }

  scrollCategories(distance: number) {
    if (this.categoryList) {
      this.categoryList.nativeElement.scrollBy({ left: distance, behavior: 'smooth' });
    }
  }

  checkScrollStatus() {
    if (!this.categoryList) return;
    
    const element = this.categoryList.nativeElement;
    
    this.showLeftScroll = element.scrollLeft > 0;
    
    this.showRightScroll = Math.ceil(element.scrollLeft + element.clientWidth) < element.scrollWidth;
  }
}