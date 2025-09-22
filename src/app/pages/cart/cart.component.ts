// cart.component.ts
import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CartItem, CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  standalone: false,
})
export class CartComponent {
  private cart = inject(CartService);        

  items$: Observable<CartItem[]> = this.cart.items$;
  total$: Observable<number>       = this.cart.total$;
  count$: Observable<number>       = this.cart.count$;

  fallbackImage = 'https://www.precisionorthomd.com/wp-content/uploads/2023/10/percision-blog-header-junk-food-102323.jpg';

  trackById = (_: number, it: CartItem) => it.id;

  increase(id: string | number) { this.cart.increase(id); }
  decrease(id: string | number) { this.cart.decrease(id); }
  updateQty(id: string | number, raw: any) {
    const v = Number(raw);
    if (!Number.isFinite(v) || v < 1) return;
    this.cart.setQty(id, v);
  }
  remove(id: string | number) { this.cart.remove(id); }
  clear() { this.cart.clear(); }

  onImageError(e: Event) {
    const el = e.target as HTMLImageElement;
    if (!el.src.includes('placeholder.com')) {
      el.onerror = null;
      el.src = this.fallbackImage;
    }
  }
}
