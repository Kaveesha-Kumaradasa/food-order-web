import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorMessageHandler {
  showErrorMessage(message: string): void {
    alert(message);
    console.error('API Error:', message);
  }
}