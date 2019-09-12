import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class MatchingService {
  private user_id = -1;
  helper = new JwtHelperService();
  private skill_url = `${environment.serverUrl}/${environment.matching_service}/api/${environment.api_version}/user`;
  private company_url = `${environment.serverUrl}/${environment.company_service}/api/${environment.api_version}/company`;

  constructor(private http: HttpClient) {
    if (this.isLoggedIn()) {
      const token = localStorage.getItem('token');
      this.user_id = this.helper.decodeToken(token).user_id;
    }
   }
   public isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    let isLoggedIn = false;
    if (token) {
      isLoggedIn = true;
    }
    return isLoggedIn;
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


  getMatchedSkills(queryParam) {
    let queryUrl = `${this.skill_url}`;
    if (queryParam) {
      queryUrl = `${queryUrl}/${this.user_id}/position/${queryParam}/matching-skills`;
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
  getMissingSkills(queryParam) {
    let queryUrl = `${this.skill_url}`;
    if (queryParam) {
      queryUrl = `${queryUrl}/${this.user_id}/position/${queryParam}/missing-skills`;
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
  getinterests(queryParam) {
    let queryUrl = `${this.skill_url}`;
    if (queryParam) {
      queryUrl = `${queryUrl}/${this.user_id}/position/${queryParam}/matching-interests`;
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
  getCompanyData(queryParam) {
    let queryUrl = `${this.company_url}`;
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
