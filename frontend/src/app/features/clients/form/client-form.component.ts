import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ClientService } from '../../../core/services/api.service';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    @if (toast()) {
      <div class="toast" [class.toast-ok]="toast()!.ok" [class.toast-err]="!toast()!.ok">
        <span>{{ toast()!.ok ? '✅' : '❌' }}</span><span>{{ toast()!.msg }}</span>
      </div>
    }
    <div class="page-header">
      <div>
        <h1 class="page-title">@if (isEdit()) { Modifier le <em>Client</em> } @else { Nouveau <em>Client</em> }</h1>
      </div>
      <button class="btn btn-secondary" type="button" (click)="router.navigate(['/clients'])">← Retour</button>
    </div>
    <div style="max-width:600px">
      <div class="card">
        <div class="card-head">
          <div class="card-head-icon" style="background:var(--indigo-l)">👤</div>
          <div><div class="card-head-title">Informations du client</div></div>
        </div>
        <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
          <div class="card-body">
            <div class="form-grid">
              <div class="field full-col">
                <label>Nom complet <span class="req">*</span></label>
                <input type="text" formControlName="name" placeholder="Ex : Mohammed Alami" [class.is-invalid]="inv('name')">
                @if (err('name','required')) { <span class="error">⚠ Obligatoire</span> }
              </div>
              <div class="field">
                <label>Téléphone</label>
                <input type="tel" formControlName="phone" placeholder="06 00 00 00 00">
              </div>
              <div class="field">
                <label>Email</label>
                <input type="email" formControlName="email" placeholder="email@exemple.com">
              </div>
              <div class="field full-col">
                <label>Adresse</label>
                <textarea formControlName="address" placeholder="Adresse complète…" style="min-height:70px"></textarea>
              </div>
            </div>
          </div>
          <div class="card-foot">
            <button type="submit" class="btn btn-primary" [disabled]="saving()">
              @if (saving()) { <div class="spinner-sm"></div> } @else { ✓ }
              {{ isEdit() ? 'Enregistrer les modifications' : 'Créer le client' }}
            </button>
            <button type="button" class="btn btn-secondary" (click)="router.navigate(['/clients'])">Annuler</button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class ClientFormComponent implements OnInit {
  readonly #fb    = inject(FormBuilder);
  readonly #svc   = inject(ClientService);
  readonly router = inject(Router);
  readonly #route = inject(ActivatedRoute);

  form!: FormGroup;
  isEdit = signal(false);
  editId = signal<number | null>(null);
  saving = signal(false);
  toast  = signal<{ msg: string; ok: boolean } | null>(null);

  ngOnInit() {
    this.form = this.#fb.group({
      name:    ['', [Validators.required, Validators.maxLength(100)]],
      phone:   [null],
      email:   [null],
      address: [null]
    });
    const id = this.#route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true); this.editId.set(+id);
      this.#svc.getAll().subscribe(list => {
        const c = list.find(x => x.id === +id);
        if (c) this.form.patchValue(c);
      });
    }
  }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving.set(true);
    const req$: import('rxjs').Observable<unknown> = this.isEdit()
      ? this.#svc.update(this.editId()!, this.form.value)
      : this.#svc.create(this.form.value);
    req$.subscribe({
      next:  () => { this.showToast(this.isEdit() ? 'Client mis à jour !' : 'Client créé !', true); setTimeout(() => this.router.navigate(['/clients']), 900); },
      error: () => { this.showToast('Erreur lors de l\'enregistrement', false); this.saving.set(false); }
    });
  }

  inv(f: string) { const c = this.form.get(f); return c?.invalid && c.touched; }
  err(f: string, e: string) { const c = this.form.get(f); return c?.errors?.[e] && c.touched; }
  showToast(msg: string, ok: boolean) { this.toast.set({ msg, ok }); setTimeout(() => this.toast.set(null), 3500); }
}
