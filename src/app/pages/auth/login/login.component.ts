import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthenticationService } from '../../../services/user.service';
import { User } from '../../../models/auth-model';  
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string | null = null;

  constructor(private authService: AuthenticationService, private router: Router) {}

  onSubmit(form: any): void {
    if (form.invalid) {
      this.errorMessage = 'Please fill all required fields.';
      return;
    }

    this.authService.login(this.username, this.password).subscribe({
      next: (user: User) => {
        this.errorMessage = null;
        this.router.navigate(['/']);
      },
      error: (err: any) => {
        this.errorMessage = err || 'Login failed.';
      }
    });
  }
}