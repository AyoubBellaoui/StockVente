import { Routes } from '@angular/router';

export const CLIENTS_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./list/client-list.component').then(m => m.ClientListComponent) },
  { path: 'create', loadComponent: () => import('./form/client-form.component').then(m => m.ClientFormComponent) },
  { path: 'edit/:id', loadComponent: () => import('./form/client-form.component').then(m => m.ClientFormComponent) }
];
