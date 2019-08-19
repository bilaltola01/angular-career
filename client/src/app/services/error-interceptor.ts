import { Injectable, Injector } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { UserService } from './user.service';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()

export class ErrorInterceptor implements HttpInterceptor {
  public jwtHelper = new JwtHelperService();

  constructor(private router: Router,
              private injector: Injector) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    const userService = this.injector.get(UserService);

    return next.handle(request)
      .pipe(
        catchError(err => {
          let isExpired = false;

          if (token) {
            isExpired = this.jwtHelper.isTokenExpired(token);
          }

          if (isExpired) {
            return userService.refreshToken()
              .pipe(
                switchMap((data: any) => {
                  if (data.success) {
                    localStorage.setItem('token', data['data']);
                  } else {
                    return throwError(err);
                  }

                  const constructedRequest = request.clone({
                    headers: request.headers
                      .set('Authorization', `Bearer ${localStorage.getItem('token')}`)
                      .set('Content-Type', 'application/json')
                  });

                  this.handleError(constructedRequest, next);
                }));
          } else {
            this.handleError(request, next);
          }
        })
      );
  }

  private handleError(request: HttpRequest<any>, next: HttpHandler) {
    return next.handle(request)
      .pipe(
        catchError((err) => {
          this.determineActionBasedOnStatusCode(Number(err.status));

          return throwError(err);
        }));
  }

  private determineActionBasedOnStatusCode(statusCode: number): void {
    const userService = this.injector.get(UserService);

    switch (statusCode) {
      case 404: {
        this.router.navigate(['/error'], {queryParams: {'status-code': statusCode}});
        break;
      }
      // if status code is 0 that means we have server side problem ( wrong headers, token or server is down )
      // case 0: {
      //   userService.logOut();
      //   this.router.navigate(['/login']);
      //   break;
      // }
    }
  }
}
