import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  helper = new JwtHelperService();

  // store the URL so we can redirect after logging in
  public redirectUrl: string;
  private user_id = -1;

  private auth_service_url = `${environment.serverUrl}/${environment.auth_service}/api/${environment.api_version}/`;
  private user_service_url = `${environment.serverUrl}/${environment.user_service}/api/${environment.api_version}/`;

  constructor(private http: HttpClient) {
    if (this.isLoggedIn()) {
      const token = localStorage.getItem('token');
      this.user_id = this.helper.decodeToken(token).user_id;
    }
  }

  private httpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
  }

  private authHttpOptions() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token
      })
    };
  }

  public signUp(user): Observable<any> {
    return this.http.post(this.auth_service_url + 'register', user, this.httpOptions())
    .pipe(
      map(
        data => {
          if (data['token']) {
            return {success: true, message: data['message']};
          } else {
            return {success: false, message: data['message']};
          }
        }
      ),
      catchError(this.handleError)
    );
  }

  public login(user, isRemember: boolean): Observable<any> {
    return this.http.post(this.auth_service_url + 'login', user, this.httpOptions())
    .pipe(
      map(data => {
        if (data['token']) {
          localStorage.setItem('token', data['token']);
          if (isRemember) {
            localStorage.setItem('storedUser', JSON.stringify(user));
          } else {
            localStorage.setItem('storedUser', null);
          }
          this.user_id = this.helper.decodeToken(data['token']).user_id;
        }
        return {success: this.isLoggedIn(), message: data['message']};
      }),
      catchError(this.handleError)
    );
  }

  public checkStoredUser(): any {
    const user = localStorage.getItem('storedUser');
    return JSON.parse(user);
  }

  public emailVerification(user_id: string, verify_str: string, verify_key: string): Observable<any> {
    return this.http.get(this.auth_service_url + `user/${user_id}/${verify_str}/${verify_key}`, this.httpOptions())
    .pipe(
      map(data => {
        return {success: true, message: data['message']};
      }),
      catchError(this.handleError)
    );
  }

  public loadUsers(params: string): Observable<any> {

    return this.http.get(this.user_service_url + `users?${params}`, this.authHttpOptions())
    .pipe(
      map(data => {
        return {success: true, message: 'Success!', data: data};
      }),
      catchError(this.handleError)
    );
  }

  public logOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('storedUser');
  }

  public isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    let isLoggedIn = false;
    if (token) {
      isLoggedIn = true;
    }
    return isLoggedIn;
  }

  public resendEmail(email: object) {
    return this.http.post(this.auth_service_url + `send-email`, email, this.httpOptions())
    .pipe(
      map(data => {
        return {success: true, message: data['message']};
      }),
      catchError(this.handleError)
    );
  }

  public getGeneralInfo(): Observable<any> {
    return this.http.get(this.user_service_url + `user/${this.user_id}`, this.authHttpOptions())
    .pipe(
      map(data => {
        return {success: true, message: 'Success!', data: data};
      }),
      catchError(this.handleError)
    );
  }

  public updateGeneralInfo(generalInfo: any): Observable<any> {
    return this.http.patch(this.user_service_url + `user/${this.user_id}`, generalInfo, this.authHttpOptions())
    .pipe(
      map(data => {
        return {success: true, message: 'Success!', data: data};
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.message;
    } else {
      errorMessage = `Error Code: ${error.status}. Message: ${error.error.message}`;
    }
    return throwError({success: false, message: errorMessage});
  }
}
