import { Component } from '@angular/core';

interface CartItem {
  name: string;
  price: number;
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  standalone: false,
})
export class CartComponent {
  cartItems: CartItem[] = []; // Typed empty array
  total = 0;

  removeFromCart(item: CartItem) {
    // Logic to remove item from cart
  }

  checkout() {
    // Logic for checkout process
  }
}