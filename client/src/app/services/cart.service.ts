import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { HelperService } from './helper.service';
@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cart_service_url = `${environment.serverUrl}/${environment.cart_service}/api/${environment.api_version}/`;
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

  public saveJob(position_id: number): Observable<any> {
    const queryUrl = `${this.cart_service_url}/user/cart`;
    const body = {
      'positionId': position_id,
      'userId': this.helperService.extractUserId()
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

  public unSaveJob(position_id: number): Observable<any> {
    const queryUrl = `${this.cart_service_url}/user/cart`;
    const headerOption = {
      headers: this.authHttpOptions().headers,
      body: {
        'positionId': position_id,
        'userId': this.helperService.extractUserId()
      }
    };
    return this.http.delete(queryUrl, headerOption)
      .pipe(
        map(
          data => {
            return { success: true, message: 'Success!', data: data };
          }
        ),
        catchError(this.handleError)
      );
  }

  public getSavedJobs(queryString?: string): Observable<any> {
    const userId = this.helperService.extractUserId();
    const queryUrl = `${this.cart_service_url}/user/${userId}/cart`;
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
}
