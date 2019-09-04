import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ScoreService {
  private user_id = -1;
  helper = new JwtHelperService();

  private fitscore_service_url = `${environment.serverUrl}/${environment.score_service}/api/${environment.api_version}/user/positions/calculated-fitscores`;
  private skill_vector_url = `${environment.serverUrl}/${environment.score_service}/api/${environment.api_version}/user`;
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

  public getUpdatedfitscore(queryParam) {
    let queryUrl = `${this.fitscore_service_url}`;
    if (queryParam) {
      queryUrl = `${queryUrl}?userId=${this.user_id}&${queryParam}`;
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

  public putSkillVector() {
    const queryUrl = `${this.skill_vector_url}/${this.user_id}/skills-vector`;
    return this.http.put(queryUrl, {}, this.authHttpOptions())
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
