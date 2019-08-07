import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UserStateService {
  public user$: BehaviorSubject<any> = new BehaviorSubject(null);

  public get getUser(): Observable<any> {
    return this.user$.asObservable();
  }

  public setUser(value: any) {
    this.user$.next(value);
  }
}
