import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Dashboard, DashboardService } from '../../core/services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (toast()) {
      <div class="toast toast-err"><span>❌</span><span>{{ toast() }}</span></div>
    }

    <div class="page-header">
      <div>
        <h1 class="page-title">Tableau de <em>Bord</em></h1>
        <p class="page-sub">Vue d'ensemble de votre activité</p>
      </div>
    </div>

    @if (loading()) {
      <div class="state-box"><div class="spinner"></div></div>
    } @else if (data()) {
      <div class="stats-row">
        <div class="stat-card s-blue">
          <div class="stat-lbl">Total Produits</div>
          <div class="stat-val">{{ data()!.totalProducts }}</div>
          <div class="stat-sub">dans le catalogue</div>
        </div>
        <div class="stat-card s-green">
          <div class="stat-lbl">Ventes réalisées</div>
          <div class="stat-val">{{ data()!.totalSales }}</div>
          <div class="stat-sub">commandes traitées</div>
        </div>
        <div class="stat-card s-amber">
          <div class="stat-lbl">Chiffre d'affaires</div>
          <div class="stat-val">{{ formatRevenue(data()!.totalRevenue) }}</div>
          <div class="stat-sub">total des ventes</div>
        </div>
        <div class="stat-card s-red">
          <div class="stat-lbl">Rupture de stock</div>
          <div class="stat-val">{{ data()!.outOfStockCount }}</div>
          <div class="stat-sub">produit(s) épuisé(s)</div>
        </div>
      </div>

      @if (data()!.outOfStockProducts.length > 0) {
        <div class="card" style="margin-top:8px">
          <div class="card-head">
            <div class="card-head-icon" style="background:var(--red-l)">⚠️</div>
            <div>
              <div class="card-head-title">Produits en rupture de stock</div>
              <div class="card-head-sub">Ces produits ont une quantité = 0</div>
            </div>
          </div>
          <div class="card-body" style="padding:0">
            <table>
              <thead>
                <tr><th>Produit</th><th>Catégorie</th><th>Prix de vente</th><th style="text-align:right">Action</th></tr>
              </thead>
              <tbody>
                @for (p of data()!.outOfStockProducts; track p.id) {
                  <tr>
                    <td><strong>{{ p.name }}</strong></td>
                    <td><span class="chip">{{ p.category }}</span></td>
                    <td class="price">{{ p.salePrice | number:'1.2-2' }} DH</td>
                    <td style="text-align:right">
                      <button class="btn btn-edit btn-sm" (click)="router.navigate(['/products/edit', p.id])">
                        Réapprovisionner
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:16px">
        <div class="card" style="cursor:pointer" (click)="router.navigate(['/products'])">
          <div class="card-body" style="display:flex;align-items:center;gap:14px;padding:20px">
            <div style="font-size:28px">📦</div>
            <div>
              <div style="font-weight:700;font-size:14px">Gérer les produits</div>
              <div style="font-size:12px;color:var(--ink3);margin-top:3px">Ajouter, modifier, supprimer</div>
            </div>
          </div>
        </div>
        <div class="card" style="cursor:pointer" (click)="router.navigate(['/sales/create'])">
          <div class="card-body" style="display:flex;align-items:center;gap:14px;padding:20px">
            <div style="font-size:28px">🧾</div>
            <div>
              <div style="font-weight:700;font-size:14px">Nouvelle vente</div>
              <div style="font-size:12px;color:var(--ink3);margin-top:3px">Enregistrer une vente</div>
            </div>
          </div>
        </div>
      </div>
    }
  `
})
export class DashboardComponent implements OnInit {
  readonly #svc = inject(DashboardService);
  readonly router = inject(Router);

  data    = signal<Dashboard | null>(null);
  loading = signal(true);
  toast   = signal<string | null>(null);

  ngOnInit() {
    this.#svc.get().subscribe({
      next:  d => { this.data.set(d); this.loading.set(false); },
      error: () => { this.toast.set('Erreur de chargement'); this.loading.set(false); }
    });
  }

  formatRevenue(v: number) {
    if (v >= 1_000_000) return (v / 1_000_000).toFixed(1) + ' M DH';
    if (v >= 1_000)     return (v / 1_000).toFixed(1) + ' k DH';
    return v.toFixed(0) + ' DH';
  }
}
