import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  private user_id = -1;
  private application_service_url = `${environment.serverUrl}/${environment.application_service}/api/${environment.api_version}/`;

  helper = new JwtHelperService();

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    if (token) {
      this.user_id = this.helper.decodeToken(token).user_id;
    }
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

  private handleError(error) {
    if (!environment.production) {
      console.error(`UserService -> handleError -> error. Error Code: ${error.status}. Message: ${error.error.message ? error.error.message : error.statusText}. Details:`, error);
    }

    return throwError({success: false, message: error.error.message ? error.error.message : error.statusText});
  }

  public getWorkAuth(): Observable<any> {
    return this.http.get(this.application_service_url + 'work-auth', this.authHttpOptions())
    .pipe(
      map(data => {
        return {success: true, message: 'Success!', data: data};
      }),
      catchError(this.handleError)
    );
  }

  public postWorkAuth(postWorkAuthInfo: any): Observable<any> {
    return this.http.post(this.application_service_url + 'work-auth', postWorkAuthInfo, this.authHttpOptions())
    .pipe(
      map(data => {
        return {success: true, message: 'Success!', data: data};
      }),
      catchError(this.handleError)
    );
  }

  public putWorkAuth(putWorkAuthInfo: any): Observable<any> {
    return this.http.put(this.application_service_url + 'work-auth', putWorkAuthInfo, this.authHttpOptions())
    .pipe(
      map(data => {
        return {success: true, message: 'Success!', data: data};
      }),
      catchError(this.handleError)
    );
  }

  public getMilitaryInfo(): Observable<any> {
    return this.http.get(this.application_service_url + 'military-info', this.authHttpOptions())
    .pipe(
      map(data => {
        return {success: true, message: 'Success!', data: data};
      }),
      catchError(this.handleError)
    );
  }

  public postMilitaryInfo(postMilitaryInfo: any): Observable<any> {
    return this.http.post(this.application_service_url + 'military-info', postMilitaryInfo, this.authHttpOptions())
    .pipe(
      map(data => {
        return {success: true, message: 'Success!', data: data};
      }),
      catchError(this.handleError)
    );
  }

  public getCriminalHistory(): Observable<any> {
    return this.http.get(this.application_service_url + 'criminal-history', this.authHttpOptions())
    .pipe(
      map(data => {
        return {success: true, message: 'Success!', data: data};
      }),
      catchError(this.handleError)
    );
  }

  public postCriminalHistory(criminalHistory: any): Observable<any> {
    return this.http.post(this.application_service_url + 'criminal-history', criminalHistory, this.authHttpOptions())
    .pipe(
      map(data => {
        return {success: true, message: 'Success!', data: data};
      }),
      catchError(this.handleError)
    );
  }

  public putCriminalHistory(criminalHistory: any): Observable<any> {
    return this.http.put(this.application_service_url + 'criminal-history', criminalHistory, this.authHttpOptions())
    .pipe(
      map(data => {
        return {success: true, message: 'Success!', data: data};
      }),
      catchError(this.handleError)
    );
  }

  public deleteCriminalHistory(criminalHistoryId: number): Observable<any> {
    return this.http.delete(this.application_service_url + `criminal-history${criminalHistoryId}}`, this.authHttpOptions())
    .pipe(
      map(data => {
        return {success: true, message: 'Success!', data: data};
      }),
      catchError(this.handleError)
    );
  }

}
