import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class PhotoStateService {
  public photo$: BehaviorSubject<any> = new BehaviorSubject(null);

  public get getPhoto(): Observable<any> {
    return this.photo$.asObservable();
  }

  public setPhoto(value: any) {
    this.photo$.next(value);
  }
}
