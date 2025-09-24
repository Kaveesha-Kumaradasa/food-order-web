import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ErrorMessageHandler } from '../../helpers/error-handler';

type ServiceKey = 'user' | 'pos';

interface RequestOptions {
  skipAuth?: boolean;
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | readonly (string | number | boolean)[]>;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(
    private http: HttpClient,
    private errorHandler: ErrorMessageHandler
  ) {}


  private getBaseUrl(service: ServiceKey): string {
    switch (service) {
      case 'user': return environment.user.api_base_url;
      case 'pos' : return environment.pos.api_base_url;
    }
  }

  private buildHeaders(skipAuth = false, extra?: Record<string,string>): HttpHeaders {
    let headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    // tenant header if configured
    if (environment.x_tenant_code) {
      headers['x-tenant-code'] = String(environment.x_tenant_code);
    }

    if (!skipAuth) {
      const raw = localStorage.getItem('currentUser');
      const token = raw ? (() => { try { return JSON.parse(raw).token as string; } catch { return ''; } })() : '';
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }

    if (extra) headers = { ...headers, ...extra };
    return new HttpHeaders(headers);
  }

  private buildParams(params?: RequestOptions['params']): HttpParams | undefined {
    if (!params) return undefined;
    let hp = new HttpParams();
    Object.entries(params).forEach(([k, v]) => {
      if (Array.isArray(v)) {
        v.forEach(item => hp = hp.append(k, String(item)));
      } else if (v !== undefined && v !== null) {
        hp = hp.set(k, String(v));
      }
    });
    return hp;
  }

  private handleError = (error: HttpErrorResponse): Observable<never> => {
    // Network / CORS / offline
    if (error.error instanceof ProgressEvent) {
      this.errorHandler.showErrorMessage("Couldn't connect to remote server.");
      return throwError(() => new Error("Couldn't connect to remote server."));
    }

    // Prefer backend-provided message when present
    const backendMessage =
      (typeof error.error === 'string' ? error.error : error?.error?.message) ||
      error.message ||
      'An unexpected error occurred.';


    if (error.status === 401 || backendMessage === 'Unauthenticated.') {
      localStorage.removeItem('currentUser');
      window.location.assign('/auth/login');
    }

    this.errorHandler.showErrorMessage(backendMessage);
    return throwError(() => new Error(backendMessage));
  };

  private request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    path: string,
    service: ServiceKey,
    body?: unknown,
    options?: RequestOptions
  ): Observable<T> {
    const url = this.getBaseUrl(service) + path;
    const headers = this.buildHeaders(!!options?.skipAuth, options?.headers);
    const params  = this.buildParams(options?.params);

    return this.http.request<T>(method, url, { headers, params, body })
      .pipe(catchError(this.handleError));
  }


  get<T = any>(path: string, service: ServiceKey, options?: RequestOptions): Observable<T> {
    return this.request<T>('GET', path, service, undefined, options);
  }

  post<T = any>(path: string, body: any = {}, service: ServiceKey, options?: RequestOptions): Observable<T> {
    return this.request<T>('POST', path, service, body, options);
  }

  put<T = any>(path: string, body: any = {}, service: ServiceKey, options?: RequestOptions): Observable<T> {
    return this.request<T>('PUT', path, service, body, options);
  }

  delete<T = any>(path: string, service: ServiceKey, options?: RequestOptions): Observable<T> {
    return this.request<T>('DELETE', path, service, undefined, options);
  }
}
