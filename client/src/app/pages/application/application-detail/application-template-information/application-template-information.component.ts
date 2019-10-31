import { Component, OnInit } from '@angular/core';
import {
  HelperService,
  AlertsService,
  AlertType,
  ApplicationService
} from 'src/app/services';
import { Router, ActivatedRoute } from '@angular/router';



export interface DialogData {
  category: 'Criminal History';
  data: any;
  editIndex: number;
}
@Component({
  selector: 'app-application-template-information',
  templateUrl: './application-template-information.component.html',
  styleUrls: ['./application-template-information.component.scss']
})
export class ApplicationTemplateInformationComponent implements OnInit {



  workAuth;
  militaryService;
  criminalHistories;

  count: number;
  isLoading: boolean;
  applicationId;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private helperService: HelperService,
    private alertsService: AlertsService,
    private applicationService: ApplicationService,
  ) {
  }

  ngOnInit() {
    const urlObject = this.router.url.split('/');
    for (let i = 0; i < urlObject.length; i++) {
      if (i === 3) {
        this.applicationId = parseInt(urlObject[i], 10);
      }
    }
    this.initialize();
  }
  initialize() {
    this.getWorkAuthInfo(this.applicationId);
    this.getMilitaryServiceInfo(this.applicationId);
    this.getCriminalHistoriesInfo(this.applicationId);
  }

  getWorkAuthInfo(applicationId) {
    this.isLoading = true;
    this.applicationService.getApplicationWorkAuth(applicationId).subscribe(
      dataJson => {
        this.isLoading = false;
        this.workAuth = dataJson['data']['work_auth_info'];
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }
  getMilitaryServiceInfo(applicationId) {
    this.isLoading = true;
    this.applicationService.getApplicationMilitaryInfo(applicationId).subscribe(
      dataJson => {
        this.isLoading = false;
        this.militaryService = dataJson['data']['military_info'];
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }


  getCriminalHistoriesInfo(applicationId) {
    this.isLoading = true;
    this.applicationService.getApplicationCriminalHistory(applicationId).subscribe(
      dataJson => {
        this.isLoading = false;
        this.criminalHistories = dataJson['data']['criminal_history_info'];
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }
  onClickEdit() {
    this.router.navigate(['/my-template', 'edit'], { relativeTo: this.route });
  }
}
