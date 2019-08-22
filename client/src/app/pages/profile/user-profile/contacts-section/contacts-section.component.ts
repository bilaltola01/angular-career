import { Component, OnInit } from '@angular/core';
import {
  UserService,
  AlertsService,
  AlertType,
  UserStateService,
  UserProfileStateService
} from 'src/app/services';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { UserGeneralInfo } from 'src/app/models';

@Component({
  selector: 'contacts-section',
  templateUrl: './contacts-section.component.html',
  styleUrls: ['./contacts-section.component.scss']
})
export class ContactsSectionComponent implements OnInit {

  userId: number;
  userContactsList: any[];
  limit = 8;
  loadMore: boolean;
  offset: number;
  currentPage: string;
  user: UserGeneralInfo;

  constructor(
    private userService: UserService,
    private userStateService: UserStateService,
    private alertsService: AlertsService,
    private userProfileStateService: UserProfileStateService,
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
    if (url.includes('contacts')) {
      if (url.includes('incoming-requests')) {
        this.currentPage = 'incoming-requests';
      } else {
        this.currentPage = 'contacts';
      }
    }
  }

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    this.loadMore = false;
    this.offset = 0;
    this.userContactsList = null;
    if (this.user || this.userId) {
      this.getContactsList(this.offset);
    }
  }

  getContactsList(offset: number) {
    if (this.currentPage === 'contacts') {
      this.userService.getUserContacts(this.userId ? this.userId : this.user.user_id, this.limit, offset).subscribe(
        dataJson => {
          if (offset === 0) {
            this.userContactsList = dataJson['data'];
          } else {
            this.userContactsList = this.userContactsList.slice().concat(dataJson['data']);
          }
          if (dataJson['data'].length === this.limit) {
            this.loadMore = true;
            this.offset = offset + this.limit;
          } else {
            this.loadMore = false;
          }
        },
        error => {
          this.alertsService.show(error.message, AlertType.error);
        }
      );
    } else {
      this.userService.getIncomingContactRequests(this.userId ? this.userId : this.user.user_id, this.limit, offset).subscribe(
        dataJson => {
          if (offset === 0) {
            this.userContactsList = dataJson['data'];
          } else {
            this.userContactsList = this.userContactsList.slice().concat(dataJson['data']);
          }
          if (dataJson['data'].length === this.limit) {
            this.loadMore = true;
            this.offset = offset + this.limit;
          } else {
            this.loadMore = false;
          }
        },
        error => {
          this.alertsService.show(error.message, AlertType.error);
        }
      );
    }
  }

  deleteContact(arrIndex: number) {
    this.userService.deleteUserContactById(this.userContactsList[arrIndex].user_id).subscribe(
      dataJson => {
        this.userContactsList.splice(arrIndex, 1);
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

  deleteContactRequest(arrIndex: number) {
    this.userService.deleteContactRequestsById(this.userContactsList[arrIndex].requested_contact_id, this.userContactsList[arrIndex].requesting_user_id).subscribe(
      dataJson => {
        this.userContactsList.splice(arrIndex, 1);
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

  acceptContactRequest(arrIndex: number) {
    this.userService.postUserContact({user_id: this.userContactsList[arrIndex].requested_contact_id, contact_id: this.userContactsList[arrIndex].requesting_user_id}).subscribe(
      dataJson => {
        this.userContactsList.splice(arrIndex, 1);
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

  navigateToContacts() {
    this.router.navigate([this.userId ? `/user/${this.userId}/contacts` : '/my-contacts'], { relativeTo: this.route });
  }

  navigateToIncomingRequests() {
    this.router.navigate(['/my-contacts', 'incoming-requests'], { relativeTo: this.route });
  }

}
