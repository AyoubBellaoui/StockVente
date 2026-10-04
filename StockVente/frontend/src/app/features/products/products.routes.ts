import { Routes } from '@angular/router';

export const PRODUCTS_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./list/product-list.component').then(m => m.ProductListComponent) },
  { path: 'create', loadComponent: () => import('./form/product-form.component').then(m => m.ProductFormComponent) },
  { path: 'edit/:id', loadComponent: () => import('./form/product-form.component').then(m => m.ProductFormComponent) }
];
