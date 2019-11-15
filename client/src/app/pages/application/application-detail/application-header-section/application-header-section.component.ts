import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { AlertsService, AlertType, ApplicationService } from '../../../../services/index';
import { MatDialog } from '@angular/material/dialog';
import { InterestLevelPopupComponent } from 'src/app/components/interest-level-popup/interest-level-popup.component';

export interface DialogData {
  data: any;
}
@Component({
  selector: 'app-application-header-section',
  templateUrl: './application-header-section.component.html',
  styleUrls: ['./application-header-section.component.scss']
})
export class ApplicationHeaderSectionComponent implements OnInit {


  applicationNavMenu: any[];
  applicationNavIndex: number;
  applicationData = {};
  applicationId;
  positionId;
  searchQueryParam;
  isJobLoading: boolean;

  @Output() selectedNavItem = new EventEmitter();
  isNavMenuOpened: boolean;

  constructor(private alertsService: AlertsService,
    private router: Router,
    private route: ActivatedRoute,
    private applicationService: ApplicationService, public dialog: MatDialog) {
    this.updateInterestLevel = this.updateInterestLevel.bind(this);
    const urlParams = new URLSearchParams(window.location.search);
    this.searchQueryParam = urlParams.get('query');
    this.applicationId = this.route.snapshot.paramMap.get('application_id');
    this.positionId = this.route.snapshot.paramMap.get('position_id');
    this.parseRouterUrl(router.url);
    this.applicationId = parseInt(this.applicationId, 10);
    this.getApplicationData(this.applicationId);
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        if (val.url.includes('query')) {
          this.router.navigate(['/applications'], { queryParams: { search: this.searchQueryParam ? this.searchQueryParam : '' } });
        }
      }
    });
  }

  ngOnInit() {
    this.isNavMenuOpened = false;
  }
  parseRouterUrl(url: string) {
    if (!(url.includes('application-template-information' || 'application-references' || 'profile-information' || 'application-references'))) {
      this.router.navigate([`application-cover-letter`], { relativeTo: this.route });
    }
    if (url.includes('application-template-information')) {
      this.router.navigate([`application-template-information`], { relativeTo: this.route });

    } else if (url.includes('profile-information')) {
      this.router.navigate([`profile-information`], { relativeTo: this.route });

    } else if (url.includes('application-references')) {
      this.router.navigate([`application-references`], { relativeTo: this.route });

    } else if (url.includes('position-information')) {
      this.router.navigate([`position-information`], { relativeTo: this.route });

    }
  }
  onSelectNavItem(id: string) {
    const height = 100;
    document.getElementById('sidenav-content').scrollTop = document.getElementById(id).offsetTop - height;
    this.isNavMenuOpened = false;
  }

  getApplicationData(applicationId) {
    this.isJobLoading = true;
    this.applicationService.getApplication(applicationId).subscribe(
      dataJson => {
        this.isJobLoading = false;
        this.applicationData = dataJson.data;

      }
    );
  }
  onLevelChanged(level: number, application_id) {
    this.isJobLoading = true;
    const queryString = 'interest=' + level;
    this.applicationService.getAppliedJobs(queryString).subscribe(
      dataJson => {
        this.isJobLoading = false;
        if (dataJson.data.count > 0) {
          if (!(dataJson.data.data[0].application_id === application_id)) {
            this.openInterestLevelDialog(dataJson.data.data, level, application_id);
          }
        } else {
          this.setInterestLevel(level, application_id);
        }
      });

  }
  openInterestLevelDialog(data, level, application_id): void {
    const dialogRef = this.dialog.open(InterestLevelPopupComponent, {
      data: { data, level, application_id, callback: this.updateInterestLevel }
      ,
      width: '100vw',
      maxWidth: '800px',
      minWidth: '280px',
      panelClass: ['edit-dialog-container']
    });
  }
  updateInterestLevel() {
    this.getApplicationData(this.applicationId);
  }
  setInterestLevel(level: number, application_id) {
    this.isJobLoading = true;
    const interestLevelQuery = {
      'application_id': application_id,
      'interest_level': level
    };
    this.applicationService.patchInterestLevel(interestLevelQuery).subscribe(
      () => {
        this.isJobLoading = false;
        this.getApplicationData(this.applicationId);
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      });

  }
  onClose(application_id, level) {
    if (level > 0) {
      this.isJobLoading = true;
      const interestLevelQuery = {
        'application_id': application_id,
        'interest_level': 0
      };
      this.applicationService.patchInterestLevel(interestLevelQuery).subscribe(
        () => {
          this.isJobLoading = false;
          this.getApplicationData(this.applicationId);
        },
        error => {
          this.alertsService.show(error.message, AlertType.error);
        });
    }
  }
  withdrawApplication(application_id) {
    this.isJobLoading = true;
    this.applicationService.withdrawJobs(application_id).subscribe(data => {
      this.isJobLoading = false;
      this.router.navigate(['/applications']);
    },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      });
  }
  acceptOffer(applicationData) {
    this.applicationService.acceptOffer(applicationData).subscribe(
      (dataJson) => {
        this.getApplicationData(dataJson[0].application_id);
      });
  }
  rejectOffer(applicationData) {
    this.applicationService.rejectOffer(applicationData).subscribe((dataJson) => {
      this.getApplicationData(dataJson[0].application_id);
    });
  }
  interestHeading(interest_level) {
    if (interest_level === 0) {
      return 'Interested but still looking';
    } else if (interest_level === 1) {
      return 'Interested';
    } else if (interest_level === 2) {
      return 'Extremely interested';
    } else if (interest_level === 3) {
      return 'Excited to apply';
    } else if (interest_level === 4) {
      return 'Among top choices';
    } else if (interest_level === 5) {
      return 'Second choice';
    } else if (interest_level === 6) {
      return 'First choice';
    }
  }
}
