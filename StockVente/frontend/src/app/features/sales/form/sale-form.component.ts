import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Product, ProductService, ClientService, Client, SaleService } from '../../../core/services/api.service';

interface SaleLine {
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  subTotal: number;
  maxQty: number;
}

@Component({
  selector: 'app-sale-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sale-form.component.html'
})
export class SaleFormComponent implements OnInit {
  readonly #svc        = inject(SaleService);
  readonly #productSvc = inject(ProductService);
  readonly #clientSvc  = inject(ClientService);
  readonly router      = inject(Router);

  products = signal<Product[]>([]);
  clients  = signal<Client[]>([]);
  saving   = signal(false);
  toast    = signal<{ msg: string; ok: boolean } | null>(null);

  // Header fields
  clientId      = '';
  saleDate      = new Date().toISOString().split('T')[0];
  paymentMethod = 'Cash';

  readonly paymentMethods = ['Cash', 'Carte', 'Virement', 'Chèque'];

  // Lines
  lines: SaleLine[] = [];

  // New line inputs
  newProductId = '';
  newQty       = 1;

  total = computed(() => this.lines.reduce((s, l) => s + l.subTotal, 0));

  get availableProducts(): Product[] {
    const usedIds = new Set(this.lines.map(l => l.productId));
    return this.products().filter(p => !usedIds.has(p.id) && p.quantity > 0);
  }

  get selectedProduct(): Product | undefined {
    return this.products().find(p => p.id === +this.newProductId);
  }

  ngOnInit() {
    this.#productSvc.getAll().subscribe(d => this.products.set(d));
    this.#clientSvc.getAll().subscribe(d => this.clients.set(d));
  }

  addLine() {
    const product = this.selectedProduct;
    if (!product) return;
    if (this.newQty <= 0 || this.newQty > product.quantity) return;

    this.lines = [...this.lines, {
      productId:   product.id,
      productName: product.name,
      unitPrice:   product.salePrice,
      quantity:    this.newQty,
      subTotal:    product.salePrice * this.newQty,
      maxQty:      product.quantity
    }];

    this.newProductId = '';
    this.newQty = 1;
  }

  updateQty(idx: number, qty: number) {
    const line = this.lines[idx];
    if (!line) return;
    const clamped = Math.max(1, Math.min(qty, line.maxQty));
    this.lines = this.lines.map((l, i) =>
      i === idx ? { ...l, quantity: clamped, subTotal: l.unitPrice * clamped } : l
    );
  }

  removeLine(idx: number) {
    this.lines = this.lines.filter((_, i) => i !== idx);
  }

  canSubmit(): boolean {
    return this.lines.length > 0 && !!this.saleDate && !!this.paymentMethod;
  }

  // Getter used in template — avoids complex expression error in strict mode
  get selectedClientName(): string {
    if (!this.clientId) return 'Anonyme';
    const id = +this.clientId;
    return this.clients().find(c => c.id === id)?.name ?? 'Anonyme';
  }

  submit() {
    if (!this.canSubmit()) { this.showToast('Ajoutez au moins un produit', false); return; }

    this.saving.set(true);
    this.#svc.create({
      clientId:      this.clientId ? +this.clientId : null,
      saleDate:      this.saleDate,
      paymentMethod: this.paymentMethod,
      items:         this.lines.map(l => ({ productId: l.productId, quantity: l.quantity }))
    }).subscribe({
      next: () => {
        this.showToast('Vente enregistrée ! Stock mis à jour.', true);
        setTimeout(() => this.router.navigate(['/sales']), 1000);
      },
      error: (err) => {
        const msg = err?.error?.title || err?.error || 'Erreur lors de la création';
        this.showToast(String(msg), false);
        this.saving.set(false);
      }
    });
  }

  showToast(msg: string, ok: boolean) { this.toast.set({ msg, ok }); setTimeout(() => this.toast.set(null), 4000); }
}
