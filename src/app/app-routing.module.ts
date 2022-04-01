import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginGuardGuard } from './services/guards/login-guard.guard';
import { ViewProductComponent } from './components/view-product/view-product.component';
import { CreateProductComponent } from './components/create-product/create-product.component';
import { EditProductComponent } from './components/edit-product/edit-product.component';
import { NoPageFoundComponent } from './shared/no-page-found/no-page-found.component';





const RUTAS: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [LoginGuardGuard] },
  { path: 'product-view/:productId', component: ViewProductComponent, canActivate: [LoginGuardGuard] },
  { path: 'product-edit/:productId', component: EditProductComponent, canActivate: [LoginGuardGuard] },
  { path: 'create', component: CreateProductComponent, canActivate: [LoginGuardGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', component: NoPageFoundComponent }
];

export const APP_ROUTES = RouterModule.forRoot(RUTAS, { useHash: true });