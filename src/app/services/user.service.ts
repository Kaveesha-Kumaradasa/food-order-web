// services/user.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './shared/api.service';
import { User } from './../models/auth-model';
import { environment } from '../../environments/environment';

export interface RegisterDTO {
  email: string;
  username?: string;
  password: string;
  password_confirmation: string;

  first_name?: string;
  last_name?: string;
  country_code?: string;    
  contact_number?: string;   
  account_brand?: number;    
}

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private apiService: ApiService) {
    this.currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
    this.currentUser = this.currentUserSubject.asObservable();
  }

  private mapResponseToUser(resp: any): User {
    const token =
      resp?.token ||
      resp?.access_token ||
      resp?.data?.token ||
      resp?.data?.access_token;

    const u = resp?.user || resp?.data?.user || resp;
    const id = u?.id ?? u?.user_id ?? resp?.id ?? resp?.user_id;
    const email = u?.email ?? resp?.email;
    const name = u?.name ?? u?.full_name ?? u?.username ?? resp?.name;

    if (!token) throw new Error('No token returned from server.');
    return { id, email, name, token };
  }

  register(payload: RegisterDTO): Observable<User> {
    return this.apiService
      .post('/api/v1/webshop_customer/register', payload, 'user', { skipAuth: true }) 
      .pipe(
        map((response: any) => {
          const user = this.mapResponseToUser(response);
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          return user;
        })
      );
  }


login(identifier: string, password: string) {
  const id = identifier.trim();
  const isEmail = id.includes('@');

  const payload: any = {
    password,
    account_brand: environment.webshop_brand_id, 
    type: 'WEBSHOP'                              
  };
  if (isEmail) payload.email = id;
  else payload.username = id;


  return this.apiService.post(
    '/api/v1/webshop_customer/login',
    payload,
    'user',
    { skipAuth: true }
  ).pipe(
    map((response: any) => {
      const user = this.mapResponseToUser(response);
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
      console.info('Login OK →', { id: user.id, email: user.email, name: user.name });
      return user;
    })
  );
}



  // Inside AuthenticationService class
  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public isAuthenticated(): boolean {
    return !!this.currentUserSubject.value?.token;
  }



  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  private getUserFromStorage(): User | null {
    const userJson = localStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
  }

}
