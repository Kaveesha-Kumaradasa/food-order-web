import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ErrorMessageHandler } from '../../helpers/error-handler';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private x_tenant_code = `${environment.x_tenant_code}`;

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorMessageHandler
  ) {}

  get headers(): HttpHeaders {
    const userJson = localStorage.getItem('currentUser');
    const token = userJson ? JSON.parse(userJson).token : '';
    const hdrs = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Authorization': token ? `Bearer ${token}` : '',
      'x-tenant-code': this.x_tenant_code,
    });
    return hdrs;
  }

  private handleError(error: HttpErrorResponse, handler: ErrorMessageHandler): Observable<never> {
    console.error('[ApiService] HTTP error:', error);
    if (error.error instanceof ProgressEvent) {
      handler.showErrorMessage("Couldn't connect to remote server.");
    } else if (error.error?.message) {
      if (error.error.message === 'Unauthenticated.') {
        localStorage.removeItem('currentUser');
        window.location.href = '/auth/login';
      }
      handler.showErrorMessage(error.error.message);
      return throwError(() => new Error(error.error.message));
    }
    handler.showErrorMessage('Could not connect to remote server.');
    return throwError(() => new Error('Could not connect to remote server.'));
  }

  getBaseUrl(service: string): string {
    if (service === 'user') return `${environment.user.api_base_url}`;
    if (service === 'pos')  return `${environment.pos.api_base_url}`;
    return '';
  }

  get(path: string, service: string): Observable<any> {
    const url = this.getBaseUrl(service) + `${path}`;
    console.log('[ApiService] GET URL:', url, 'headers:', this.headers.keys());
    return this.http
      .get<any>(url, { headers: this.headers })
      .pipe(catchError(err => this.handleError(err, this.errorHandler)));
  }

  post(path: string, body: Object = {}, service: string): Observable<any> {
    const url = this.getBaseUrl(service) + `${path}`;
    console.log('[ApiService] POST URL:', url);
    return this.http
      .post<any>(url, JSON.stringify(body), { headers: this.headers })
      .pipe(catchError(err => this.handleError(err, this.errorHandler)));
  }

  put(path: string, body: Object = {}, service: string): Observable<any> {
    const url = this.getBaseUrl(service) + `${path}`;
    console.log('[ApiService] PUT URL:', url);
    return this.http
      .put<any>(url, JSON.stringify(body), { headers: this.headers })
      .pipe(catchError(err => this.handleError(err, this.errorHandler)));
  }

  delete(path: string, service: string): Observable<any> {
    const url = this.getBaseUrl(service) + `${path}`;
    console.log('[ApiService] DELETE URL:', url);
    return this.http
      .delete<any>(url, { headers: this.headers })
      .pipe(catchError(err => this.handleError(err, this.errorHandler)));
  }
}
