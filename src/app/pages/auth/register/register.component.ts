import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthenticationService } from '../../../services/user.service';
import { User } from '../../../models/auth-model'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: false
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string | null = null;

  constructor(private authService: AuthenticationService, private router: Router) {}

  onSubmit(form: any): void {
    if (form.invalid) {
      this.errorMessage = 'Please fill all required fields.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.authService.register(this.email, this.password, this.username).subscribe({
      next: (user: User) => {
        this.errorMessage = null;
        this.router.navigate(['/']);
      },
      error: (err: any) => {
        this.errorMessage = err || 'Registration failed.';
      }
    });
  }
}