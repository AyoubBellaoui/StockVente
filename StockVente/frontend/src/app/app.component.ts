import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="shell">
      <aside class="sidebar">
        <div class="brand">
          <div class="brand-icon">
            <svg width="20" height="20" fill="none" stroke="white" stroke-width="2.2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 10V7"/>
            </svg>
          </div>
          <div>
            <div class="brand-name">StockVente</div>
            <div class="brand-ver">v1.0 · PFE 2025</div>
          </div>
        </div>

        <nav class="nav">
          <span class="nav-section">GÉNÉRAL</span>
          <a class="nav-link" routerLink="/dashboard" routerLinkActive="nav-active">
            <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
            </svg>
            Dashboard
          </a>

          <span class="nav-section" style="margin-top:12px">CATALOGUE</span>
          <a class="nav-link" routerLink="/products" routerLinkActive="nav-active" [routerLinkActiveOptions]="{exact:false}">
            <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 10V7"/>
            </svg>
            Produits
          </a>

          <span class="nav-section" style="margin-top:12px">COMMERCE</span>
          <a class="nav-link" routerLink="/sales" routerLinkActive="nav-active" [routerLinkActiveOptions]="{exact:false}">
            <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
            Ventes
          </a>
          <a class="nav-link" routerLink="/clients" routerLinkActive="nav-active" [routerLinkActiveOptions]="{exact:false}">
            <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            Clients
          </a>
        </nav>

        <div class="sidebar-foot">
          <div class="user-card">
            <div class="user-av">AD</div>
            <div>
              <div class="user-name">Administrateur</div>
              <div class="user-status"><span class="dot"></span>En ligne</div>
            </div>
          </div>
        </div>
      </aside>

      <main class="main"><router-outlet /></main>
    </div>
  `,
  styles: [`
    .shell { display: flex; height: 100vh; overflow: hidden; }
    .sidebar { width: 224px; flex-shrink: 0; background: var(--white); border-right: 1px solid var(--border); display: flex; flex-direction: column; overflow-y: auto; }
    .brand { display: flex; align-items: center; gap: 10px; padding: 20px 16px 18px; border-bottom: 1px solid var(--border); }
    .brand-icon { width: 38px; height: 38px; flex-shrink: 0; border-radius: 11px; background: linear-gradient(135deg, var(--green), #22c55e); display: flex; align-items: center; justify-content: center; box-shadow: 0 3px 10px rgba(22,163,74,.3); }
    .brand-name { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; color: var(--ink); }
    .brand-ver { font-size: 10.5px; color: var(--ink3); margin-top: 1px; }
    .nav { flex: 1; padding: 14px 10px; }
    .nav-section { display: block; font-size: 9.5px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--ink3); padding: 0 8px; margin-bottom: 4px; }
    .nav-link { display: flex; align-items: center; gap: 9px; padding: 9px 10px; border-radius: 8px; font-size: 13px; font-weight: 500; color: var(--ink2); text-decoration: none; transition: all .14s; margin-bottom: 1px; }
    .nav-link:hover { background: var(--bg2); color: var(--ink); }
    .nav-active { background: var(--green-l) !important; color: var(--green) !important; font-weight: 600; }
    .sidebar-foot { padding: 12px 14px; border-top: 1px solid var(--border); }
    .user-card { display: flex; align-items: center; gap: 9px; padding: 9px 11px; background: var(--bg); border: 1px solid var(--border); border-radius: 9px; }
    .user-av { width: 30px; height: 30px; flex-shrink: 0; border-radius: 50%; background: linear-gradient(135deg, var(--green), #22c55e); color: #fff; font-size: 10.5px; font-weight: 700; display: flex; align-items: center; justify-content: center; }
    .user-name { font-size: 12.5px; font-weight: 600; color: var(--ink); }
    .user-status { display: flex; align-items: center; gap: 4px; font-size: 11px; color: var(--ink3); margin-top: 1px; }
    .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--green); box-shadow: 0 0 0 2px var(--green-l); }
    .main { flex: 1; overflow-y: auto; padding: 32px 36px; background: var(--bg); }
  `]
})
export class AppComponent {}
