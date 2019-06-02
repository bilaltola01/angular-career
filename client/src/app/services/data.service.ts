import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
// import { HttpModule } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) {

  }

  getTest() {
    return this.http.get(`http://localhost/user-service/api/v1/users?offset=0&limit=20&name=Dimi`);
  }
}
