import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from './../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class RecruiterGuard implements CanActivate, CanActivateChild {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.checkUserRole(state.url);
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.checkUserRole(state.url);
  }

  checkUserRole(url: string): boolean {
    const currentRole = this.userService.checkCurrentRole();
    if (currentRole && currentRole === 1) {
      return true;
    } else {

      // Store the attempted URL for redirecting
      this.userService.redirectUrl = url;

      //  When we hit the RoleGuard this means that the user tries to access authenticated route so we display /401
      this.router.navigate(['/error'], {queryParams: {'status-code': 401}});
      return false;
    }
  }
}
