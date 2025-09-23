// services/user.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './shared/api.service';
import { User } from './../models/auth-model';
import { environment } from '../../environments/environment';

export interface RegisterDTO {
  email: string;
  password: string;
  password_confirmation: string;
  first_name?: string;
  last_name?: string;
  country_code?: string;    
  contact_number?: string;   
  account_brand?: number;    
  type?: string;             // add type for WEBSHOP
}

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private apiService: ApiService) {
    this.currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
    this.currentUser = this.currentUserSubject.asObservable();
  }


  register(payload: RegisterDTO): Observable<User> {
    const body = {
      ...payload,
      type: 'WEBSHOP',
      account_brand: environment.BRAND_ID
    };

    return this.apiService
      .post('/api/v1/webshop_customer/register', body, 'user', { skipAuth: true })
      .pipe(
        map((response: any) => {
          const token = response?.data?.accessToken;
          const user: User = {
            id: response?.data?.created_id ?? payload.email,
            email: payload.email,
            name: payload.first_name ?? '',
            token
          };

          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);

          console.info('[Register ✔ Auto-login]', user);
          return user;
        })
      );
  }


  login(email: string, password: string): Observable<User> {
    const payload = {
      username: email.trim().toLowerCase(),   
      password,
      grant_type: environment.GRANT_TYPE,     
      client_id: environment.CLIENT_ID,       
      client_secret: environment.CLIENT_SECRET,
      scope: '',
      account_brand: environment.BRAND_ID
    };

    console.log('Login payload →', payload);

    return this.apiService.post(
      '/api/v1/webshop_customer/login',
      payload,
      'user',
      { skipAuth: true }
    ).pipe(
      map((response: any) => {
        const token = response?.accessToken || response?.data?.accessToken;
        if (!token) throw new Error('No token returned from server.');

        const user: User = {
          id: response?.user_id ?? response?.data?.user_id ?? email,
          email: email,
          token
        };

        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        console.info('Login ✔ Success:', user);
        return user;
      })
    );
  }

  // --- SESSION HELPERS ---
  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public isAuthenticated(): boolean {
    return !!this.currentUserSubject.value?.token;
  }

logout(): void {

  const userId = this.currentUserValue?.id;
  localStorage.removeItem('currentUser');
  this.currentUserSubject.next(null);
}

  private getUserFromStorage(): User | null {
    const userJson = localStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
  }
}
