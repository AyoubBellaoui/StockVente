import { Routes } from '@angular/router';

export const SALES_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./list/sale-list.component').then(m => m.SaleListComponent) },
  { path: 'create', loadComponent: () => import('./form/sale-form.component').then(m => m.SaleFormComponent) },
  { path: ':id', loadComponent: () => import('./detail/sale-detail.component').then(m => m.SaleDetailComponent) }
];
