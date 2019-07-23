import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap, map, finalize } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AutoCompleteService {

  private autocomplete_service_url = `${environment.serverUrl}/${environment.autocomplete_service}/api/${environment.api_version}/`;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(private http: HttpClient) { }

  public autoComplete(autostring: string, type: string): Observable<any> {
    return this.http.get(this.autocomplete_service_url + `autocomplete?autostring=${autostring}&type=${type}`, this.httpOptions)
    .pipe(
      map(
        data => {
          return {success: true, message: 'Success!', data: data};
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
      if (!environment.production) {
        console.error(`UserService -> handleError -> error. Error Code: ${error.status}. Message: ${error.error.message}. Details:`, error);
      }

      errorMessage = error.error.message;
    }
    return throwError({success: false, message: errorMessage});
  }
}
