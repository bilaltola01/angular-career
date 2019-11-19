import { Component, OnInit, } from '@angular/core';
import { PositionService, CartService, AlertsService, AlertType, ApplicationService, UserService, ScoreService, CompanyService, HelperService } from 'src/app/services';
import { Router, ActivatedRoute } from '@angular/router';
import { MatchingService } from 'src/app/services/matching.service';
import { SkillLevelDescription } from 'src/app/models';
import { MatDialog } from '@angular/material/dialog';
import { SkillDescriptionPopupComponent } from 'src/app/components/skill-description-popup/skill-description-popup.component';

@Component({
  selector: 'app-application-position-information',
  templateUrl: './application-position-information.component.html',
  styleUrls: ['./application-position-information.component.scss']
})
export class ApplicationPositionInformationComponent implements OnInit {

  positionId;

  mathFloor = Math.floor;
  breakpoint: number;
  positionName = [];
  jobDescription;
  matchedSkills = [];
  missingSkills = [];
  matchedInterests = [];
  restrictedSchools;
  recruiterData = {};
  displayItemsLimit = 7;
  displayIndustryLimit = 3;
  SkillLevelDescription = SkillLevelDescription;
  filter_list: boolean;
  isJobLoading = true;
  calculatedQualificationLevel: string;
  Object = Object;
  applicationId;
  constructor(private positionService: PositionService,
    private matchingService: MatchingService, private helperService: HelperService,
    private alertsService: AlertsService,
    public dialog: MatDialog,
    private router: Router,
    private userService: UserService) {
  }

  ngOnInit() {
    const urlObject = this.router.url.split('/');
    for (let i = 0; i < urlObject.length; i++) {
      if (i === 2) {
        this.applicationId = parseInt(urlObject[i], 10);
      } else if (i === 4) {
        this.positionId = parseInt(urlObject[i], 10);
      }
    }
    this.getposition(this.positionId);
    this.getMatchedSkill();
    this.getMissingSkill();
    this.getMatchedInterests();
    this.getRestrcitedSchoolData(this.positionId);
    this.breakpoint = (window.innerWidth <= 500) ? 2 : 4;
  }

  getDate(post_date) {
    this.helperService.convertToDays(post_date);
  }
  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 500) ? 2 : 4;
  }
  toggleTabOpen() {
    this.filter_list = !this.filter_list;
  }

  getposition(positionId) {
    this.isJobLoading = true;
    this.positionService.getPosition(positionId).subscribe(
      dataJson => {
        this.isJobLoading = false;
        this.positionName.push(dataJson.data);
        this.getRecruiterData(this.positionName[0].recruiter_id);
        this.getDate(this.positionName[0].post_date);
        this.countWords(this.positionName[0].position_desc);
        this.calculatedQualificationLevel = this.calculateQualificationLevel(this.positionName[0].true_fitscore_info, this.positionName[0].minimum_skills);
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }
  countWords(description) {
    if (description) {
      this.jobDescription = description.split(' ').length;
    }
  }
  getRecruiterData(recruterId) {
    this.userService.getGeneralInfo(recruterId).subscribe(
      dataJson => {

        this.recruiterData = dataJson.data;
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      });
  }

  getMatchedSkill() {
    this.matchingService.getMatchedSkills(this.positionId).subscribe(
      dataJson => {
        this.matchedSkills = dataJson.data['skills'];
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }
  getMissingSkill() {
    this.matchingService.getMissingSkills(this.positionId).subscribe(
      dataJson => {
        this.missingSkills = dataJson.data['skills'];
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }
  getMatchedInterests() {
    this.matchingService.getinterests(this.positionId).subscribe(
      dataJson => {
        this.matchedInterests = dataJson.data['interests'];
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }
  getRestrcitedSchoolData(positionId) {
    this.isJobLoading = true;
    this.positionService.getRestrictedSchool(positionId).subscribe(
      dataJson => {
        this.isJobLoading = false;
        this.restrictedSchools = dataJson.data['data'];
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );

  }
  calculateQualificationLevel(fitscoreInfo, minimum_skills) {
    if (!fitscoreInfo || (minimum_skills === null && fitscoreInfo.education_weight === 0 && fitscoreInfo.experience_weight === 0 && fitscoreInfo.interests_weight === 0 && fitscoreInfo.skills_weight === 0)) {
      return 'Unknown';
    } else if (fitscoreInfo.fitscore <= 0.2) {
      return 'Unqualified';
    } else if (fitscoreInfo.fitscore > 0.2 && fitscoreInfo.fitscore <= 0.6) {
      return 'Nascent';
    } else if (fitscoreInfo.fitscore > 0.6 && fitscoreInfo.fitscore <= 0.8) {
      return 'Qualified';
    } else if (fitscoreInfo.fitscore > 0.8 && fitscoreInfo.fitscore <= 0.9) {
      return 'Highly Qualified';
    } else if (fitscoreInfo.fitscore > 0.9 && fitscoreInfo.fitscore <= 1.0) {
      return 'Extremely Qualified';
    } else {
      return 'Unknown';
    }
  }
  openSkillDescriptionDialog() {
    const dialogRef = this.dialog.open(SkillDescriptionPopupComponent, {
      data: { skillDesc: SkillLevelDescription },
      width: '100vw',
      maxWidth: '880px',
      minWidth: '280px',
      panelClass: ['edit-dialog-container']
    });
  }
  scrollSmoothTo(id) {
    const height = 90;
    document.getElementById('sidenav-content').scrollTop = document.getElementById(id).offsetTop - height;
    this.filter_list = false;
  }

}
