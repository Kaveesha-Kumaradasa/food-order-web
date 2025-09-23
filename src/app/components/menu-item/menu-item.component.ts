import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CartService } from '../../services/cart.service';

export type MenuItem = {
  id: string | number;
  name: string;
  description: string;
  price: number;
  image?: string;
  categoryId?: string | number | null;
};

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss'],
  standalone: false,
})
export class MenuModalComponent {
  @Input() item: MenuItem | null = null;
  @Input() visible = false;

  @Output() close = new EventEmitter<void>();
  @Output() add = new EventEmitter<{ item: MenuItem; qty: number }>();


  qty = 1;

  constructor(private cart: CartService) {}

  addToCart() {
    if (!this.item) return;
    this.cart.add(
      {
        id: this.item.id,
        name: this.item.name,
        price: this.item.price,
        image: this.item.image,
        description: this.item.description,
        categoryId: this.item.categoryId
      },
      this.qty
    );
    this.add.emit({ item: this.item, qty: this.qty });
    this.onClose();
  }

  onClose() {
    this.close.emit();
    this.qty = 1; // reset qty when closing
  }
}
