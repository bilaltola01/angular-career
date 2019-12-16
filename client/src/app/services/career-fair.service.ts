import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class CareerFairService {
  helper = new JwtHelperService();
  private user_id = -1;
  private career_fair_service_url = `${environment.serverUrl}/${environment.careerfair_service}/api/${environment.api_version}/`;
  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    if (token) {
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
  public getCareerFairs(queryString?: string): Observable<any> {
  const queryUrl = `${this.career_fair_service_url}careerfairs?${queryString}`;
  // console.log('query',queryUrl)
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
  public getCareerFairById(careerFairId: number): Observable<any> {
    const queryUrl = `${this.career_fair_service_url}careerfair/${careerFairId}`;
    // console.log('query',queryUrl)
    // console.log('id query',queryUrl)
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
    getCompaniesCount(careerFairId) {
      const queryUrl = `${this.career_fair_service_url}careerfair/${careerFairId}/companies-count`;
    // console.log('query',queryUrl)
    // console.log('id query',queryUrl)
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
    getPositionsCount(careerFairId) {
      const queryUrl = `${this.career_fair_service_url}careerfair/${careerFairId}/positions-count`;
    // console.log('query',queryUrl)
    // console.log('id query',queryUrl)
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
  getPresentcompanies(careerfairId, queryString?: string): Observable<any>  {
    const queryUrl = `${this.career_fair_service_url}careerfair/${careerfairId}/companies?${queryString}`;
    // console.log('query',queryUrl)
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
    if (!environment.production) {
      console.error(`UserService -> handleError -> error. Error Code: ${error.status}. Message: ${error.error.message ? error.error.message : error.statusText}. Details:`, error);
    }

    return throwError({success: false, message: error.error.message ? error.error.message : error.statusText});
  }
}
