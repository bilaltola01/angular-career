import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
<<<<<<< HEAD
import { JwtHelperService } from '@auth0/angular-jwt';

=======
import { HelperService } from './helper.service';
>>>>>>> Implemented Pagination and Improved UI.
@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

<<<<<<< HEAD
  private user_id = -1;
  private application_service_url = `${environment.serverUrl}/${environment.application_service}/api/${environment.api_version}/`;

  helper = new JwtHelperService();

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    if (token) {
      this.user_id = this.helper.decodeToken(token).user_id;
    }
=======
  private application_service_url = `${environment.serverUrl}/${environment.application_service}/api/${environment.api_version}/`;
  constructor(private http: HttpClient, private helperService: HelperService) {
>>>>>>> Implemented Pagination and Improved UI.
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

<<<<<<< HEAD
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

  public putCriminalHistory(criminalHistoryId: number, criminalHistory: any): Observable<any> {
    return this.http.put(this.application_service_url + `criminal-history/${criminalHistoryId}`, criminalHistory, this.authHttpOptions())
    .pipe(
      map(data => {
        return {success: true, message: 'Success!', data: data};
      }),
      catchError(this.handleError)
    );
  }

  public deleteCriminalHistory(criminalHistoryId: number): Observable<any> {
    return this.http.delete(this.application_service_url + `criminal-history/${criminalHistoryId}`, this.authHttpOptions())
    .pipe(
      map(data => {
        return {success: true, message: 'Success!', data: data};
      }),
      catchError(this.handleError)
    );
  }

=======
  public applyJob(position_id: number): Observable<any> {
    const queryUrl = `${this.application_service_url}application`;
    const body = {
      position_id: position_id,
      application_cover_letter: 'null'
    };
    return this.http.post(queryUrl, body, this.authHttpOptions())
      .pipe(
        map(
          data => {
            return { success: true, message: 'Success!', data: data };
          }
        ),
        catchError(this.handleError)
      );
  }


  public getAppliedJobs(): Observable<any> {
    const queryUrl = `${this.application_service_url}applications`;
    return this.http.post(queryUrl, this.authHttpOptions())
      .pipe(
        map(
          data => {
            return { success: true, message: 'Success!', data: data };
          }
        ),
        catchError(this.handleError)
      );
  }

  private handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.error.message}`;
    }
    return throwError({ success: false, message: errorMessage });
  }
>>>>>>> Implemented Pagination and Improved UI.
}
