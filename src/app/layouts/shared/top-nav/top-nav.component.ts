import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss'],
  standalone: false
})
export class TopNavComponent {
  constructor(private router: Router) {}


  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}