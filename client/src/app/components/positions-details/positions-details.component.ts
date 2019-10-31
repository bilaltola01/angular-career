import { Component, OnInit, } from '@angular/core';
import { PositionService, CartService, AlertsService, AlertType, ApplicationService, UserService, ScoreService, CompanyService, HelperService } from 'src/app/services';
import { ActivatedRoute } from '@angular/router';
import { MatchingService } from 'src/app/services/matching.service';
import { SkillLevelDescription, Skill } from 'src/app/models';
import { MatDialog } from '@angular/material/dialog';
import { SkillDescriptionPopupComponent } from 'src/app/components/skill-description-popup/skill-description-popup.component';
import { AddSkillPopupComponent } from 'src/app/components/add-skill-popup/add-skill-popup.component';
import { element } from 'protractor';
import { FormGroup, FormControl } from '@angular/forms';



@Component({
  selector: 'app-positions-details',
  templateUrl: './positions-details.component.html',
  styleUrls: ['./positions-details.component.scss']
})
export class PositionsDetailsComponent implements OnInit {
  positionId;

  mathFloor = Math.floor;
  breakpoint: number;
  positionName = [];
  savedJobsMap = {};
  savedJobs = [];
  jobDescription;
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
  queryCallback;
  displayItemsLimit = 7;
  displayIndustryLimit = 3;
  SkillLevelDescription = SkillLevelDescription;
  updatedFitscoreData;
  filter_list: boolean;
  locationLength;
  isJobLoading = true;
  calculatedQualificationLevel: string;
  Object = Object;

  preferredSkillsSearchForm: FormGroup;
  requiredSkillsSearchForm: FormGroup;

  autocomplete_preferred_skills: Skill[] = [];
  autocomplete_required_skills: Skill[] = [];

  temp_preferred_skill: Skill;
  temp_required_skill: Skill;

  constructor(private positionService: PositionService,
    private route: ActivatedRoute,
    private matchingService: MatchingService,
    private cartService: CartService,
    private alertsService: AlertsService,
    private applicationService: ApplicationService, private helperService: HelperService,
    public dialog: MatDialog, private scoreService: ScoreService, private companyService: CompanyService,
    private userService: UserService) {
    this.updateSkillCallback = this.updateSkillCallback.bind(this);
  }

  ngOnInit() {
    this.getAppliedJobs();
    this.getSavedJobs();
    this.positionId = this.route.snapshot.paramMap.get('position_id');
    this.getposition(this.positionId);
    this.getMatchedSkill();
    this.getMissingSkill();
    this.getMatchedInterests();
    this.getRestrcitedSchoolData(this.positionId);
    this.breakpoint = (window.innerWidth <= 500) ? 2 : 4;
    this.filter_list = false;
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
        this.getCompanyData(this.positionName[0].company_id);
        this.getRecruiterData(this.positionName[0].recruiter_id);
        this.countWords(this.positionName[0].position_desc);
        this.calculatedQualificationLevel = this.calculateQualificationLevel(this.positionName[0].true_fitscore_info, this.positionName[0].minimum_skills);
        this.initPreferredSkillsSearchForm();
        this.initRequiredSkillsSearchForm();
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

  initPreferredSkillsSearchForm() {
    this.autocomplete_preferred_skills = [];
    this.temp_preferred_skill = null;

    this.preferredSkillsSearchForm = new FormGroup({
      preferred_skill: new FormControl('')
    });

    this.preferredSkillsSearchForm.get('preferred_skill').valueChanges.subscribe(
      (skill) => {
        if (skill && this.helperService.checkSpacesString(skill)) {
          this.autocomplete_preferred_skills = this.positionName[0].preferred_skills.filter(value => value.skill.toLocaleLowerCase().includes(skill));
        } else {
          this.autocomplete_preferred_skills = [];
        }
      }
    );
  }

  selectPreferredSkill(preferred_skill: Skill) {
    this.temp_preferred_skill = preferred_skill;
    this.preferredSkillsSearchForm.get('preferred_skill').setValue('');
  }

  initRequiredSkillsSearchForm() {
    this.autocomplete_required_skills = [];
    this.temp_required_skill = null;

    this.requiredSkillsSearchForm = new FormGroup({
      required_skill: new FormControl('')
    });

    this.requiredSkillsSearchForm.get('required_skill').valueChanges.subscribe(
      (skill) => {
        if (skill && this.helperService.checkSpacesString(skill)) {
          this.autocomplete_required_skills = this.positionName[0].minimum_skills.filter(value => value.skill.toLocaleLowerCase().includes(skill));
        } else {
          this.autocomplete_required_skills = [];
        }
      }
    );
  }

  selectRequiredSkill(required_skill: Skill) {
    this.temp_required_skill = required_skill;
    this.requiredSkillsSearchForm.get('required_skill').setValue('');
  }

  skillsSearchDone(isPreferredSkill: boolean) {
    isPreferredSkill ? this.temp_preferred_skill = null : this.temp_required_skill = null;
  }

  countWords(description) {
    if (description) {
      this.jobDescription = description.split(' ').length;
    }
  }
  getCompanyData(comapnyId) {
    this.isJobLoading = true;
    this.companyService.getCompanyData(comapnyId).subscribe(
      dataJson => {
        this.isJobLoading = false;
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
        this.newCompanyPositions[this.newPositionCount[i]] = companyPositionValues[i];
      }

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
  getSavedJobs() {
    this.isJobLoading = true;
    this.cartService.getSavedJobs()
      .subscribe((data: any) => {
        this.isJobLoading = false;
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
    this.isJobLoading = true;
    this.applicationService.getAppliedJobs()
      .subscribe(data => {
        this.isJobLoading = false;
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
    this.isJobLoading = true;
    const application_id = this.appliedJobsMap[position_id];
    this.applicationService.withdrawJobs(application_id).subscribe(data => {
      this.isJobLoading = false;
      delete this.appliedJobsMap[position_id];
    },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      });
  }

  applyJob(positionArr) {
    this.isJobLoading = true;
    this.applicationService.applyJob(positionArr)
      .subscribe(data => {
        this.isJobLoading = false;
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
    this.isJobLoading = true;
    this.cartService.saveJob(positionArr).subscribe(data => {
      this.isJobLoading = false;
      for (const position of positionArr) {
        this.savedJobsMap[position.position_id] = position.position_id;
      }
    },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      });
  }

  unSaveJob(positionData) {
    this.isJobLoading = true;
    this.cartService.unSaveJob(positionData).subscribe(data => {
      this.isJobLoading = false;
      delete this.savedJobsMap[positionData[0].position_id];
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
  scrollSmoothTo(id) {
    const height = 90;
    document.getElementById('sidenav-content').scrollTop = document.getElementById(id).offsetTop - height;
    this.filter_list = false;
  }
}
