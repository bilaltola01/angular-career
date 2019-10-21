import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { HelperService } from './helper.service';

@Injectable({
  providedIn: 'root'
})
export class PositionService {
  private position_service_url = `${environment.serverUrl}/${environment.position_service}/api/${environment.api_version}/`;
  private school_url = `${environment.serverUrl}/${environment.position_service}/api/${environment.api_version}/position/`;

  constructor(private http: HttpClient, private helperService: HelperService) {
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


  public getPositions(queryString?: string): Observable<any> {
    let queryUrl = `${this.position_service_url}Jobs`;
    if (queryString) {
      queryUrl = `${queryUrl}?${queryString}`;
    }
    return this.http.get(queryUrl, this.authHttpOptions())
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


  public getPosition(queryParam): Observable<any> {
    let queryUrl = `${this.position_service_url}full-position`;
    if (queryParam) {
      queryUrl = `${queryUrl}/${queryParam}`;
    }
    return this.http.get(queryUrl, this.authHttpOptions())
    .pipe(
        map(
          data => {
            return { success: true, message: 'Success!', data: data };
          }
        ),
        catchError(this.handleError)
      );
  }
  public getPositionsSaveJobData(queryString?: string): Observable<any> {
    const userId = this.helperService.extractUserId();
    let queryUrl = `${this.position_service_url}user/${userId}/saved-positions`;
    if (queryString) {
      queryUrl = `${queryUrl}?${queryString}`;
    }
    return this.http.get(queryUrl, this.authHttpOptions())
    .pipe(
        map(
          data => {
            return { success: true, message: 'Success!', data: data };
          }
        ),
        catchError(this.handleError)
      );
  }
 public getRestrictedSchool(queryParam) {
   let queryUrl = `${this.school_url}`;
   if ( queryParam) {
     queryUrl = `${queryUrl}${queryParam}/schools`;
   }
   return this.http.get(queryUrl, this.authHttpOptions())
   .pipe(
     map(
       data => {
         return { success: true, message: 'success!', data: data};
       }
     ),
     catchError(this.handleError)
   );
 }
}
