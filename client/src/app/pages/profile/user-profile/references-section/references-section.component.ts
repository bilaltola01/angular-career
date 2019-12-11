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
  userReferenceList;
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
    if (this.currentPage === 'references') {
      this.applicationService.getreferencerequest().subscribe(
        dataJson => {
          this.userReferenceList = dataJson.data['employee_reference_requests'];
        },
        error => {
          this.alertsService.show(error.message, AlertType.error);
        }
      );
    }
  }

  acceptReferenceRequest(reference, i) {
    this.applicationService.postUserReference(reference.application_id).subscribe(
      dataJson => {
        this.deleteReferenceRequest(reference, i);
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }
  deleteReferenceRequest(reference, i) {
    this.applicationService.deleteRequest(reference.application_id, reference.requesting_user_id, reference.employee_id).subscribe(
      dataJson => {
        this.userReferenceList.splice(i, 1);
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );

  }
}
