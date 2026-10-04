import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { ProductService } from '../../../core/services/api.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html'
})
export class ProductFormComponent implements OnInit {
  readonly #fb     = inject(FormBuilder);
  readonly #svc    = inject(ProductService);
  readonly router  = inject(Router);
  readonly #route  = inject(ActivatedRoute);

  form!: FormGroup;
  isEdit  = signal(false);
  editId  = signal<number | null>(null);
  loading = signal(false);
  saving  = signal(false);
  toast   = signal<{ msg: string; ok: boolean } | null>(null);

  readonly categories = ['Electronique','Vêtements','Alimentaire','Maison & Déco','Sport & Loisirs','Informatique','Téléphonie','Autre'];

  ngOnInit() {
    this.form = this.#fb.group({
      name:          ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      description:   [null],
      category:      ['', Validators.required],
      purchasePrice: [null, [Validators.required, Validators.min(0)]],
      salePrice:     [null, [Validators.required, Validators.min(0.01)]],
      quantity:      [null, [Validators.required, Validators.min(0)]],
      imageUrl:      [null]
    });
    const id = this.#route.snapshot.paramMap.get('id');
    if (id) { this.isEdit.set(true); this.editId.set(+id); this.loadProduct(+id); }
  }

  loadProduct(id: number) {
    this.loading.set(true);
    this.#svc.getById(id).subscribe({
      next: p => { this.form.patchValue(p); this.loading.set(false); },
      error: () => { this.showToast('Produit introuvable', false); this.loading.set(false); }
    });
  }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving.set(true);
    const payload = this.form.value;
    const req$: Observable<unknown> = this.isEdit()
      ? this.#svc.update(this.editId()!, payload)
      : this.#svc.create(payload);
    req$.subscribe({
      next: () => { this.showToast(this.isEdit() ? 'Produit mis à jour !' : 'Produit créé !', true); setTimeout(() => this.router.navigate(['/products']), 900); },
      error: () => { this.showToast('Erreur lors de l\'enregistrement', false); this.saving.set(false); }
    });
  }

  inv(f: string) { const c = this.form.get(f); return c?.invalid && c.touched; }
  err(f: string, e: string) { const c = this.form.get(f); return c?.errors?.[e] && c.touched; }

  showToast(msg: string, ok: boolean) { this.toast.set({ msg, ok }); setTimeout(() => this.toast.set(null), 3500); }
}
