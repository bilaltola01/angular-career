import { Component, OnInit } from '@angular/core';
import {
  UserService,
  AlertsService,
  AlertType,
  UserProfileStateService
} from 'src/app/services';
import {
  UserGeneralInfo
} from 'src/app/models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  userId: number;

  isProfileLoading: boolean;
  currentPage: string;

  navMenu: any[];
  isNavMenuOpened: boolean;

  userGeneralInfo: UserGeneralInfo;

  constructor(
    private userService: UserService,
    private alertsService: AlertsService,
    private userProfileStateService: UserProfileStateService,
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.userId = parseInt(router.url.split('/')[2], 10);
    this.parseRouterUrl(router.url);
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.parseRouterUrl(val.url);
      }
    });
  }

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(['(max-width: 991px)'])
    .pipe(
      map(result => result.matches)
    );

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    this.isNavMenuOpened = false;
    this.isProfileLoading = true;
    this.getGeneralInfo();
  }

  parseRouterUrl(url: string) {
    if (url.includes('profile')) {
      this.currentPage = 'profile';
    } else if (url.includes('contacts')) {
      if (url.includes('incoming-requests')) {
        this.currentPage = 'incoming-requests';
      } else {
        this.currentPage = 'contacts';
      }
    } else  if (url.includes('template')) {
      this.currentPage = 'template';
    } else  if (url.includes('references')) {
      this.currentPage = 'references';
    }
  }

  onSelectNavItem(id: string) {
    let height = 130;
    if (document.getElementById('legend').clientHeight === 0) {
      height = 70;
    }
    document.getElementById('sidenav-content').scrollTop = document.getElementById(id).offsetTop - height;
    this.isNavMenuOpened = false;
  }

  onClickTogggle() {
    this.isNavMenuOpened = !this.isNavMenuOpened;
  }

  getGeneralInfo() {
    this.userService.getGeneralInfo(this.userId).subscribe(
      dataJson => {
        this.userGeneralInfo = dataJson['data'];
        if (this.isProfileLoading) {
          this.isProfileLoading = false;
        }
        this.userProfileStateService.setUser(this.userGeneralInfo);
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

}
