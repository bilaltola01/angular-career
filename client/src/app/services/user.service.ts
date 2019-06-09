import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap, map, finalize } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  // store the URL so we can redirect after logging in
  redirectUrl: string;

  private auth_service_url = environment.serverUrl + environment.auth_service + `api/${environment.api_version}/`;
  private user_service_url = environment.serverUrl + environment.user_service + `api/${environment.api_version}/`;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  private extractData(res: Response) {
    const body = res;
    return body || { };
  }

  constructor(private http: HttpClient) { }

  public signUp(user): Observable<any> {
    return this.http.post(this.auth_service_url + 'register', user, this.httpOptions)
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

  public login(user): Observable<any> {
    return this.http.post(this.auth_service_url + 'login', user, this.httpOptions)
    .pipe(
      map(data => {
        if (data['token']) {
          localStorage.setItem('token', data['token']);
        }
        return {success: this.isLoggedIn(), message: data['message']};
      }),
      catchError(this.handleError)
    );
  }

  public emailVerification(user_id: string, verify_str: string, verify_key: string): Observable<any> {
    return this.http.get(this.auth_service_url + `user/${user_id}/${verify_str}/${verify_key}`, this.httpOptions)
    .pipe(
      map(data => {
        return {success: true, message: data['message']};
      }),
      catchError(this.handleError)
    );
  }

  logOut() {
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    let isLoggedIn = false;
    if (token) {
      isLoggedIn = true;
    }
    return isLoggedIn;
  }

  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.error.message}`;
    }
    return throwError({success: false, message: errorMessage});
  }
}
