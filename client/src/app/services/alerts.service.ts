import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export enum AlertType {
  success = 'success',
  warning = 'warning',
  error = 'error',
}

@Injectable({
  providedIn: 'root'
})
export class AlertsService {
  private snackbarSubject = new Subject<any>();
  public snackbarState = this.snackbarSubject.asObservable();

  constructor() { }

  show(message: string, type?: AlertType) {
    this.snackbarSubject.next({
      show: true,
      message,
      type
    });
  }
}
