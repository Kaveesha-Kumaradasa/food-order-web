import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { AuthenticationService } from './user.service';
import { Router } from '@angular/router';

export type CartIdentity = string | number;

export interface CartAddable {
  id: CartIdentity;
  name: string;
  price: number;
  image?: string;
  description?: string;
  categoryId?: CartIdentity | null;
}

export interface CartItem extends CartAddable {
  qty: number;
  lineTotal: number;
}

type CartState = {
  items: CartItem[];
};

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly _state$ = new BehaviorSubject<CartState>({ items: [] });
  readonly state$ = this._state$.asObservable();

  readonly items$ = this.state$.pipe(map(s => s.items));
  readonly count$ = this.items$.pipe(map(items => items.reduce((acc, it) => acc + it.qty, 0)));
  readonly total$ = this.items$.pipe(map(items => items.reduce((acc, it) => acc + it.lineTotal, 0)));

  constructor(
    private auth: AuthenticationService,
    private router: Router
  ) {
    this.auth.currentUser.subscribe(() => {
      this._state$.next(this.load());
    });
  }

  private getStorageKey(): string {
    const userId = this.auth.currentUserValue?.id || 'guest';
    return `foodapp.cart.v1.${userId}`;
  }

  add(item: CartAddable, qty = 1) {
    // 🚨 Block guest users
    if (!this.auth.currentUserValue?.id) {
      alert('Please log in to add items to your cart.');
      this.router.navigate(['/auth/login']);
      return;
    }

    if (!item?.id) return;
    const st = this.clone();
    const idx = st.items.findIndex(i => String(i.id) === String(item.id));
    if (idx >= 0) {
      st.items[idx].qty += qty;
      st.items[idx].lineTotal = st.items[idx].qty * st.items[idx].price;
    } else {
      st.items.unshift({ ...item, qty, lineTotal: (item.price ?? 0) * qty });
    }
    this.commit(st);
  }

  setQty(id: CartIdentity, qty: number) {
    const st = this.clone();
    const it = st.items.find(i => String(i.id) === String(id));
    if (!it) return;
    it.qty = Math.max(1, Math.floor(qty || 1));
    it.lineTotal = it.qty * it.price;
    this.commit(st);
  }

  increase(id: CartIdentity) {
    const st = this.clone();
    const it = st.items.find(i => String(i.id) === String(id));
    if (!it) return;
    it.qty += 1;
    it.lineTotal = it.qty * it.price;
    this.commit(st);
  }

  decrease(id: CartIdentity) {
    const st = this.clone();
    const it = st.items.find(i => String(i.id) === String(id));
    if (!it) return;
    it.qty = Math.max(1, it.qty - 1);
    it.lineTotal = it.qty * it.price;
    this.commit(st);
  }

  remove(id: CartIdentity) {
    const st = this.clone();
    st.items = st.items.filter(i => String(i.id) !== String(id));
    this.commit(st);
  }

  clear() {
    this.commit({ items: [] });
  }

  // ---- internals ----
  private clone(): CartState {
    const s = this._state$.value;
    return { items: s.items.map(i => ({ ...i })) };
  }

  private commit(next: CartState) {
    this._state$.next(next);
    this.save(next);
  }

  private load(): CartState {
    try {
      const raw = localStorage.getItem(this.getStorageKey());
      if (!raw) return { items: [] };
      const parsed = JSON.parse(raw) as CartState;
      parsed.items = (parsed.items ?? []).map(i => ({
        ...i,
        qty: Math.max(1, Math.floor(i.qty || 1)),
        lineTotal: (i.price ?? 0) * Math.max(1, Math.floor(i.qty || 1)),
      }));
      return parsed;
    } catch {
      return { items: [] };
    }
  }

  private save(st: CartState) {
    try {
      localStorage.setItem(this.getStorageKey(), JSON.stringify(st));
    } catch {
    }
  }
}
