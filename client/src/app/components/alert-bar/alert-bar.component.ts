import { Component, OnInit, OnDestroy } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { AlertsService } from 'src/app/services/alerts.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'alert-bar',
  templateUrl: './alert-bar.component.html',
  styleUrls: ['./alert-bar.component.scss'],
  animations: [
    trigger('state', [
      transition(':enter', [
        style({ bottom: '-100px', transform: 'translate(-50%, 0%) scale(0.3)' }),
        animate('150ms cubic-bezier(0, 0, 0.2, 1)', style({
          transform: 'translate(-50%, 0%) scale(1)',
          opacity: 1,
          bottom: '20px'
        })),
      ]),
      transition(':leave', [
        animate('150ms cubic-bezier(0.4, 0.0, 1, 1)', style({
          transform: 'translate(-50%, 0%) scale(0.3)',
          opacity: 0,
          bottom: '-100px'
        }))
      ])
    ])
  ]
})
export class AlertBarComponent implements OnInit, OnDestroy {
  public show = false;
  public message = 'This is snackbar';
  public type = 'success';
  public snackbarSubscription: Subscription;

  constructor(private snackbarService: AlertsService) { }

  ngOnInit() {
    this.snackbarSubscription = this.snackbarService.snackbarState
    .subscribe(
      (state) => {
        if (state.type) {
          this.type = state.type;
        } else {
          this.type = 'success';
        }
        this.message = state.message;
        this.show = state.show;
        setTimeout(() => {
          this.show = false;
        }, 30000);
      });
  }

  close() {
    this.show = false;
  }

  ngOnDestroy() {
    this.snackbarSubscription.unsubscribe();
  }
}
