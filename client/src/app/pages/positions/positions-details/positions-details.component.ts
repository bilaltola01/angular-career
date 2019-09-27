import { Component, OnInit, } from '@angular/core';
import { PositionService, CartService, AlertsService, AlertType, ApplicationService, UserService, ScoreService, CompanyService } from 'src/app/services';
import { ActivatedRoute } from '@angular/router';
import { MatchingService } from 'src/app/services/matching.service';
import { SkillLevelDescription } from 'src/app/models';
import { MatDialog } from '@angular/material/dialog';
import { SkillDescriptionPopupComponent } from 'src/app/components/skill-description-popup/skill-description-popup.component';
import { AddSkillPopupComponent } from 'src/app/components/add-skill-popup/add-skill-popup.component';
import { element } from 'protractor';


@Component({
  selector: 'app-positions-details',
  templateUrl: './positions-details.component.html',
  styleUrls: ['./positions-details.component.scss']
})
export class PositionsDetailsComponent implements OnInit {
  positionId;
  mathFloor = Math.floor;
  today = new Date();
  breakpoint: number;
  positionName = [];
  savedJobsMap = {};
  savedJobs = [];
  jobDescription ;
  appliedJobsMap = {};
  appliedJobs = [];
  matchedSkills = [];
  missingSkills = [];
  matchedInterests = [];
  restrictedSchools;
  companyData = [];
  recruiterData = {};
  differenceInDays;
  newPositionCount = [];
  newCompanyPositions = {};
  positionsAvailable = 0;
  queryCallback;
  displayItemsLimit = 7;
  displayIndustryLimit = 3;
  SkillLevelDescription = SkillLevelDescription;
  updatedFitscoreData;
  filter_list: boolean;
  jobLowestEducationLevel;
  locationLength;

  calculatedQualificationLevel: string;
  Object = Object;
  constructor(private positionService: PositionService,
    private route: ActivatedRoute,
    private matchingService: MatchingService,
    private cartService: CartService,
    private alertsService: AlertsService,
    private applicationService: ApplicationService,
    public dialog: MatDialog, private scoreService: ScoreService, private companyService: CompanyService,
    private userService: UserService) {
    this.updateSkillCallback = this.updateSkillCallback.bind(this);
  }

  ngOnInit() {
    this.positionId = this.route.snapshot.paramMap.get('position_id');
    this.getposition(this.positionId);
    this.getAppliedJobs();
    this.getSavedJobs();
    this.getMatchedSkill();
    this.getMissingSkill();
    this.getMatchedInterests();
    this.getRestrcitedSchoolData(this.positionId);
    this.breakpoint = (window.innerWidth <= 500) ? 2 : 4;
    this.filter_list = false;
  }
  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 500) ? 2 : 6;
  }
  toggleTabOpen() {
    this.filter_list = !this.filter_list;
  }

  getposition(positionId) {
    this.positionService.getPosition(positionId).subscribe(
      dataJson => {
        this.positionName.push(dataJson.data);
        this.getCompanyData(this.positionName[0].company_id);
        this.getRecruiterData(this.positionName[0].recruiter_id);
        this.countDays();
        this.countWords(this.positionName[0].position_desc);
        if (this.positionName[0].preferred_education_levels) {
          this.getLowestEducationLevel(this.positionName[0].preferred_education_levels);
        }
        this.calculatedQualificationLevel = this.calculateQualificationLevel(this.positionName[0].true_fitscore_info, this.positionName[0].minimum_skills);
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }
  countWords(description) {
    if ( description) {
      this.jobDescription = description.split(' ').length;
    }
  }
  getLowestEducationLevel(lowestEducation) {
    let educationLowestLevel = lowestEducation.map(level => level.level);
    educationLowestLevel = Math.min(...educationLowestLevel);
    const index = lowestEducation.findIndex(lowestLevel => lowestLevel.level === educationLowestLevel);
    this.jobLowestEducationLevel = lowestEducation[index].education_level;
  }
  getCompanyData(comapnyId) {
    this.companyService.getCompanyData(comapnyId).subscribe(
      dataJson => {
        this.companyData.push(dataJson.data);
        this.getPositionCount(comapnyId);
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      });
  }
  getPositionCount(comapnyId) {
    this.companyService.getCompanyPositionData(comapnyId).subscribe(
      dataJson => {
        this.positionDataTransform(dataJson.data);
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }
  positionDataTransform(companyPositon) {
    const companyPositionKeys = this.Object.keys(companyPositon);
    const companyPositionValues = this.Object.values(companyPositon);
    companyPositionKeys.pop();
    for (const key of companyPositionKeys) {
      const result = key.split('_');
      result.pop();
      const keyString = result.join(' ');
      this.newPositionCount.push(keyString);
    }
    for (let i = 0; i < this.newPositionCount.length; i++) {
      if (companyPositionValues[i] > 0) {
        this.positionsAvailable++;
      }
      this.newCompanyPositions[this.newPositionCount[i]] = companyPositionValues[i];
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
    this.positionService.getRestrictedSchool(positionId).subscribe(
      dataJson => {
        this.restrictedSchools = dataJson.data['data'];
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );

  }
  getSavedJobs() {
    this.cartService.getSavedJobs()
      .subscribe((data: any) => {
        if (data.data && data.data.rows) {
          this.savedJobs = data.data.rows;
          for (const job of this.savedJobs) {
            this.savedJobsMap[job.position_id] = job.position_id;
          }
        }


      },
        error => {
          this.alertsService.show(error.message, AlertType.error);
        });
  }
  getAppliedJobs() {
    this.applicationService.getAppliedJobs()
      .subscribe(data => {
        if (data.data && data.data.data) {
          this.appliedJobs = data.data.data;
          for (const job of this.appliedJobs) {
            this.appliedJobsMap[job.position_id] = job.application_id;

          }
        }

      },
        error => {
          this.alertsService.show(error.message, AlertType.error);
        });
  }
  withdrawApplication(position_id) {
    const application_id = this.appliedJobsMap[position_id];
    this.applicationService.withdrawJobs(application_id).subscribe(data => {
      delete this.appliedJobsMap[position_id];
    },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      });
  }

  applyJob(positionArr) {
    this.applicationService.applyJob(positionArr)
      .subscribe(data => {
        for (const application of data) {
          this.appliedJobsMap[application.position_id] = application.application_id;
        }
        this.removePositionFromLocalCart(data);
      },
        error => {
          this.alertsService.show(error.message, AlertType.error);
        });
  }
  removePositionFromLocalCart(appliedJobs) {
    for (const jobs of appliedJobs) {
      delete this.savedJobsMap[jobs.position_id];
    }
  }
  saveJob(positionArr) {
    this.cartService.saveJob(positionArr).subscribe(data => {
      for (const position of positionArr) {
        this.savedJobsMap[position.position_id] = position.position_id;
      }
    },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      });
  }

  unSaveJob(position) {
    this.cartService.unSaveJob(position.position_id).subscribe(data => {
      delete this.savedJobsMap[position.position_id];
    },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      });
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

  openSkilladdDialog(skillData) {
    const dialogRef = this.dialog.open(AddSkillPopupComponent, {
      data: { skillData, callback: this.updateSkillCallback },
      width: '100vw',
      maxWidth: '880px',
      minWidth: '280px',
      panelClass: ['edit-dialog-container']
    });
  }

  updateSkillCallback() {
    this.scoreService.putSkillVector().subscribe(
      dataJson => {
        this.scoreService.getUpdatedfitscore(this.positionId).subscribe(
          data => {
            this.updatedFitscoreData = [...data.data['fitscores']];
            this.updatedFitscore();
          });

      });
  }
  updatedFitscore() {
    this.positionName[0].true_fitscore_info = this.updatedFitscoreData[0];
    this.calculatedQualificationLevel = this.calculateQualificationLevel(this.positionName[0].true_fitscore_info, this.positionName[0].minimum_skills);
    this.getMatchedSkill();
    this.getMissingSkill();
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
  countDays() {
    const date2 = new Date(this.positionName[0].post_date).toLocaleString().split(',')[0];
    const postDate = new Date(date2);
    const date = new Date().toLocaleString().split(',')[0];
    const todayDate = new Date(date);
    const differenceInTime = todayDate.getTime() - postDate.getTime();
    this.differenceInDays = differenceInTime / (1000 * 3600 * 24);
  }
  scrollSmoothTo(id) {
    const height = 70;
    document.getElementById('sidenav-content').scrollTop = document.getElementById(id).offsetTop - height;
    this.filter_list = false;
  }
}
