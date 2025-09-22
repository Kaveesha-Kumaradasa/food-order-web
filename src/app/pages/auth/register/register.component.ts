// pages/auth/register/register.component.ts
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { take, finalize } from 'rxjs/operators';

import { AuthenticationService, RegisterDTO } from '../../../services/user.service';
import { User } from '../../../models/auth-model';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: false
})
export class RegisterComponent {
  username = '';
  email = '';
  contactNumber = '';
  password = '';
  confirmPassword = '';

  submitted = false;
  loading = false;
  errorMessage: string | null = null;

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  private passwordsMatch(): boolean {
    return !!this.password && !!this.confirmPassword && this.password === this.confirmPassword;
  }

  onSubmit(form: NgForm): void {
    this.submitted = true;
    this.errorMessage = null;

    if (form.invalid) {
      this.errorMessage = 'Please fix the highlighted fields.';
      return;
    }
    if (!this.passwordsMatch()) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    const payload: RegisterDTO = {
      email: this.email.trim().toLowerCase(),
      username: this.username.trim(),
      password: this.password,
      password_confirmation: this.confirmPassword,
      first_name: this.username.trim(),
      last_name: 'Demo',
      country_code: environment.default_country_code,
      contact_number: this.contactNumber.trim().replace(/\D+/g, ''),
      account_brand: environment.webshop_brand_id,
    };

    // Safe console log (don’t show raw password)
    const redacted = { ...payload, password: '******', password_confirmation: '******' };
    console.debug('[Register] Sending payload:', redacted);

    this.loading = true;
    this.authService.register(payload)
      .pipe(take(1), finalize(() => (this.loading = false)))
      .subscribe({
        next: (user: User) => {
          console.info('[Register ✔] Success:', {
            id: user.id,
            email: user.email,
            name: user.name
          });
          this.router.navigate(['/home']);
        },
        error: (err: any) => {
          console.error('[Register ✖] Error:', err);
          this.errorMessage = err?.message || 'Registration failed. Please check your details.';
        }
      });
  }
}
