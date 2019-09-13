import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PositionService, CartService, AlertsService, AlertType, ApplicationService, UserService, ScoreService, CompanyService } from 'src/app/services';
import { ActivatedRoute } from '@angular/router';
import { MatchingService } from 'src/app/services/matching.service';
import { SkillLevelDescription } from 'src/app/models';
import { MatDialog } from '@angular/material/dialog';
import { SkillDescriptionPopupComponent } from 'src/app/components/skill-description-popup/skill-description-popup.component';
import { AddSkillPopupComponent } from 'src/app/components/add-skill-popup/add-skill-popup.component';
import { ViewportScroller } from '@angular/common';

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
  appliedJobsMap = {};
  matchedSkills = [];
  missingSkills = [];
  matchedInterests = [];
  restrictedSchools;
  companyData = [];
  recruiterData = [];
  recruiterName;
  Difference_In_Days;
  displayItemsLimit = 7;
  SkillLevelDescription = SkillLevelDescription;
  updatedFitscoreData;
  filter_list: boolean;

  calculatedQualificationLevel: string;

  @ViewChild('one', {static: false}) positionInfo: ElementRef;
  @ViewChild('second', {static: false}) skills: ElementRef;
  // @ViewChild('3', {static: false}) interests: ElementRef;
  // @ViewChild('4', {static: false}) qualification: ElementRef;
  // @ViewChild('5', {static: false}) experience: ElementRef;
  // @ViewChild('6', {static: false}) jobDesc: ElementRef;
  // @ViewChild('7', {static: false}) school: ElementRef;
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
    this.getMatchedSkill();
    this.getMissingSkill();
    this.getMatchedInterests();
    this.getRestrcitedSchoolData(this.positionId);
    this.breakpoint = (window.innerWidth <= 500) ? 2 : 4;
    this.filter_list = true;
  }
  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 500) ? 2 : 6;
  }
  toggleTabMenuOpen() {
    this.filter_list = !this.filter_list;
  }
  getposition(positionId) {
    this.positionService.getPosition(positionId).subscribe(
      dataJson => {
        this.positionName.push(dataJson.data);
        this.getCompanyData(this.positionName[0].company_id);
        this.getRecruiterData(this.positionName[0].recruiter_id);
        this.countDays();
        this.calculatedQualificationLevel = this.calculateQualificationLevel(this.positionName[0].true_fitscore_info, this.positionName[0].minimum_skills);
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
      );


  }
  scroll() {
    this.positionInfo.nativeElement.scrollIntoView();
    this.skills.nativeElement.scrollIntoView();
  }
  getCompanyData(comapnyId) {
    this.companyService.getCompanyData(comapnyId).subscribe(
      dataJson => {
        this.companyData.push(dataJson.data);
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      });
  }
  getRecruiterData(recruterId) {
    this.userService.getGeneralInfo(recruterId).subscribe(
      dataJson => {
        this.recruiterName = dataJson.data['first_name'];
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
    this.scoreService.putSkillVector().subscribe();
    this.scoreService.getUpdatedfitscore(this.positionId).subscribe(
      dataJson => {
        this.updatedFitscoreData = [...dataJson.data['fitscores']];
        this.updatedFitscore();
      });
  }
  updatedFitscore() {
    this.positionName[0].true_fitscore_info = this.updatedFitscoreData;
    this.calculatedQualificationLevel = this.calculateQualificationLevel(this.positionName[0].true_fitscore_info, this.positionName[0].minimum_skills);
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
 const Difference_In_Time = todayDate.getTime() - postDate.getTime();
 this.Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
  }
}
