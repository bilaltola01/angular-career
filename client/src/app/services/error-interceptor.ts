import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserService } from './user.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class ErrorInterceptor implements HttpInterceptor {
  constructor(private userService: UserService,
              private router: Router) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(catchError(err => {
        this.determineActionBasedOnStatusCode(Number(err.status));

        return throwError(err);
      }));
  }

  private determineActionBasedOnStatusCode(statusCode: number): void {
    switch (statusCode) {
      // case 401: {
      //   this.userService.logOut();
      //   this.router.navigate(['/error'], {queryParams: {'status-code': statusCode}});
      //   break;
      // }
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
