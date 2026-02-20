import { Routes } from '@angular/router';
import { ShopComponent } from './pages/public/shop/shop.component';
import { ProductDetailComponent } from './pages/public/product-detail/product-detail.component';
import { CartComponent } from './pages/public/cart/cart.component';
import { LoginComponent } from './pages/public/login/login.component';
import { RegisterComponent } from './pages/public/register/register.component';
import { CheckoutComponent } from './pages/public/checkout/checkout.component';
import { MyOrdersComponent } from './pages/public/my-orders/my-orders.component';
import { adminGuard } from './guards/admin.guard';
import { shopGuard } from './guards/shop.guard';
import { AdminHomeComponent } from './pages/admin/admin-home/admin-home.component';

export const routes: Routes = [
  { path: '', component: ShopComponent, canActivate: [shopGuard] },
  { path: 'product/:id', component: ProductDetailComponent, canActivate: [shopGuard] },
  { path: 'cart', component: CartComponent, canActivate: [shopGuard] },
  { path: 'checkout', component: CheckoutComponent, canActivate: [shopGuard] },
  { path: 'my-orders', component: MyOrdersComponent, canActivate: [shopGuard] },
  
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  
  { path: 'admin/dashboard', component: AdminHomeComponent, canActivate: [adminGuard] },
  { path: '**', redirectTo: '' }
];