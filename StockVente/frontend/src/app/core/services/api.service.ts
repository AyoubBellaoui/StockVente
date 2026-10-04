import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// ── Interfaces ────────────────────────────────────────────────

export interface Product {
  id: number; name: string; description: string | null;
  category: string; purchasePrice: number; salePrice: number;
  quantity: number; imageUrl: string | null; createdAt: string;
}

export interface ProductPayload {
  name: string; description: string | null; category: string;
  purchasePrice: number; salePrice: number;
  quantity: number; imageUrl: string | null;
}

export interface Client {
  id: number; name: string; phone: string | null;
  email: string | null; address: string | null;
}

export interface SaleItem {
  id: number; productId: number; productName: string;
  quantity: number; unitPrice: number; subTotal: number;
}

export interface Sale {
  id: number; clientId: number | null; clientName: string | null;
  saleDate: string; paymentMethod: string; total: number; createdAt: string;
  items: SaleItem[];
}

export interface SaleList {
  id: number; clientId: number | null; clientName: string | null;
  saleDate: string; paymentMethod: string; total: number;
}

export interface CreateSaleItemRequest { productId: number; quantity: number; }

export interface CreateSalePayload {
  clientId: number | null; saleDate: string;
  paymentMethod: string;
  items: CreateSaleItemRequest[];
}

export interface Dashboard {
  totalProducts: number; totalSales: number;
  totalRevenue: number; outOfStockCount: number;
  outOfStockProducts: Product[];
}

// ── Services ──────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class ProductService {
  readonly #http = inject(HttpClient);
  readonly #url = '/api/products';
  getAll(): Observable<Product[]> { return this.#http.get<Product[]>(this.#url); }
  getById(id: number): Observable<Product> { return this.#http.get<Product>(`${this.#url}/${id}`); }
  create(p: ProductPayload): Observable<{ id: number }> { return this.#http.post<{ id: number }>(this.#url, p); }
  update(id: number, p: ProductPayload): Observable<void> { return this.#http.put<void>(`${this.#url}/${id}`, p); }
  delete(id: number): Observable<void> { return this.#http.delete<void>(`${this.#url}/${id}`); }
}

@Injectable({ providedIn: 'root' })
export class ClientService {
  readonly #http = inject(HttpClient);
  readonly #url = '/api/clients';
  getAll(): Observable<Client[]> { return this.#http.get<Client[]>(this.#url); }
  create(c: Omit<Client, 'id'>): Observable<{ id: number }> { return this.#http.post<{ id: number }>(this.#url, c); }
  update(id: number, c: Omit<Client, 'id'>): Observable<void> { return this.#http.put<void>(`${this.#url}/${id}`, c); }
  delete(id: number): Observable<void> { return this.#http.delete<void>(`${this.#url}/${id}`); }
}

@Injectable({ providedIn: 'root' })
export class SaleService {
  readonly #http = inject(HttpClient);
  readonly #url = '/api/sales';
  getAll(): Observable<SaleList[]> { return this.#http.get<SaleList[]>(this.#url); }
  getById(id: number): Observable<Sale> { return this.#http.get<Sale>(`${this.#url}/${id}`); }
  create(p: CreateSalePayload): Observable<{ id: number }> { return this.#http.post<{ id: number }>(this.#url, p); }
  delete(id: number): Observable<void> { return this.#http.delete<void>(`${this.#url}/${id}`); }
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  readonly #http = inject(HttpClient);
  get(): Observable<Dashboard> { return this.#http.get<Dashboard>('/api/dashboard'); }
}
