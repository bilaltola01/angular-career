import { Component, OnInit } from '@angular/core';
import {
  UserService,
  AlertsService,
  AlertType,
  UserStateService,
  UserProfileStateService,
  ApplicationService
} from 'src/app/services';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { UserGeneralInfo } from 'src/app/models';


@Component({
  selector: 'app-references-section',
  templateUrl: './references-section.component.html',
  styleUrls: ['./references-section.component.scss']
})
export class ReferencesSectionComponent implements OnInit {

  userId: number;
  userReferenceList ;
  limit = 8;
  loadMore: boolean;
  offset: number;
  currentPage: string;
  user: UserGeneralInfo;

  constructor(
    private userService: UserService,
    private userStateService: UserStateService,
    private alertsService: AlertsService,
    private userProfileStateService: UserProfileStateService, private applicationService: ApplicationService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.userStateService.getUser.subscribe(user => {
      this.user = user;
    }, error => {
      this.alertsService.show(error.message, AlertType.error);
    });
    if (router.url.includes('user')) {
      this.userId = parseInt(router.url.split('/')[2], 10);
    }
    this.parseRouterUrl(router.url);
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.parseRouterUrl(val.url);
      }
    });
  }

  parseRouterUrl(url: string) {
    if (url.includes('references')) {
      if (url.includes('incoming-requests')) {
        this.currentPage = 'incoming-requests';
      } else {
        this.currentPage = 'references';
      }
    }
  }

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    this.loadMore = false;
    this.offset = 0;
    if (this.user) {
      this.getReferenceList();
    }
  }

  getReferenceList() {
    this.applicationService.getreferencerequest().subscribe(
      dataJSON => {
          this.userReferenceList = dataJSON.data['employee_reference_requests'];
    });
  }

  navigateToContacts() {
    this.router.navigate([this.userId ? `/user/${this.userId}/references` : '/my-references'], { relativeTo: this.route });
  }
  navigateToIncomingRequests() {
    this.router.navigate(['/my-references', 'incoming-requests'], { relativeTo: this.route });
  }


}
