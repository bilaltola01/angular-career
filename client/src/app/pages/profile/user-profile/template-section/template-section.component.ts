import { Component, OnInit, Inject } from '@angular/core';
import {
  HelperService,
  AlertsService,
  AlertType,
  ApplicationService
} from 'src/app/services';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import {
  WorkAuthResponse,
  WorkAuthRequest,
  PROOF_AUTH_OPTIONS,
  MilitaryInfoResponse,
  MILITARY_STATUS_OPTIONS,
  MilitaryInfoRequest,
  CriminalHistoryRequest,
  CriminalHistoryResponse
} from 'src/app/models';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';

export interface DialogData {
  category: 'Criminal History';
  data: any;
  editIndex: number;
}

@Component({
  selector: 'app-template-section',
  templateUrl: './template-section.component.html',
  styleUrls: ['./template-section.component.scss']
})
export class TemplateSectionComponent implements OnInit {

  workAuth: WorkAuthResponse;
  militaryService: MilitaryInfoResponse;
  criminalHistories: CriminalHistoryResponse[];

  editMode: boolean;
  count: number;
  isLoading: boolean;

  proof_auth_options = PROOF_AUTH_OPTIONS;
  military_status_options = MILITARY_STATUS_OPTIONS;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private helperService: HelperService,
    private alertsService: AlertsService,
    private applicationService: ApplicationService,
    public dialog: MatDialog
  ) {
    this.parseRouterUrl(router.url);
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.parseRouterUrl(val.url);
      }
    });
  }

  ngOnInit() {
    this.initialize();
  }

  parseRouterUrl(url: string) {
    if (url.includes('template')) {
      if (url.includes('edit')) {
        this.editMode = true;
      } else {
        this.editMode = false;
      }
    }
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
        this.workAuth = dataJson['data']['work_auth_info'];
        this.count++;
        this.checkLoadingStatus();
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

  workAuthValueChanged($event: any) {
    const work_auth = $event.value;
    this.workAuth.work_auth = work_auth === 'Yes' ? 1 : 0;
    this.putWorkAuthInfo();
  }

  visaSupportValueChanged($event: any) {
    const visa_support = $event.value;
    this.workAuth.visa_support = visa_support === 'Yes' ? 1 : 0;
    this.putWorkAuthInfo();
  }

  proofAuthTypeChanged($event: any) {
    const proof_auth = $event.value !== 'None' ? $event.value : null;
    this.workAuth.proof_auth = proof_auth;
    this.putWorkAuthInfo();
  }

  militaryStatusChanged($event: any) {
    const military_status = $event.value;
    this.militaryService.military_status = military_status;
    this.postMilitaryServiceInfo();
  }

  putWorkAuthInfo() {
    const requestData: WorkAuthRequest = {
      proof_auth: this.workAuth.proof_auth,
      work_auth: this.workAuth.work_auth,
      visa_support: this.workAuth.visa_support
    };
    this.applicationService.putWorkAuth(requestData).subscribe(
      dataJson => {  },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

  getMilitaryServiceInfo() {
    this.applicationService.getMilitaryInfo().subscribe(
      dataJson => {
        this.militaryService = dataJson['data']['military_info'];
        if (this.militaryService.military_status === null) {
          this.militaryService.military_status = MILITARY_STATUS_OPTIONS[3];
          this.postMilitaryServiceInfo();
        } else {
          this.count++;
          this.checkLoadingStatus();
        }
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

  postMilitaryServiceInfo() {
    const postData: MilitaryInfoRequest = {
      military_status: this.militaryService.military_status,
      military_status_description: this.militaryService.military_status_description
    };
    this.applicationService.postMilitaryInfo(postData).subscribe(
      dataJson => {
        if (this.count < 3) {
          this.count++;
          this.checkLoadingStatus();
        }
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

  getCriminalHistoriesInfo() {
    this.applicationService.getCriminalHistory().subscribe(
      dataJson => {
        this.criminalHistories = dataJson['data']['criminal_history_info'];
        this.count++;
        this.checkLoadingStatus();
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

  deleteCriminalHistory(arrIndex: number) {
    this.applicationService.deleteCriminalHistory(this.criminalHistories[arrIndex].criminal_hist_id).subscribe(
      dataJson => {
        this.criminalHistories.splice(arrIndex, 1);
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

  onClickEdit() {
    this.router.navigate(['/my-template', 'edit'], { relativeTo: this.route });
  }

  openDialog(category: string, data: any, arrIndex: number = -1) {
    // tslint:disable-next-line: no-use-before-declare
    const dialgoRef = this.dialog.open(TemplateDialogContentComponent, {
      data: {
        category: category,
        data: data,
        editIndex: arrIndex
      },
      width: '100vw',
      maxWidth: '880px',
      minWidth: '280px',
      panelClass: ['edit-dialog-container']
    });
    dialgoRef.afterClosed().subscribe(result => {
      if (result) {
        switch (category) {
          case 'Criminal History':
            this.criminalHistories = result;
            break;
          default:
            break;
        }
      }
    });
  }

}

@Component({
  selector: 'template-dialog',
  templateUrl: './template-dialog.component.html',
  styleUrls: ['./template-dialog.component.scss'],
})


export class TemplateDialogContentComponent {
  criminalForm: FormGroup;
  request_criminal: CriminalHistoryRequest;
  maxDate = new Date();

  constructor(
    public dialogRef: MatDialogRef<TemplateDialogContentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private helperService: HelperService,
    private alertsService: AlertsService,
    private applicationService: ApplicationService
  ) {
    switch (data.category) {
      case 'Criminal History':
        this.initCriminalForm();
        break;
      default:
        break;
    }
  }

  initCriminalForm() {
    const data: CriminalHistoryResponse = this.data.editIndex !== -1 ? this.data.data[this.data.editIndex] : null;

    this.request_criminal = {
      arrest_date: data && data.arrest_date ? data.arrest_date : null,
      charge: data && data.charge ? data.charge : null,
      explanation: data && data.explanation ? data.explanation : null,
      criminal_hist_public: data && data.criminal_hist_public ? data.criminal_hist_public : null
    };

    this.criminalForm = new FormGroup({
      charge: new FormControl(data && data.charge ? data.charge : '', [Validators.required]),
      arrest_date: new FormControl(data && data.arrest_date ? this.helperService.convertToFormattedString(data.arrest_date, 'L') : ''),
      explanation: new FormControl(data && data.explanation ? data.explanation : '')
    });

    this.criminalForm.get('charge').valueChanges.subscribe(
      (charge) => {
        if (charge && this.helperService.checkSpacesString(charge)) {
          this.request_criminal.charge = charge;
        } else {
          this.request_criminal.charge = null;
        }
      }
    );
    this.criminalForm.get('explanation').valueChanges.subscribe(
      (explanation) => {
        if (explanation && this.helperService.checkSpacesString(explanation)) {
          this.request_criminal.explanation = explanation;
        } else {
          this.request_criminal.explanation = null;
        }
      }
    );
    this.criminalForm.get('arrest_date').valueChanges.subscribe(
      (arrest_date) => {
        if (arrest_date && this.helperService.checkSpacesString(arrest_date)) {
          this.request_criminal.arrest_date = arrest_date;
        } else {
          this.request_criminal.arrest_date = null;
        }
      }
    );
  }

  onChangeArrestDate(date: any) {
    if (date.value) {
      this.criminalForm.get('arrest_date').setValue(this.helperService.convertToFormattedString(date.value, 'L'));
    } else {
      this.criminalForm.get('arrest_date').setValue('');
    }
  }

  checkChargeValidation(): boolean {
    const charge = this.criminalForm.get('charge').value;
    if (charge && this.helperService.checkSpacesString(charge)) {
      return true;
    } else {
      return false;
    }
  }

  addCriminalHistory() {
    this.applicationService.postCriminalHistory({post_criminal_history: [this.request_criminal]}).subscribe(
      dataJson => {
        this.getCriminalHistoriesInfo();
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

  updateCriminalHistory() {
    this.applicationService.putCriminalHistory(this.data.data[this.data.editIndex].criminal_hist_id, this.request_criminal).subscribe(
      dataJson => {
        this.getCriminalHistoriesInfo();
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

  getCriminalHistoriesInfo() {
    this.applicationService.getCriminalHistory().subscribe(
      dataJson => {
        this.dialogRef.close(dataJson['data']['criminal_history_info']);
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
