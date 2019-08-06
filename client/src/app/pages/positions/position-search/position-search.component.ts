import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  PositionService, AlertsService, AlertType,
  AutoCompleteService, CartService, ApplicationService
} from '../../../services/index';

import {
  City,
  PositionLevel,
  LatestDatePosted,
  SortBy,
  Industry,
  Company,
  Skill,
  School,
  SkillLevelDescription,
  Recruiter,
  positionListLimit
} from 'src/app/models';

@Component({
  selector: 'app-position-search',
  templateUrl: './position-search.component.html',
  styleUrls: ['./position-search.component.scss']
})
export class PositionSearchComponent implements OnInit {
  // Constants
  positionLevel: string[] = PositionLevel;
  latestDatePosted: string[] = LatestDatePosted;
  sortBy: object[] = SortBy;
  SkillLevelDescription = SkillLevelDescription;
  // FormGroup
  positionForm: FormGroup;
  // Autocomplete list
  autocomplete_cities: City[] = [];
  autocomplete_skills: Skill[] = [];
  autocomplete_school: School[][] = [];
  autocomplete_additional_industries: Industry[][] = [];
  autocomplete_companies: Company[][] = [];
  autocomplete_recruiter: Recruiter[][] = [];
  userSkillsList = [];
  positionList = [];
  savedJobs = [];
  autocomplete_searchposition = [];
  filterAttributes = {
    city_id: null,
    industry_id: null,
    school_id: null,
    recruiter_id: null,
    offset: 0,
    limit: positionListLimit
  };

  isJobLoading = true;
  selectedAllFlag = false;
  qualificationLevelstatus: string;
  mathFloor = Math.floor;
  filter_list: boolean;
  currentPageNumber = 1;
  parseIntFn = parseInt;
  paginationArr = [];
  paginationMin = 0;
  paginationMax = 10;
  constructor(private autoCompleteService: AutoCompleteService,
    private alertsService: AlertsService, private positionService: PositionService,
    private cartService: CartService, private applicationService: ApplicationService) { }

  ngOnInit() {
    this.initPositionFilterForm();
    this.getJobData();
    this.getSavedJobs();
    // this.getAppliedJobs();
  }

  toggleTabMenuOpen() {
    this.filter_list = !this.filter_list;
  }
  initPositionFilterForm() {
    this.positionForm = new FormGroup({
      'searchPosition': new FormControl(null),
      'city': new FormControl(null),
      'skill': new FormControl(null),
      'minSal': new FormControl(null),
      'position': new FormControl(null),
      'industry': new FormControl(null),
      'company': new FormControl(null),
      'post': new FormControl(null),
      'school': new FormControl(null),
      'recruiter': new FormControl(null),
      'sortBy': new FormControl('post-date')
    });
    this.positionForm.get('searchPosition').valueChanges.subscribe((searchPosition) => {
      searchPosition ? this.onSearchPositionValueChanges(searchPosition) : this.autocomplete_searchposition = [];
    });
    this.positionForm.get('city').valueChanges.subscribe((city) => {
      city ? this.onCityValueChanges(city) : this.autocomplete_additional_industries = [];
    });
    this.positionForm.get('industry').valueChanges.subscribe((industry) => {
      industry ? this.onIndustryValueChanges(industry) : this.autocomplete_additional_industries = [];
    });
    this.positionForm.get('company').valueChanges.subscribe((company) => {
      company ? this.onCompanyValueChanges(company) : this.autocomplete_companies = [];
    });
    this.positionForm.get('skill').valueChanges.subscribe(
      (skill) => {
        skill ? this.onSkillValueChanges(skill) : this.autocomplete_skills = [];
      }
    );
    this.positionForm.get('school').valueChanges.subscribe((school) => {
      school ? this.onSchoolValueChanges(school) : this.autocomplete_school = [];
    });

    this.positionForm.get('recruiter').valueChanges.subscribe((recruiter) => {
      recruiter ? this.onRecruiterValueChanges(recruiter) : this.autocomplete_recruiter = [];
    });

  }

  onChangeCity(city) {
    this.filterAttributes['city_id'] = city.city_id;
  }

  onChangeIndustry(industry) {
    this.filterAttributes['industry_id'] = industry.industry_id;
  }

  onChangeSchool(school) {
    this.filterAttributes['school_id'] = school.school_id;
  }
  onCityValueChanges(city: string) {
    this.autoCompleteService.autoComplete(city, 'cities').subscribe(
      dataJson => {
        if (dataJson['success']) {
          this.autocomplete_cities = dataJson['data'];
        }
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
        this.autocomplete_cities = [];
      }
    );
  }
  onIndustryValueChanges(industry: string) {
    this.autoCompleteService.autoComplete(industry, 'industries').subscribe(
      dataJson => {
        if (dataJson['success']) {
          this.autocomplete_additional_industries = dataJson['data'];
        }
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
        this.autocomplete_additional_industries = [];
      }
    );
  }
  onCompanyValueChanges(company: string) {
    this.autoCompleteService.autoComplete(company, 'companies').subscribe(
      dataJson => {
        if (dataJson['success']) {
          this.autocomplete_companies = dataJson['data'];
        }
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
        this.autocomplete_companies = [];
      }
    );
  }
  onSkillValueChanges(skill: string) {
    this.autoCompleteService.autoComplete(skill, 'skills').subscribe(
      dataJson => {
        if (dataJson['success']) {
          this.autocomplete_skills = dataJson['data'];
        }
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
        this.autocomplete_skills = [];
      }
    );
  }
  onSchoolValueChanges(school: string) {
    this.autoCompleteService.autoComplete(school, 'schools').subscribe(
      dataJson => {
        if (dataJson['success']) {
          this.autocomplete_school = dataJson['data'];
        }
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
        this.autocomplete_school = [];
      }
    );
  }

  onSearchPositionValueChanges(searchPosition: string) {
    this.autoCompleteService.autoComplete(searchPosition, 'positions').subscribe(
      dataJson => {
        if (dataJson['success']) {
          this.autocomplete_searchposition = dataJson['data'];
        }
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
        this.autocomplete_searchposition = [];
      }
    );
  }

  onRecruiterValueChanges(recruiter: string) {
    this.autoCompleteService.autoComplete(recruiter, 'users').subscribe(
      dataJson => {
        if (dataJson['success']) {
          this.autocomplete_recruiter = dataJson['data'];
        }
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
        this.autocomplete_recruiter = [];
      }
    );
  }

  onChangeRecruiter(recruiter) {
    this.filterAttributes['recruiter_id'] = recruiter.user_id;
  }

  addSkills(skillItem: Skill) {
    this.positionForm.patchValue({ skill: '' });
    this.userSkillsList.push(skillItem);
  }
  removeUserSkillsData(index: number) {
    this.userSkillsList.splice(index, 1);
  }

  generateQueryString(): string {
    let queryString;
    queryString = this.positionForm.value.city ? `${queryString ? queryString + '&' : ''}city=${this.filterAttributes.city_id}` : queryString;
    queryString = this.positionForm.value.position ? `${queryString ? queryString + '&' : ''}level=${this.positionForm.value.position}` : queryString;
    queryString = this.positionForm.value.industry ? `${queryString ? queryString + '&' : ''}industry=${this.filterAttributes.industry_id}` : queryString;
    queryString = this.positionForm.value.company ? `${queryString ? queryString + '&' : ''}company=${this.positionForm.value.company}` : queryString;
    queryString = this.positionForm.value.minSal ? `${queryString ? queryString + '&' : ''}pay=${this.positionForm.value.minSal}` : queryString;
    queryString = this.positionForm.value.recruiter ? `${queryString ? queryString + '&' : ''}recruiter=${this.filterAttributes.recruiter_id}` : queryString;
    queryString = queryString ? `${queryString}&offset=${this.filterAttributes.offset}` : `offset=${this.filterAttributes.offset}`;
    queryString = queryString ? `${queryString}&limit=${this.filterAttributes.limit}` : `offset=${this.filterAttributes.limit}`;
    this.userSkillsList.forEach(skill => {
      queryString = queryString ? queryString + `&skills=${skill.skill_id}` : `skills=${skill.skill_id}`;
    });
    queryString = this.positionForm.value.searchPosition ? `${queryString ? queryString + '&' : ''}position=${this.positionForm.value.searchPosition}` : queryString;
    queryString = this.positionForm.value.sortBy ? `${queryString ? queryString + '&' : ''}sort=${this.positionForm.value.sortBy}` : queryString;
    return queryString;
  }
  getJobData() {
    this.isJobLoading = true;
    this.selectedAllFlag = false;
    const queryString = this.generateQueryString();
    this.positionService.getPositions(queryString).subscribe(
      dataJson => {
        this.isJobLoading = false;
        if (dataJson['success']) {
          this.positionList = dataJson.data.data;
          this.paginationArr = Array(Math.ceil((dataJson.data.count + this.filterAttributes.offset) / 10)).fill(0).map((x, i) => i + 1);
          if (this.filter_list === true) {
            this.toggleTabMenuOpen();
          }
        }
      },
      error => {
        this.isJobLoading = false;
        this.alertsService.show(error.message, AlertType.error);
        this.positionList = [];
      }
    );
  }

  clearFilter() {
    const sortValue = this.positionForm.value.sortBy;
    const setPositionValue = this.positionForm.value.searchPosition;
    this.positionForm.reset();
    this.positionForm.patchValue({ 'sortBy': sortValue });
    this.toggleTabMenuOpen();
  }

  selectAll(isChecked) {
    this.selectedAllFlag = isChecked;
    this.positionList = this.positionList.map(job => {
      job['selected'] = isChecked;
      return job;
    });
  }

  onSearchPosition(event) {
    this.getJobData();
    event.stopPropagation();
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

  getSavedJobs() {
    this.cartService.getSavedJobs()
      .subscribe((data: any) => {
        this.savedJobs = data.data.rows;
      });
  }

  // getAppliedJobs() {
  //   this.applicationService.getAppliedJobs()
  //     .subscribe(data => {
  //       console.log("Applied Jobs", data);
  //     })
  // }

  saveJob(position) {
    this.cartService.saveJob(position.position_id).subscribe(data => {
      this.savedJobs.push(position);
    });
  }

  unSaveJob(position) {
    this.cartService.unSaveJob(position.position_id).subscribe(data => {
      const savedJobIndex = this.savedJobs.findIndex(job => job.position_id === position.position_id);
      this.savedJobs.splice(savedJobIndex, 1);
    });
  }

  applyJob(position_id) {
    this.applicationService.applyJob(position_id)
      .subscribe(data => {
        console.log('job applied successfully');
      });
  }

  applySelected() {
    const selectedPositionArr = this.positionList.filter(position => position.selected === true);
    for (const position of selectedPositionArr) {
      this.applyJob(position.position_id);
    }
  }

  saveSelected() {
    const selectedPositionArr = this.positionList.filter(position => position.selected === true);
    for (const position of selectedPositionArr) {
      this.saveJob(position);
    }
  }



  isJobSaved(position_id) {
    return this.savedJobs.findIndex(position => position.position_id === position_id) === -1 ? false : true;
  }

  pageClicked(pageNo) {
    if (this.paginationArr.length > 10) {
      this.paginationMin = Math.floor((pageNo - 1) / 5) * 5;
      this.paginationMax = this.paginationMin + 10;
    }
    this.currentPageNumber = pageNo;
    this.filterAttributes.offset = ((this.currentPageNumber - 1) * positionListLimit);
    this.getJobData();
  }


}
