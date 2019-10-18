import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError, forkJoin } from 'rxjs';
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

  public saveJob(positionArr): Observable<any[]> {
    const queryUrl = `${this.cart_service_url}/user/cart`;
    const userId = this.helperService.extractUserId();
    const observableArr = [];

    for (let i = 0; i < positionArr.length; i++) {
      const body = {
        'positionId': positionArr[i].position_id,
        'userId': userId
      };
      observableArr[i] = this.http.post(queryUrl, body, this.authHttpOptions()).pipe(
        map(
          data => {
            return { success: true, message: 'Success!', data: data };
          }
        ),
        catchError(this.handleError)
      );
    }

    return forkJoin(observableArr);
  }

  public unSaveJob(positiondata): Observable<any> {
      const observableArr = [];
      for (let i = 0; i < positiondata.length; i++) {
        const headerOption = {
          headers: this.authHttpOptions().headers,
          body: {
            'positionId': positiondata[i].position_id,
            'userId': this.helperService.extractUserId()
          }
        };
       const queryUrl = `${this.cart_service_url}/user/cart`;
        observableArr[i] = this.http.delete(queryUrl, headerOption).pipe(
          map(
            data => {
              return data;
            }
          ),
          catchError(this.handleError)
        );
      }
      return forkJoin(observableArr);

  }

  public getSavedJobs(): Observable<any> {
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
