import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Sale, SaleService } from '../../../core/services/api.service';

@Component({
  selector: 'app-sale-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sale-detail.component.html'
})
export class SaleDetailComponent implements OnInit {
  readonly #svc   = inject(SaleService);
  readonly router = inject(Router);
  readonly #route = inject(ActivatedRoute);

  sale    = signal<Sale | null>(null);
  loading = signal(true);
  toast   = signal<{ msg: string; ok: boolean } | null>(null);
  showConfirm = signal(false);

  ngOnInit() {
    const id = this.#route.snapshot.paramMap.get('id');
    if (id) {
      this.#svc.getById(+id).subscribe({
        next:  d => { this.sale.set(d); this.loading.set(false); },
        error: () => { this.loading.set(false); this.router.navigate(['/sales']); }
      });
    }
  }

  deleteSale() {
    const s = this.sale();
    if (!s) return;
    this.#svc.delete(s.id).subscribe({
      next:  () => { this.showToast('Vente supprimée — stock remis à jour', true); setTimeout(() => this.router.navigate(['/sales']), 1000); },
      error: () => this.showToast('Erreur lors de la suppression', false)
    });
  }

  paymentClass(m: string) {
    const map: Record<string, string> = { 'Cash': 'badge-cash', 'Carte': 'badge-carte', 'Virement': 'badge-virement', 'Chèque': 'badge-cheque' };
    return 'badge ' + (map[m] ?? 'badge-cash');
  }

  showToast(msg: string, ok: boolean) { this.toast.set({ msg, ok }); setTimeout(() => this.toast.set(null), 3500); }
}
