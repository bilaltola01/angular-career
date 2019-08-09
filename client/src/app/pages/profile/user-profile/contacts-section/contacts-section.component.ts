import { Component, OnInit } from '@angular/core';
import {
  UserService,
  AlertsService,
  AlertType
} from 'src/app/services';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

@Component({
  selector: 'contacts-section',
  templateUrl: './contacts-section.component.html',
  styleUrls: ['./contacts-section.component.scss']
})
export class ContactsSectionComponent implements OnInit {

  userContactsList: any[];
  limit = 8;
  loadMore: boolean;
  offset: number;
  currentPage: string;

  constructor(
    private userService: UserService,
    private alertsService: AlertsService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.parseRouterUrl(router.url);
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.parseRouterUrl(val.url);
        this.initialize();
      }
    });
  }

  parseRouterUrl(url: string) {
    if (url.includes('incoming-requests')) {
      this.currentPage = 'incoming-requests';
    } else {
      this.currentPage = 'contacts';
    }
    this.initialize();
  }

  ngOnInit() { }

  initialize() {
    this.loadMore = false;
    this.offset = 0;
    this.userContactsList = null;
    if (this.currentPage === 'contacts') {
      this.getContactsList(this.offset);
    } else {

    }
  }

  getContactsList(offset: number) {
    this.userService.getUserContacts(1, this.limit, offset).subscribe(
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

  navigateToContacts() {
    this.router.navigate(['/my-contacts'], { relativeTo: this.route });
  }

  navigateToIncomingRequests() {
    this.router.navigate(['/my-contacts', 'incoming-requests'], { relativeTo: this.route });
  }

}
