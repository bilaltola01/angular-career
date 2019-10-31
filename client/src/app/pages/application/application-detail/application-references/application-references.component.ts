import { Component, OnInit } from '@angular/core';
import { ApplicationService, AlertsService, AlertType } from 'src/app/services';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-application-references',
  templateUrl: './application-references.component.html',
  styleUrls: ['./application-references.component.scss']
})
export class ApplicationReferencesComponent implements OnInit {
  applicationId;
  referenceData;
  isJobLoading: boolean;

  constructor(private router: Router, private route: ActivatedRoute, private applicationService: ApplicationService, private alertsService: AlertsService, ) { }

  ngOnInit() {
    const urlObject = this.router.url.split('/');
    for (let i = 0; i < urlObject.length; i++) {
      if (i === 3) {
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

}
