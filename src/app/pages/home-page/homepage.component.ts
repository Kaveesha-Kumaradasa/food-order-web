import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

interface MenuCategory {
  name: string;
  id: string;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: string;
}

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  standalone: false,
})
export class HomepageComponent implements OnInit {
  menuCategories: MenuCategory[] = [
    { name: 'Appetizers', id: 'appetizers' },
    { name: 'Main Course', id: 'main' },
    { name: 'Desserts', id: 'desserts' },
    { name: 'Beverages', id: 'drinks' },
    { name: 'Salads', id: 'salads' },
    { name: 'Soups', id: 'soups' }
  ];

  menuItems: MenuItem[] = [
    {
      id: '1',
      name: 'Garlic Bread',
      description: 'Crispy garlic bread with herbs',
      price: 5.99,
      image: 'https://via.placeholder.com/250x200?text=Garlic+Bread',
      categoryId: 'appetizers'
    },
    {
      id: '2',
      name: 'Margherita Pizza',
      description: 'Classic pizza with fresh tomatoes and basil',
      price: 12.99,
      image: 'https://via.placeholder.com/250x200?text=Margherita+Pizza',
      categoryId: 'main'
    },
    {
      id: '3',
      name: 'Chocolate Cake',
      description: 'Rich chocolate cake with frosting',
      price: 6.99,
      image: 'https://via.placeholder.com/250x200?text=Chocolate+Cake',
      categoryId: 'desserts'
    },
    {
      id: '4',
      name: 'Coca Cola',
      description: 'Refreshing cola drink',
      price: 2.49,
      image: 'https://via.placeholder.com/250x200?text=Coca+Cola',
      categoryId: 'drinks'
    },
    {
      id: '5',
      name: 'Caesar Salad',
      description: 'Fresh salad with Caesar dressing',
      price: 8.99,
      image: 'https://via.placeholder.com/250x200?text=Caesar+Salad',
      categoryId: 'salads'
    },
    {
      id: '6',
      name: 'Tomato Soup',
      description: 'Warm tomato soup',
      price: 4.99,
      image: 'https://via.placeholder.com/250x200?text=Tomato+Soup',
      categoryId: 'soups'
    }
  ];

  selectedCategory: MenuCategory | null = null;
  filteredMenuItems: MenuItem[] = [];
  showModal = false;
  selectedMenuItem: MenuItem | null = null;
  cart: MenuItem[] = [];

  @ViewChild('categoriesList') categoriesList!: ElementRef;

  ngOnInit(): void {
    this.selectedCategory = this.menuCategories[0];
    this.filterItems();
  }

  selectCategory(category: MenuCategory): void {
    this.selectedCategory = category;
    this.filterItems();
  }

  filterItems(): void {
    if (this.selectedCategory) {
      this.filteredMenuItems = this.menuItems.filter(item => item.categoryId === this.selectedCategory!.id);
    }
  }

  openMenuModal(item: MenuItem): void {
    this.selectedMenuItem = item;
    this.showModal = true;
  }

  closeMenuModal(): void {
    this.showModal = false;
    this.selectedMenuItem = null;
  }

  addToCart(item: MenuItem): void {
    this.cart.push({ ...item });
    console.log('Added to cart:', item);
    alert(`${item.name} added to cart!`);
    this.closeMenuModal();
  }
}