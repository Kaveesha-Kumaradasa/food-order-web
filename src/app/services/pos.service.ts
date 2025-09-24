import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './shared/api.service';

@Injectable({ providedIn: 'root' })
export class PosService {
  constructor(private api: ApiService) {}

  public getCategories(): Observable<any> {
    const path = `/api/v1/webshop/categories/webshop-brand/1/shop/2`;
    console.log('categories GET ', path);
    return this.api.get(path, 'pos');
  }

  public getMainMenuCategories(): Observable<any> {
    const path = `/api/v1/webshop/main-menu/65/categories/webshop-brand/1/shop/2`;
    console.log('main-menu categories GET ', path);
    return this.api.get(path, 'pos');
  }
}
