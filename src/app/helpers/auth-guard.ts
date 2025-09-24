import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthenticationService } from '../services/user.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const currentUser = this.authenticationService.currentUserValue;

    if (currentUser && currentUser.token) {
      return true;
    }


    return this.router.createUrlTree(
      ['/auth/login'],
      //{ queryParams: { returnUrl: state.url } }
    );
  }
}
