import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './shared/api.service';
import { User } from './../models/auth-model'; // Import User from auth-model

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private apiService: ApiService) {
    this.currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): Observable<User> {
    const body = { email, password };
    return this.apiService.post('/auth/login', body, 'user').pipe(
      map((response: any) => {
        const user: User = {
          id: response.id || response.user_id,
          email: response.email,
          name: response.name,
          token: response.token
        };
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      })
    );
  }

  register(email: string, password: string, name?: string): Observable<User> {
    const body = { email, password, name };
    return this.apiService.post('/auth/register', body, 'user').pipe(
      map((response: any) => {
        const user: User = {
          id: response.id || response.user_id,
          email: response.email,
          name: response.name,
          token: response.token
        };
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  getToken(): { token: string } | null {
    const user = this.currentUserValue;
    return user ? { token: user.token } : null;
  }

  private getUserFromStorage(): User | null {
    const userJson = localStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
  }
}