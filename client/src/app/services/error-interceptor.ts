import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, pipe, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { UserService } from './user.service';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()

export class ErrorInterceptor implements HttpInterceptor {
  public jwtHelper = new JwtHelperService();

  constructor(private userService: UserService,
              private router: Router) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    let isExpired = false;

    if (token) {
      isExpired = this.jwtHelper.isTokenExpired(token);
    }

    if (!isExpired) {
      this.userService.getGeneralInfo()
        .subscribe((data: string) => {
          localStorage.setItem('token', data['data']);

          return next.handle(request)
            .pipe(catchError(err => {
              this.determineActionBasedOnStatusCode(Number(err.status));

              return throwError(err);
            }));
        });
    }

    return next.handle(request)
      .pipe(catchError(err => {
        this.determineActionBasedOnStatusCode(Number(err.status));

        return throwError(err);
      }));
  }

  private determineActionBasedOnStatusCode(statusCode: number): void {
    switch (statusCode) {
      case 404: {
        this.router.navigate(['/error'], {queryParams: {'status-code': statusCode}});
        break;
      }
      // if status code is 0 that means we have server side problem ( wrong headers, token or server is down )
      case 0: {
        this.userService.logOut();
        this.router.navigate(['/login']);
        break;
      }
    }
  }
}
