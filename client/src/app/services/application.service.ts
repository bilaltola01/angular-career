import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError, forkJoin } from 'rxjs';
import { environment } from '../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HelperService } from './helper.service';
import { query } from '@angular/animations';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  private user_id = -1;
  private application_service_url = `${environment.serverUrl}/${environment.application_service}/api/${environment.api_version}/`;

  helper = new JwtHelperService();
  public redirectUrl: string;

  constructor(private http: HttpClient, private helperService: HelperService) {
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

    return throwError({ success: false, message: error.error.message ? error.error.message : error.statusText });
  }

  public getWorkAuth(): Observable<any> {
    return this.http.get(this.application_service_url + 'work-auth', this.authHttpOptions())
      .pipe(
        map(data => {
          return { success: true, message: 'Success!', data: data };
        }),
        catchError(this.handleError)
      );
  }

  public getApplicationWorkAuth(queryParam): Observable<any> {
    let queryUrl = `${this.application_service_url}application`;
    if (queryParam) {
      queryUrl = `${this.application_service_url}application/${queryParam}/work-auth`;
    }
    return this.http.get(queryUrl, this.authHttpOptions())
      .pipe(
        map(data => {
          return { success: true, message: 'Success!', data: data };
        }),
        catchError(this.handleError)
      );
  }
  public findExistingEmployeeReference(applicationid, employeeId) {
    const queryUrl = `${this.application_service_url}application/${applicationid}/requesting-user/${this.user_id}/employee/${employeeId}/employee-reference/request`;
    return this.http.get(queryUrl, this.authHttpOptions())
      .pipe(
        map(data => {
          return { success: true, message: 'Success!', data: data };
        }),
        catchError(this.handleError)
      );
  }
  public deleteEmployeeRequest(applicationid, employeeId) {
    const queryUrl = `${this.application_service_url}application/${applicationid}/requesting-user/${this.user_id}/employee/${employeeId}/employee-reference/request`;
    return this.http.delete(queryUrl, this.authHttpOptions())
      .pipe(
        map(data => {
          return { success: true, message: 'Success!', data: data };
        }),
        catchError(this.handleError)
      );
  }
  public postWorkAuth(postWorkAuthInfo: any): Observable<any> {
    return this.http.post(this.application_service_url + 'work-auth', postWorkAuthInfo, this.authHttpOptions())
      .pipe(
        map(data => {
          return { success: true, message: 'Success!', data: data };
        }),
        catchError(this.handleError)
      );
  }

  public putWorkAuth(putWorkAuthInfo: any): Observable<any> {
    return this.http.put(this.application_service_url + 'work-auth', putWorkAuthInfo, this.authHttpOptions())
      .pipe(
        map(data => {
          return { success: true, message: 'Success!', data: data };
        }),
        catchError(this.handleError)
      );
  }

  public getMilitaryInfo(): Observable<any> {
    return this.http.get(this.application_service_url + 'military-info', this.authHttpOptions())
      .pipe(
        map(data => {
          return { success: true, message: 'Success!', data: data };
        }),
        catchError(this.handleError)
      );
  }
  public getApplicationMilitaryInfo(queryParam): Observable<any> {
    let queryUrl = `${this.application_service_url}application`;
    if (queryParam) {
      queryUrl = `${this.application_service_url}application/${queryParam}/military-info`;
    }
    return this.http.get(queryUrl, this.authHttpOptions())
      .pipe(
        map(data => {
          return { success: true, message: 'Success!', data: data };
        }),
        catchError(this.handleError)
      );
  }
  public getApplicationReferences(queryParam): Observable<any> {
    let queryUrl = `${this.application_service_url}application`;
    if (queryParam) {
      queryUrl = `${this.application_service_url}application/${queryParam}/employee-references`;
    }
    return this.http.get(queryUrl, this.authHttpOptions())
      .pipe(
        map(data => {
          return { success: true, message: 'Success!', data: data };
        }),
        catchError(this.handleError)
      );
  }
  public postMilitaryInfo(postMilitaryInfo: any): Observable<any> {
    return this.http.post(this.application_service_url + 'military-info', postMilitaryInfo, this.authHttpOptions())
      .pipe(
        map(data => {
          return { success: true, message: 'Success!', data: data };
        }),
        catchError(this.handleError)
      );
  }

  public getCriminalHistory(): Observable<any> {

    return this.http.get(this.application_service_url + 'criminal-history', this.authHttpOptions())
      .pipe(
        map(data => {
          return { success: true, message: 'Success!', data: data };
        }),
        catchError(this.handleError)
      );
  }
  public getApplicationCriminalHistory(queryParam): Observable<any> {
    let queryUrl = `${this.application_service_url}application`;
    if (queryParam) {
      queryUrl = `${this.application_service_url}application/${queryParam}/criminal-history`;
    }
    return this.http.get(queryUrl, this.authHttpOptions())
      .pipe(
        map(data => {
          return { success: true, message: 'Success!', data: data };
        }),
        catchError(this.handleError)
      );
  }

  public postCriminalHistory(criminalHistory: any): Observable<any> {
    return this.http.post(this.application_service_url + 'criminal-history', criminalHistory, this.authHttpOptions())
      .pipe(
        map(data => {
          return { success: true, message: 'Success!', data: data };
        }),
        catchError(this.handleError)
      );
  }

  public putCriminalHistory(criminalHistoryId: number, criminalHistory: any): Observable<any> {
    return this.http.put(this.application_service_url + `criminal-history/${criminalHistoryId}`, criminalHistory, this.authHttpOptions())
      .pipe(
        map(data => {
          return { success: true, message: 'Success!', data: data };
        }),
        catchError(this.handleError)
      );
  }

  public deleteCriminalHistory(criminalHistoryId: number): Observable<any> {
    return this.http.delete(this.application_service_url + `criminal-history/${criminalHistoryId}`, this.authHttpOptions())
      .pipe(
        map(data => {
          return { success: true, message: 'Success!', data: data };
        }),
        catchError(this.handleError)
      );
  }
  public applyJob(positionArr): Observable<any> {
    const queryUrl = `${this.application_service_url}application`;
    const observableArr = [];
    for (let i = 0; i < positionArr.length; i++) {
      const body = {
        position_id: positionArr[i].position_id,
        application_cover_letter: 'null'
      };
      observableArr[i] = this.http.post(queryUrl, body, this.authHttpOptions()).pipe(
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


  public getAppliedJobs(queryParam?): Observable<any> {
    let queryUrl;
    if (queryParam) {
      queryUrl = `${this.application_service_url}applications?${queryParam}`;
    } else {
      queryUrl = `${this.application_service_url}applications`;
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
  public getApplication(queryParam) {
    const queryUrl = `${this.application_service_url}application/${queryParam}`;
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

  public patchInterestLevel(bodyQueryParam): Observable<any> {
    const queryUrl = `${this.application_service_url}application`;
    return this.http.patch(queryUrl, bodyQueryParam, this.authHttpOptions())
      .pipe(
        map(
          data => {
            return { success: true, message: 'Success!', data: data };
          }
        ),
        catchError(this.handleError)
      );
  }
  public patchCoverLetter(bodyQueryParam) {
    const queryUrl = `${this.application_service_url}application`;
    return this.http.patch(queryUrl, bodyQueryParam, this.authHttpOptions())
      .pipe(
        map(
          data => {
            return { success: true, message: 'Success!', data: data };
          }
        ),
        catchError(this.handleError)
      );
  }
  public postReferenceRequest(bodyQueryParam) {
    const queryUrl = `${this.application_service_url}application/employee-reference/request`;
    return this.http.post(queryUrl, bodyQueryParam, this.authHttpOptions())
      .pipe(
        map(
          data => {
            return { success: true, message: 'Success!', data: data };
          }
        ),
        catchError(this.handleError)
      );
  }
  public getreferencerequest() {
    const queryUrl = `${this.application_service_url}application/employee-reference/requests`;
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
  public postUserReference(bodyQueryParam) {
    const queryUrl = `${this.application_service_url}application/${bodyQueryParam}/employee-reference`;
    return this.http.post(queryUrl, bodyQueryParam, this.authHttpOptions())
      .pipe(
        map(
          data => {
            return { success: true, message: 'Success!', data: data };
          }
        ),
        catchError(this.handleError)
      );
  }
  public deleteRequest(applicationId, userId, employeeId) {
    return this.http.delete(this.application_service_url + `application/${applicationId}/requesting-user/${userId}/employee/${employeeId}/employee-reference/request`, this.authHttpOptions())
      .pipe(
        map(data => {
          return { success: true, message: 'Success!', data: data };
        }),
        catchError(this.handleError)
      );
  }
  public acceptOffer(queryParam): Observable<any> {
    const observableArr = [];
    for (let i = 0; i < queryParam.length; i++) {
      const queryBody = {
        'application_id': queryParam[i].application_id,
        'accepted': 1
      };
      const queryUrl = `${this.application_service_url}application`;
      observableArr[i] = this.http.patch(queryUrl, queryBody, this.authHttpOptions()).pipe(
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

  public rejectOffer(queryParam): Observable<any> {
    const observableArr = [];
    for (let i = 0; i < queryParam.length; i++) {
      const queryBody = {
        'application_id': queryParam[i].application_id,
        'rejected': 1
      };
      const queryUrl = `${this.application_service_url}application`;
      observableArr[i] = this.http.patch(queryUrl, queryBody, this.authHttpOptions()).pipe(
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


  public withdrawJobs(applicationData): Observable<any> {
    let queryUrl;
    const headerOption = {
      headers: this.authHttpOptions().headers
    };
    if (typeof applicationData === 'number') {
      queryUrl = `${this.application_service_url}application/${applicationData}`;
      return this.http.delete(queryUrl, headerOption)
        .pipe(
          map(
            data => {
              return { success: true, message: 'Success!', data: data };
            }
          ),
          catchError(this.handleError)
        );
    } else {
      const observableArr = [];
      for (let i = 0; i < applicationData.length; i++) {
        queryUrl = `${this.application_service_url}application/${applicationData[i].application_id}`;
        observableArr[i] = this.http.delete(queryUrl, this.authHttpOptions()).pipe(
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
  }
}
