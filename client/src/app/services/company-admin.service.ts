import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class CompanyAdminService {

  helper = new JwtHelperService();
  private user_id = -1;

  private company_admin_service_url = `${environment.serverUrl}/${environment.company_admin_service}/api/${environment.api_version}/`;

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    if (token) {
      this.user_id = this.helper.decodeToken(token).user_id;
    }
  }

  public getAdminsByCompanyId(companyId: number): Observable<any> {
    return this.http.get(this.company_admin_service_url + `company/${companyId}/admins`, this.authHttpOptions())
      .pipe(
        map(data => {
          return {success: true, message: 'Success!', data: data};
        }),
        catchError(this.handleError)
      );
  }

  public postAdmin(adminInfo: any): Observable<any> {
    return this.http.post(this.company_admin_service_url + 'admin', adminInfo, this.authHttpOptions())
      .pipe(
        map(data => {
          return {success: true, message: 'Success!', data: data};
        }),
        catchError(this.handleError)
      );
  }

  public deleteCompanyAdminById(companyId: number, adminId: number): Observable<any> {
    return this.http.delete(this.company_admin_service_url + `company/${companyId}/admin/${adminId}`, this.authHttpOptions())
      .pipe(
        map(data => {
          return {success: true, message: 'Success!', data: data};
        }),
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

  private handleError(error) {
    if (!environment.production) {
      console.error(`UserService -> handleError -> error. Error Code: ${error.status}. Message: ${error.error.message ? error.error.message : error.statusText}. Details:`, error);
    }

    return throwError({success: false, message: error.error.message ? error.error.message : error.statusText});
  }
}
