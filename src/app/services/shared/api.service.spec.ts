/*import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ErrorMessageHandler } from '../../helpers/error-handler';

/**
 * Service - ApiService
 *
 * Handles HTTP server communication for menu-related data
 */
/*@Injectable()
export class ApiService {
  private x_tenant_code = `${environment.x_tenant_code}`;

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorMessageHandler
  ) {}

  /**
   * Get default headers for a request (without authentication)
   */
  /*get headers(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'x-tenant-code': this.x_tenant_code
    });
  }

  getBaseUrl(service: string): string {
    if (service === 'pos') {
      return `${environment.pos.api_base_url}`;
    }
    return '';
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    if (error.error instanceof ProgressEvent) {
      this.errorHandler.showErrorMessage("Couldn't connect to remote server.");
    } else if (error.error && error.error.message) {
      this.errorHandler.showErrorMessage(error.error.message);
      return throwError(() => error.error.message);
    } else {
      this.errorHandler.showErrorMessage('Could not connect to remote server.');
      return throwError(() => 'Could not connect to remote server.');
    }
  }

  get(path: string, service: string): Observable<any> {
    return this.http
      .get<any>(this.getBaseUrl(service) + `${path}`, { headers: this.headers })
      .pipe(
        catchError(err => this.handleError(err))
      );
  }
}*/