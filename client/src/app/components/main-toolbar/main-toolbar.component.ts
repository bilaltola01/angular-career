import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';
import { isDevMode } from '@angular/core';
import { UserGeneralInfo } from 'src/app/models';
import { AlertsService, AlertType } from 'src/app/services/alerts.service';
import { LocationStrategy } from '@angular/common';
import { PhotoStateService, UserStateService } from 'src/app/services';

@Component({
// tslint:disable-next-line: component-selector
  selector: 'main-toolbar',
  templateUrl: './main-toolbar.component.html',
  styleUrls: ['./main-toolbar.component.scss']
})
export class MainToolbarComponent implements OnInit {
  userGeneralInfo: UserGeneralInfo = new UserGeneralInfo();

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(['(max-width: 1250px)'])
    .pipe(
      map(result => result.matches)
    );

  constructor(private breakpointObserver: BreakpointObserver,
    private userService: UserService,
    private alertsService: AlertsService,
    public url: LocationStrategy,
    private photoStateService: PhotoStateService,
    private userStateService: UserStateService) {}

  ngOnInit() {
    // TODO: This get should be called only once and stored in browser storage in the user service
    this.getGeneralInfo();
    this.photoStateService.getPhoto
      .subscribe(photo => {
        this.userGeneralInfo.photo = photo;
      }, error => {
          this.alertsService.show(error.message, AlertType.error);
        });
  }

  getGeneralInfo() {
    this.userStateService.getUser
    .subscribe(user => {
      if (user) {
        this.userGeneralInfo = user;
      } else {
        this.userService.getGeneralInfo().subscribe(
          dataJson => {
            this.userGeneralInfo = dataJson['data'];
            // this.userStateService.setUser(this.userGeneralInfo);
          },
          error => {
            this.alertsService.show(error.message, AlertType.error);
          }
        );
      }
    }, error => {
      this.alertsService.show(error.message, AlertType.error);
    });
  }

  public isLoggedIn(): boolean {
    return this.userService.isLoggedIn();
  }

  public isDevelopmentEnv(): boolean {
    return isDevMode();
  }

  isCreatingProfile() {
    return this.url.path() === '/create-profile';
  }

  logOut() {
    this.userService.logOut();
  }

}
