import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, take } from 'rxjs/operators';
import { AuthenticationService } from '../../../services/user.service';
import { User } from '../../../models/auth-model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false
})
export class LoginComponent implements OnInit {
  identifier = '';   // email or username
  password   = '';
  errorMessage: string | null = null;
  loading = false;

  private returnUrl = '/home';

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // If a guard/app routed here with a target, use it after login
    const qp = this.route.snapshot.queryParamMap;
    this.returnUrl = qp.get('returnUrl') || '/home';
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      this.errorMessage = 'Please fill all required fields.';
      return;
    }

    const id = (this.identifier || '').trim();
    const pwd = this.password;

    if (!id || !pwd) {
      this.errorMessage = 'Please fill all required fields.';
      return;
    }

    this.errorMessage = null;
    this.loading = true;

    this.authService
      .login(id, pwd)
      .pipe(
        take(1),
        finalize(() => (this.loading = false))
      )
      .subscribe({
        next: (_user: User) => {
          this.errorMessage = null;
          this.router.navigateByUrl(this.returnUrl);
        },
        error: (err: any) => {
          // Keep global toast/handler behavior; also show a concise message locally.
          const msg = (err?.message || '').toLowerCase();

          if (msg.includes('user account does not exist')) {
            this.errorMessage = 'We couldn’t find an account with those details.';
          } else if (msg.includes('invalid') || msg.includes('credentials')) {
            this.errorMessage = 'Invalid credentials. Please try again.';
          } else {
            this.errorMessage = err?.message || 'Login failed.';
          }

          // Security nicety
          this.password = '';
        }
      });
  }
}
