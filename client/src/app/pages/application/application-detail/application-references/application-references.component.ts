import { Component, OnInit } from '@angular/core';
import { ApplicationService, AlertsService, AlertType } from 'src/app/services';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { RequestResponsePopupComponent } from 'src/app/components/request-response-popup/request-response-popup.component';
export interface DialogData {
  data: any;
}
@Component({
  selector: 'app-application-references',
  templateUrl: './application-references.component.html',
  styleUrls: ['./application-references.component.scss']
})
export class ApplicationReferencesComponent implements OnInit {
  applicationId;
  referenceData;
  isJobLoading: boolean;

  constructor(private router: Router, private route: ActivatedRoute, public dialog: MatDialog, private applicationService: ApplicationService, private alertsService: AlertsService, ) { }

  ngOnInit() {
    const urlObject = this.router.url.split('/');
    for (let i = 0; i < urlObject.length; i++) {
      if (i === 2) {
        this.applicationId = parseInt(urlObject[i], 10);
      }
    }
    this.getReferenceData(this.applicationId);
  }
  getReferenceData(applicationId) {
    this.isJobLoading = true;
    this.applicationService.getApplicationReferences(applicationId).subscribe(
      dataJson => {
        this.isJobLoading = false;
        this.referenceData = dataJson['data']['employee_references'];
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }
  openInterestLevelDialog(): void {
    const dialogRef = this.dialog.open(RequestResponsePopupComponent, {
      data: this.applicationId,
      width: '100vw',
      maxWidth: '800px',
      minWidth: '280px',
      panelClass: ['edit-dialog-container']
    });
  }

}
