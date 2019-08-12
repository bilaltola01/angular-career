import { Component, OnInit } from '@angular/core';
import {
  HelperService,
  AlertsService,
  AlertType,
  ApplicationService
} from 'src/app/services';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-template-section',
  templateUrl: './template-section.component.html',
  styleUrls: ['./template-section.component.scss']
})
export class TemplateSectionComponent implements OnInit {

  workAuth: any;
  militaryService: any;
  internalTermsAndConditions: any;
  criminalHistories: any[];

  editMode: boolean;
  count: number;
  isLoading: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private helperService: HelperService,
    private alertsService: AlertsService,
    private applicationService: ApplicationService
  ) {
    this.parseRouterUrl(router.url);
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.parseRouterUrl(val.url);
      }
    });
  }

  ngOnInit() { }

  parseRouterUrl(url: string) {
    if (url.includes('edit')) {
      this.editMode = true;
    } else {
      this.editMode = false;
    }
    this.initialize();
  }

  initialize() {
    this.isLoading = true;
    this.count = 0;
    this.getWorkAuthInfo();
    this.getMilitaryServiceInfo();
    this.getCriminalHistoriesInfo();
  }

  getWorkAuthInfo() {
    this.applicationService.getWorkAuth().subscribe(
      dataJson => {
        this.workAuth = dataJson['data']['data'];
        this.count++;
        this.checkLoadingStatus();
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

  getMilitaryServiceInfo() {
    this.applicationService.getMilitaryInfo().subscribe(
      dataJson => {
        this.militaryService = dataJson['data']['data'];
        this.count++;
        this.checkLoadingStatus();
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

  getCriminalHistoriesInfo() {
    this.applicationService.getCriminalHistory().subscribe(
      dataJson => {
        this.criminalHistories = dataJson['data']['data'];
        this.count++;
        this.checkLoadingStatus();
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

  checkLoadingStatus() {
    if (this.count === 3) {
      this.isLoading = false;
    } else {
      this.isLoading = true;
    }
  }

}
