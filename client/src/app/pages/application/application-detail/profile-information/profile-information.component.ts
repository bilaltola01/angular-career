import { Component, OnInit } from '@angular/core';
import { UserGeneralInfo, ProfileStatuses } from 'src/app/models';
import { Router, ActivatedRoute } from '@angular/router';
import { PositionService, CartService, HelperService, UserStateService, AlertsService, AlertType, ApplicationService, UserService, ScoreService, CompanyService } from 'src/app/services';
import { MatchingService } from 'src/app/services/matching.service';
import { SkillLevelDescription } from 'src/app/models';
import { MatDialog } from '@angular/material/dialog';
import { SkillDescriptionPopupComponent } from 'src/app/components/skill-description-popup/skill-description-popup.component';

@Component({
  selector: 'app-profile-information',
  templateUrl: './profile-information.component.html',
  styleUrls: ['./profile-information.component.scss']
})
export class ProfileInformationComponent implements OnInit {
  positionId;
  displayItemsLimit = 7;
  mathFloor = Math.floor;
  breakpoint: number;
  positionName = [];

  matchedSkills = [];
  missingSkills = [];
  matchedInterests = [];
  filter_list: boolean;
  isJobLoading = true;
  Object = Object;
  generalInfo: UserGeneralInfo;

  profileStatuses = ProfileStatuses;
  // new code
  experienceList;
  educationList;
  userPublicationsList;
  userProjectsList;
  userSkillsList = [];
  interestsList = [];
  //
  constructor(private positionService: PositionService,
    private matchingService: MatchingService,
    private helperService: HelperService,
    private alertsService: AlertsService,
    private userStateService: UserStateService,
    private router: Router,
    public dialog: MatDialog,
    private userService: UserService) {
  }

  ngOnInit() {
    this.getGeneralInfo();
    const urlObject = this.router.url.split('/');
    for (let i = 0; i < urlObject.length; i++) {
      if (i === 4) {
        this.positionId = parseInt(urlObject[i], 10);
      }
    }
    this.getMatchedSkill();
    this.getMissingSkill();
    this.getMatchedInterests();
    this.breakpoint = (window.innerWidth <= 500) ? 2 : 4;
    this.filter_list = false;
    this.getPositionData(this.positionId);
  }
  getGeneralInfo() {
    this.userStateService.getUser
      .subscribe(user => {
        this.getExperienceList(user.user_id);
        this.getEducationList(user.user_id);
        this.getUserPublicationsList(user.user_id);
        this.getUserProjectsList(user.user_id);
        this.getuserSkills(user.user_id);
        this.getInterestsList(user.user_id);
        this.generalInfo = user;
      }, error => {
        this.alertsService.show(error.message, AlertType.error);
      });
  }

  getPositionData(positionId) {
    this.positionService.getPosition(positionId).subscribe(
      dataJson => {
        this.isJobLoading = false;
        this.positionName.push(dataJson.data);
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
  //  new code
  getExperienceList(userId) {
    this.userService.getExperienceInfo(userId).subscribe(
      dataJson => {
        this.experienceList = dataJson['data'];
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }
  getYears(date1, date2) {
    const data = this.helperService.convertToyears(date1, date2);
    const result = data['_data'];
    if (result.years < 1) {
      return `${result.months} Months`;
    } else {
      if (result.months === 0) {
        return ` ${result.years} Years`;
      } else {
        return ` ${result.years} Years ${result.months} Months`;
      }
    }
  }
  getEducationList(userId) {
    this.userService.getEducationInfo(userId).subscribe(
      dataJson => {
        this.educationList = dataJson['data'];
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }
  getUserPublicationsList(userId) {
    this.userService.getPublicationsInfo(userId).subscribe(
      dataJson => {
        this.userPublicationsList = dataJson['data'];
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }
  getUserProjectsList(userId) {
    this.userService.getProjectsInfo(userId).subscribe(
      dataJson => {
        this.userProjectsList = dataJson['data']['data'];
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

  getuserSkills(userId) {
    this.userService.getUserSkills(userId).subscribe(
      dataJson => {
        this.userSkillsList = dataJson['data'];
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }
  getInterestsList(userId) {
    this.userService.getUserInterestsList(userId).subscribe(
      dataJson => {
        this.interestsList = dataJson['data'];
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
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
}
