import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Product, ProductService } from '../../../core/services/api.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit {
  readonly #svc = inject(ProductService);
  readonly router = inject(Router);

  products  = signal<Product[]>([]);
  loading   = signal(true);
  toast     = signal<{ msg: string; ok: boolean } | null>(null);
  delTarget = signal<Product | null>(null);
  search = ''; filterCat = '';

  filtered = computed(() => this.products().filter(p =>
    (!this.search.trim() || p.name.toLowerCase().includes(this.search.toLowerCase())) &&
    (!this.filterCat || p.category === this.filterCat)
  ));

  categories = computed(() => [...new Set(this.products().map(p => p.category))].sort());

  get total()   { return this.products().length; }
  get outOfStock() { return this.products().filter(p => p.quantity === 0).length; }
  get lowStock()   { return this.products().filter(p => p.quantity > 0 && p.quantity <= 5).length; }
  get totalValue() {
    const v = this.products().reduce((s, p) => s + p.salePrice * p.quantity, 0);
    return v >= 1000 ? (v / 1000).toFixed(1) + ' k DH' : v.toFixed(0) + ' DH';
  }

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.#svc.getAll().subscribe({
      next:  d => { this.products.set(d); this.loading.set(false); },
      error: () => { this.showToast('Erreur de connexion à l\'API', false); this.loading.set(false); }
    });
  }

  confirmDelete() {
    const p = this.delTarget();
    if (!p) return;
    this.#svc.delete(p.id).subscribe({
      next:  () => { this.delTarget.set(null); this.showToast(`"${p.name}" supprimé`, true); this.load(); },
      error: () => this.showToast('Erreur lors de la suppression', false)
    });
  }

  qtyClass(q: number) { return q === 0 ? 'qty-0' : q <= 5 ? 'qty-low' : 'qty'; }
  qtyBadge(q: number) { return q === 0 ? 'badge badge-out' : q <= 5 ? 'badge badge-low' : 'badge badge-ok'; }

  showToast(msg: string, ok: boolean) {
    this.toast.set({ msg, ok });
    setTimeout(() => this.toast.set(null), 3500);
  }
}
