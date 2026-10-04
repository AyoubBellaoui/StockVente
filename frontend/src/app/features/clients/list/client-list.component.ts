import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Client, ClientService } from '../../../core/services/api.service';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './client-list.component.html'
})
export class ClientListComponent implements OnInit {
  readonly #svc  = inject(ClientService);
  readonly router = inject(Router);

  clients   = signal<Client[]>([]);
  loading   = signal(true);
  toast     = signal<{ msg: string; ok: boolean } | null>(null);
  delTarget = signal<Client | null>(null);
  search    = signal('');

  filtered = computed(() => {
    const q = this.search().trim().toLowerCase();
    return this.clients().filter(c => !q || c.name.toLowerCase().includes(q));
  });

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.#svc.getAll().subscribe({
      next:  d => { this.clients.set(d); this.loading.set(false); },
      error: () => { this.showToast('Erreur de chargement', false); this.loading.set(false); }
    });
  }

  confirmDelete() {
    const c = this.delTarget();
    if (!c) return;
    this.#svc.delete(c.id).subscribe({
      next:  () => { this.delTarget.set(null); this.showToast(`"${c.name}" supprimé`, true); this.load(); },
      error: () => this.showToast('Erreur lors de la suppression', false)
    });
  }

  showToast(msg: string, ok: boolean) { this.toast.set({ msg, ok }); setTimeout(() => this.toast.set(null), 3500); }
}
