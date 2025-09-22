import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { PosService } from '../../services/pos.service';
import { CartService } from '../../services/cart.service';

type MenuCategory = { id: string | number; name: string };
type MenuItem = {
  id: string | number;
  name: string;
  description: string;
  price: number;
  image?: string;
  categoryId?: string | number | null;
};

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  standalone: false,
})
export class HomepageComponent implements OnInit, OnDestroy {

  selectedQty = 1;

  // UI state
  loadingCategories = false;
  loadingItems = false;
  error = '';

  // Data for template
  menuCategories: MenuCategory[] = [];
  selectedCategory: MenuCategory | null = null;
  filteredMenuItems: MenuItem[] = [];

  // Modal
  showModal = false;
  selectedMenuItem: MenuItem | null = null;

  // Internal
  private subs = new Subscription();
  private itemsByCategory = new Map<string | number, MenuItem[]>();

  // TrackBy
  trackByCategory = (_: number, c: { id: string | number }) => c?.id;
  trackByItem = (_: number, it: { id: string | number }) => it?.id;

  constructor(
    private pos: PosService,
    private cart: CartService     // ← inject CartService here, in the same constructor
  ) {}

  ngOnInit(): void {
    this.fetchMenu();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }


  fetchMenu(): void {
    this.loadingCategories = true;
    this.loadingItems = true;
    this.error = '';

    this.subs.add(
      this.pos.getMainMenuCategories().pipe(
        map((res) => {
          console.log('[API]', res);
          return this.buildMenuView(res);
        }),
        catchError((err) => {
          console.error('[API error]', err);
          this.error = 'Failed to load menu.';
          return of({ categories: [], itemsByCategory: new Map<string | number, MenuItem[]>() });
        })
      ).subscribe(({ categories, itemsByCategory }) => {
        this.menuCategories = categories;
        this.itemsByCategory = itemsByCategory;

        const firstWithItems = this.menuCategories.find(c => (this.itemsByCategory.get(c.id)?.length ?? 0) > 0);
        this.selectedCategory = firstWithItems ?? this.menuCategories[0] ?? null;
        this.applyFilter();

        this.loadingCategories = false;
        this.loadingItems = false;

        if (!this.menuCategories.length) {
          this.error = 'No categories/items returned by the endpoint.';
        }
      })
    );
  }


  private buildMenuView(res: any): {
    categories: MenuCategory[],
    itemsByCategory: Map<string | number, MenuItem[]>
  } {
    const categories: MenuCategory[] = [];
    const itemsByCategory = new Map<string | number, MenuItem[]>();

    const data = res?.data ?? {};
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      for (const [categoryName, arr] of Object.entries<any[]>(data)) {
        const catId = this.slug(categoryName);
        const items = Array.isArray(arr) ? arr.map(it => this.toMenuItem(it, catId)) : [];
        categories.push({ id: catId, name: categoryName });
        itemsByCategory.set(catId, items);
      }
    }

    return { categories, itemsByCategory };
  }

  /** Previously: normalizeItem */
  private toMenuItem(raw: any, categoryId?: string | number | null): MenuItem {
    const priceRaw = raw?.price ?? raw?.cost ?? 0;
    const price = typeof priceRaw === 'string' ? parseFloat(priceRaw) : Number(priceRaw);

    return {
      id: String(raw?.id ?? raw?.itemId ?? raw?._id ?? randomId()),
      name: String(raw?.name ?? raw?.title ?? 'Item'),
      description: String(raw?.description ?? raw?.desc ?? ''),
      price: Number.isFinite(price) ? price : 0,
      image: raw?.image ?? raw?.image_url ?? raw?.photo ?? '',
      categoryId: categoryId ?? null,
    };
  }


  selectCategory(cat: MenuCategory): void {
    this.selectedCategory = cat;
    this.applyFilter();
  }

  private applyFilter(): void {
    if (!this.selectedCategory) {
      this.filteredMenuItems = [];
      return;
    }
    this.filteredMenuItems = [...(this.itemsByCategory.get(this.selectedCategory.id) ?? [])];
  }

  openMenuModal(item: MenuItem): void {
    this.selectedMenuItem = item;
    this.showModal = true;
  }

  closeMenuModal(): void {
    this.showModal = false;
    this.selectedMenuItem = null;
  }

addToCart(item: MenuItem, qty: number = 1): void {
    this.cart.add(
      {
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        description: item.description,
        categoryId: item.categoryId,
      },
      qty
    );
    this.closeMenuModal();
  }

  getDefaultImage(): string {
    return 'https://www.precisionorthomd.com/wp-content/uploads/2023/10/percision-blog-header-junk-food-102323.jpg';
  }

  onImageError(ev: Event, _item: MenuItem): void {
    const el = ev.target as HTMLImageElement;
    if (!el.src.includes('placeholder.com')) {
      el.onerror = null; // prevent loops
      el.src = this.getDefaultImage();
    }
  }


  private slug(v: any): string {
    return String(v ?? '').trim().toLowerCase().replace(/\s+/g, '-');
  }
}

function randomId(): string {
  return 'id_' + Math.random().toString(36).slice(2);
}
