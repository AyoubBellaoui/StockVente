import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SaleList, SaleService } from '../../../core/services/api.service';

@Component({
  selector: 'app-sale-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sale-list.component.html'
})
export class SaleListComponent implements OnInit {
  readonly #svc  = inject(SaleService);
  readonly router = inject(Router);

  sales     = signal<SaleList[]>([]);
  loading   = signal(true);
  toast     = signal<{ msg: string; ok: boolean } | null>(null);
  delTarget = signal<SaleList | null>(null);

  filterDate = '';

  filtered = computed(() => {
    const d = this.filterDate;
    return this.sales().filter(s => !d || s.saleDate.startsWith(d));
  });

  get total()   { return this.sales().length; }
  get revenue() {
    const v = this.sales().reduce((s, x) => s + x.total, 0);
    return v >= 1000 ? (v / 1000).toFixed(1) + ' k DH' : v.toFixed(0) + ' DH';
  }

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.#svc.getAll().subscribe({
      next:  d => { this.sales.set(d); this.loading.set(false); },
      error: () => { this.showToast('Erreur de chargement', false); this.loading.set(false); }
    });
  }

  confirmDelete() {
    const s = this.delTarget();
    if (!s) return;
    this.#svc.delete(s.id).subscribe({
      next:  () => { this.delTarget.set(null); this.showToast('Vente supprimée — stock remis à jour', true); this.load(); },
      error: () => this.showToast('Erreur lors de la suppression', false)
    });
  }

  paymentClass(m: string) {
    const map: Record<string, string> = { 'Cash': 'badge-cash', 'Carte': 'badge-carte', 'Virement': 'badge-virement', 'Chèque': 'badge-cheque' };
    return 'badge ' + (map[m] ?? 'badge-cash');
  }

  showToast(msg: string, ok: boolean) { this.toast.set({ msg, ok }); setTimeout(() => this.toast.set(null), 3500); }
}
