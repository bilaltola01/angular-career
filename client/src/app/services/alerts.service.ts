import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {


  durationInSeconds = 5;

  private snackbarSubject = new Subject<any>();
  public snackbarState = this.snackbarSubject.asObservable();

  constructor() { }

  show(message: string, type?: string) {
    this.snackbarSubject.next({
      show: true,
      message,
      type
    });
  }
}
