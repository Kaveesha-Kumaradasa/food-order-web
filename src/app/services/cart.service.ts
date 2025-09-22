import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

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

const STORAGE_KEY = 'foodapp.cart.v1';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly _state$ = new BehaviorSubject<CartState>(this.load());
  readonly state$ = this._state$.asObservable();

  /** items stream for templates */
  readonly items$ = this.state$.pipe(map(s => s.items));

  /** total item count (sum of qty) */
  readonly count$ = this.items$.pipe(
    map(items => items.reduce((acc, it) => acc + it.qty, 0))
  );

  /** cart grand total */
  readonly total$ = this.items$.pipe(
    map(items => items.reduce((acc, it) => acc + it.lineTotal, 0))
  );

  add(item: CartAddable, qty = 1) {
    if (!item || !item.id) return;
    const st = this.clone();
    const idx = st.items.findIndex(i => String(i.id) === String(item.id));
    if (idx >= 0) {
      st.items[idx].qty += qty;
      st.items[idx].lineTotal = st.items[idx].qty * st.items[idx].price;
    } else {
      st.items.unshift({
        ...item,
        qty,
        lineTotal: (item.price ?? 0) * qty,
      });
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
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { items: [] };
      const parsed = JSON.parse(raw) as CartState;
      // safety re-calc line totals
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(st));
    } catch {
      // ignore storage errors (quota, privacy mode, etc.)
    }
  }
}
