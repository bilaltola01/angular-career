import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { UserService } from './../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    const url: string = state.url;

    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    if (this.userService.isLoggedIn()) {
      return true;
    }

    // Store the attempted URL for redirecting
    this.userService.redirectUrl = url;

    //  When we hit the AuthGuard this means that the user tries to access authenticated route so we display /401
    this.router.navigate(['/error'], {queryParams: {'status-code': 401}});
    return false;
  }
}
