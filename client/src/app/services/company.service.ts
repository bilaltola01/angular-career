import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  helper = new JwtHelperService();
  private user_id = -1;

  private company_service_url = `${environment.serverUrl}/${environment.company_service}/api/${environment.api_version}/`;
  private company_url = `${environment.serverUrl}/${environment.company_service}/api/${environment.api_version}/company`;

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    if (token) {
      this.user_id = this.helper.decodeToken(token).user_id;
    }
  }

  public getCompanies(query: string): Observable<any> {
    return this.http.get(this.company_service_url + `companies?${query}`, this.authHttpOptions())
      .pipe(
        map(data => {
          return {success: true, message: 'Success!', data: data};
        }),
        catchError(this.handleError)

      );
  }

  public getCompanyById(companyId: number): Observable<any> {
    return this.http.get(this.company_service_url + `company/${companyId}`, this.authHttpOptions())
      .pipe(
        map(
          data => {
            return {success: true, message: 'Success!', data: data};
          }
        ),
        catchError(this.handleError)
      );
  }


  public postCompany(companyInfo: any): Observable<any> {
    return this.http.post(this.company_service_url + 'company', companyInfo, this.authHttpOptions())
      .pipe(
        map(
          data => {
            return {success: true, message: 'Success!', data: data};
          }
        ),
        catchError(this.handleError)
      );
  }

  public patchCompanyById(companyInfo: any, companyId: number): Observable<any> {
    return this.http.patch(this.company_service_url + `company/${companyId}`, companyInfo, this.authHttpOptions())
      .pipe(
        map(
          data => {
            return {success: true, message: 'Success!', data: data};
          }
        ),
        catchError(this.handleError)
      );
  }

  public getSignedS3Url(file: File, companyId: number): Observable<any> {
    const requestUrl =
      `${this.company_service_url}company/${companyId}/sign-s3?file-name=${file.name}&file-type=${file.type}&companyId=${companyId}`;

    return this.http.get(`${requestUrl}`, this.authHttpOptions())
      .pipe(
        map(data => {
          return {success: true, message: 'Success!', data: data};
        }),
        catchError(this.handleError));
  }

  public deleteCompanyIndustryById(companyId: number, industryId: number): Observable<any> {
    return this.http.delete(this.company_service_url + `company/${companyId}/industry/${industryId}`, this.authHttpOptions())
      .pipe(
        map(
          data => {
            return {success: true, message: 'Success!', data: data};
          }
        ),
        catchError(this.handleError)
      );
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
  getCompanyPositionData(queryParam) {
    let queryUrl = `${this.company_url}`;
    if (queryParam) {
      queryUrl = `${queryUrl}/${queryParam}/position-count`;
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
    if (!environment.production) {
      console.error(`UserService -> handleError -> error. Error Code: ${error.status}. Message: ${error.error.message ? error.error.message : error.statusText}. Details:`, error);
    }

    return throwError({success: false, message: error.error.message ? error.error.message : error.statusText});
  }
}
