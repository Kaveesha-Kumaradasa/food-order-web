import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../services/user.service'; 

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss'],
  standalone: false
})
export class TopNavComponent {

  constructor(public auth: AuthenticationService, private router: Router) {}

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  onLogout() {
    this.auth.logout();
    this.router.navigate(['/auth/login']);
  }
}
