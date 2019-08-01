import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { UserService } from '../services';

@Injectable()

// This Guard is designed to not allow you to go to login, register page while logged in
export class UnauthGuard implements CanActivate, CanActivateChild {
  constructor(private userService: UserService,
              private router: Router) {
  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.checkIfNotLogged(state.url);
  }

  public canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.checkIfNotLogged(state.url);
  }

  private checkIfNotLogged(url: string): boolean {
    const isLogged: boolean = this.userService.isLoggedIn();

    if (!isLogged) {
      return true;
    }

    // we use my-profile as a default page when logged
    this.router.navigate(['/my-profile']);

    return false;
  }
}
