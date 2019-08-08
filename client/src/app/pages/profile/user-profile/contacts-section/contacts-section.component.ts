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

  constructor(
    private userService: UserService,
    private alertsService: AlertsService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.initialize();
      }
    });
  }

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    this.loadMore = false;
    this.offset = 0;
    this.userContactsList = null;
    this.getContactsList(this.offset);
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

}
