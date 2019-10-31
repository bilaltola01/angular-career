import { Component, OnInit, DoCheck } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {
  PositionService, AlertsService, AlertType,
  AutoCompleteService, CartService, ApplicationService, ScoreService
} from '../../../services/index';


import {
  PositionLevel,
  ApplicationSortBy,
  SkillLevelDescription,
  applicationListLimit,
  EducationLevel,
  positionSearchMessages,
  Major,
  City,
  Industry,
  Company,
  Skill,
  School,
  positionListLimit,
  JobType,
  interestLevel,
  ApplicationStatus
} from 'src/app/models';
import { AddSkillPopupComponent } from 'src/app/components/add-skill-popup/add-skill-popup.component';
import { InterestLevelPopupComponent } from 'src/app/components/interest-level-popup/interest-level-popup.component';
import { SkillDescriptionPopupComponent } from 'src/app/components/skill-description-popup/skill-description-popup.component';
import { Router } from '@angular/router';


export interface DialogData {
  data: any;
}

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss']
})
export class ApplicationsComponent implements OnInit, DoCheck {

  // Constants
  breakpoint: number;
  positionLevel: string[] = PositionLevel;
  educationLevel: string[] = EducationLevel;
  sortBy: object[] = ApplicationSortBy;
  SkillLevelDescription = SkillLevelDescription;
  positionSearchMessages = positionSearchMessages;
  // FormGroup
  applicationForm: FormGroup;
  // Autocomplete list

  jobType = JobType;
  interest = interestLevel;
  applicationStatus = ApplicationStatus;
  autocomplete_skills: Skill[] = [];
  autocomplete_school: School[][] = [];
  autocomplete_additional_industries: Industry[][] = [];
  autocomplete_education_major: Major[][] = [];
  autocomplete_companies: Company[][] = [];
  autocomplete_cities: City[] = [];

  userSkillsList = [];
  applicationList = [];
  interestLevelData = [];
  autocomplete_searchposition = [];
  filterAttributes = {
    city_id: null,
    industry_id: null,
    major_id: null,
    school_id: null,
    offset: 0,
    limit: applicationListLimit
  };
  isJobLoading = true;
  selectedAllFlag = false;
  mathFloor = Math.floor;
  filter_list: boolean;
  currentPageNumber = 1;
  displaySkillsLimit = 3;
  paginationArr = [];
  appliedJobs = [];
  appliedJobsMap = {};
  preLoadDataObject = {};
  updatedFitscoreList = [];
  searchQueryParam;
  preLoadDataFlag = true;
  queryFlag = true;
  offsetParam;
  prequeryFlag = false;
  offsetFlag = false;
  urlParams = {};
  urlQueryParameter;
  skillUrlParams = [];
  skillUrlIdParam = [];
  applicationParam;

  constructor(private autoCompleteService: AutoCompleteService, private router: Router,
    private alertsService: AlertsService, private positionService: PositionService, private scoreService: ScoreService,
    private cartService: CartService, private applicationService: ApplicationService, public dialog: MatDialog) {
    this.updateSkillCallback = this.updateSkillCallback.bind(this);
  }
  ngOnInit() {
    const urlParams = new URLSearchParams(window.location.search);
    this.searchQueryParam = urlParams.get('search');
    if (this.searchQueryParam) {
      this.preLoadDataFlag = false;
      this.offsetFlag = true;
      const urlObject = this.searchQueryParam.split('&');
      for (let i = 0; i < urlObject.length; i++) {
        const result = urlObject[i].split('=');
        if (result[0] === 'skillName') {
          this.skillUrlParams.push(result[1]);
        } else if (result[0] === 'skills') {
          this.skillUrlIdParam.push(result[1]);
        } else {
          this.urlParams[result[0]] = result[1];
        }
      }
    }
    this.initPositionFilterForm();
    this.getApplicationData();
    this.breakpoint = (window.innerWidth <= 500) ? 2 : 4;

  }
  ngDoCheck() {
    if (this.applicationService.getApplicationFlag) {
      this.getApplicationData();
    }
  }
  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 500) ? 2 : 4;
  }

  toggleTabMenuOpen() {
    this.filter_list = !this.filter_list;
  }
  initPositionFilterForm() {
    this.applicationForm = new FormGroup({
      'searchPosition': new FormControl(null),
      'city': new FormControl(null),
      'skill': new FormControl(null),
      'minSal': new FormControl(null),
      'position': new FormControl(null),
      'education': new FormControl(null),
      'job': new FormControl(null),
      'interest': new FormControl(null),
      'applicationStatus': new FormControl(null),
      'major': new FormControl(null),
      'industry': new FormControl(null),
      'company': new FormControl(null),
      'post': new FormControl(null),
      'school': new FormControl(null),
      'recruiter': new FormControl(null),
      'sortBy': new FormControl('application_date')
    });
    this.applicationForm.get('searchPosition').valueChanges.subscribe((searchPosition) => {
      searchPosition ? this.onSearchPositionValueChanges(searchPosition) : this.autocomplete_searchposition = [];
    });
    this.applicationForm.get('city').valueChanges.subscribe((city) => {
      city ? this.onCityValueChanges(city) : this.autocomplete_cities = [];
    });
    this.applicationForm.get('major').valueChanges.subscribe((major) => {
      major ? this.onMajorValueChanges(major) : this.autocomplete_education_major = [];
    });
    this.applicationForm.get('industry').valueChanges.subscribe((industry) => {
      industry ? this.onIndustryValueChanges(industry) : this.autocomplete_additional_industries = [];
    });
    this.applicationForm.get('company').valueChanges.subscribe((company) => {
      company ? this.onCompanyValueChanges(company) : this.autocomplete_companies = [];
    });
    this.applicationForm.get('skill').valueChanges.subscribe(
      (skill) => {
        skill ? this.onSkillValueChanges(skill) : this.autocomplete_skills = [];
      }
    );
    this.applicationForm.get('school').valueChanges.subscribe((school) => {
      school ? this.onSchoolValueChanges(school) : this.autocomplete_school = [];
    });
    if (this.searchQueryParam) {
      this.applicationForm.patchValue({
        'searchPosition': this.urlParams['position'],
        'minSal': this.urlParams['pay'],
        'position': this.urlParams['level'],
        'education': this.urlParams['education'],
        'job': this.urlParams['job_type'],
        'company': this.urlParams['company'],
        'major': this.urlParams['majorName'],
        'recruiter': this.urlParams['recruiterName'],
        'interest': this.urlParams['interest'],
        'applicationStatus': this.urlParams['filter'],
        'post': this.urlParams['post'],
        'school': this.urlParams['schoolName'],
        'industry': this.urlParams['industryName'],
        'city': this.urlParams['cityName'],
        'sortBy': this.urlParams['sort']
      });
    }
  }

  onChangeCity(city) {
    this.filterAttributes['city_id'] = city.city_id;
  }

  onChangeMajor(major) {
    this.filterAttributes['major_id'] = major.major_id;
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
  onMajorValueChanges(major: string) {
    this.autoCompleteService.autoComplete(major, 'majors').subscribe(
      dataJson => {
        if (dataJson['success']) {
          this.autocomplete_education_major = dataJson['data'];
        }
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
        this.autocomplete_education_major = [];
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
  addSkills(skillItem: Skill) {
    if (this.skillUrlParams.length > 0) {
      this.applicationForm.patchValue({ skill: '' });
      if (!(this.skillUrlParams.includes(skillItem.skill))) {
        if (this.userSkillsList.findIndex(skill => skillItem.skill_id === skill.skill_id) === -1) {
          this.userSkillsList.push(skillItem);
        }
      }
    } else {
      this.applicationForm.patchValue({ skill: '' });
      if (this.userSkillsList.findIndex(skill => skillItem.skill_id === skill.skill_id) === -1) {
        this.userSkillsList.push(skillItem);
      }
    }
  }
  removeUserSkillsData(index: number) {
    this.userSkillsList.splice(index, 1);
  }

  removeSkillUrlParams(index: number) {
    this.skillUrlParams.splice(index, 1);
    this.skillUrlIdParam.splice(index, 1);
  }
  generateQueryString(): string {
    let queryString;
    let urlQueryParam;
    if (this.searchQueryParam) {
      queryString = this.searchQueryParam;
      this.searchQueryParam = null;
    } else {
      queryString = this.applicationForm.value.city ? `${queryString ? queryString + '&' : ''}city=${this.filterAttributes.city_id ? this.filterAttributes.city_id : this.urlParams['city']}` : queryString;
      queryString = this.applicationForm.value.position ? `${queryString ? queryString + '&' : ''}level=${this.applicationForm.value.position}` : queryString;
      queryString = this.applicationForm.value.education ? `${queryString ? queryString + '&' : ''}education=${parseInt(this.applicationForm.value.education, 10) + 1}` : queryString;
      queryString = this.applicationForm.value.job ? `${queryString ? queryString + '&' : ''}job_type=${this.applicationForm.value.job}` : queryString;
      queryString = this.applicationForm.value.interest ? `${queryString ? queryString + '&' : ''}interest=${this.applicationForm.value.interest}` : queryString;
      queryString = this.applicationForm.value.applicationStatus ? `${queryString ? queryString + '&' : ''}filter=${this.applicationForm.value.applicationStatus}` : queryString;
      queryString = this.applicationForm.value.school ? `${queryString ? queryString + '&' : ''}school=${this.filterAttributes.school_id ? this.filterAttributes.school_id : this.urlParams['school']}` : queryString;
      queryString = this.applicationForm.value.major ? `${queryString ? queryString + '&' : ''}major=${this.filterAttributes.major_id ? this.filterAttributes.major_id : this.urlParams['major']}` : queryString;
      queryString = this.applicationForm.value.industry ? `${queryString ? queryString + '&' : ''}industry=${this.filterAttributes.industry_id ? this.filterAttributes.industry_id : this.urlParams['industry']}` : queryString;
      queryString = this.applicationForm.value.company ? `${queryString ? queryString + '&' : ''}company=${this.applicationForm.value.company}` : queryString;
      queryString = this.applicationForm.value.minSal ? `${queryString ? queryString + '&' : ''}pay=${this.applicationForm.value.minSal}` : queryString;
      if (this.offsetFlag) {
        queryString = queryString ? `${queryString}&offset=${parseInt(this.urlParams['offset'], 10) + parseInt(this.urlParams['limit'], 10)}` : `offset=${parseInt(this.urlParams['offset'], 10) + this.filterAttributes.limit}`;
        queryString = queryString ? `${queryString}&limit=${parseInt(this.urlParams['limit'], 10)}` : `offset=${parseInt(this.urlParams['limit'], 10)}`;
        this.offsetFlag = false;
      } else {
        queryString = queryString ? `${queryString}&offset=${this.filterAttributes.offset}` : `offset=${this.filterAttributes.offset}`;
        queryString = queryString ? `${queryString}&limit=${this.filterAttributes.limit}` : `offset=${this.filterAttributes.limit}`;
      }
      urlQueryParam = this.applicationForm.value.city ? `${urlQueryParam ? urlQueryParam + '&' : ''}city=${this.filterAttributes.city_id ? this.filterAttributes.city_id : this.urlParams['city']}&cityName=${this.applicationForm.value.city}` : urlQueryParam;
      urlQueryParam = this.applicationForm.value.position ? `${urlQueryParam ? urlQueryParam + '&' : ''}level=${this.applicationForm.value.position}` : urlQueryParam;
      urlQueryParam = this.applicationForm.value.education ? `${urlQueryParam ? urlQueryParam + '&' : ''}education=${parseInt(this.applicationForm.value.education, 10) + 1}` : urlQueryParam;
      urlQueryParam = this.applicationForm.value.job ? `${urlQueryParam ? urlQueryParam + '&' : ''}job_type=${this.applicationForm.value.job}` : urlQueryParam;
      urlQueryParam = this.applicationForm.value.interest ? `${urlQueryParam ? urlQueryParam + '&' : ''}interest=${this.applicationForm.value.interest}` : urlQueryParam;
      urlQueryParam = this.applicationForm.value.applicationStatus ? `${urlQueryParam ? urlQueryParam + '&' : ''}filter=${this.applicationForm.value.applicationStatus}` : urlQueryParam;
      urlQueryParam = this.applicationForm.value.school ? `${urlQueryParam ? urlQueryParam + '&' : ''}school=${this.filterAttributes.school_id ? this.filterAttributes.school_id : this.urlParams['school']}&schoolName=${this.applicationForm.value.school}` : urlQueryParam;
      urlQueryParam = this.applicationForm.value.major ? `${urlQueryParam ? urlQueryParam + '&' : ''}major=${this.filterAttributes.major_id ? this.filterAttributes.major_id : this.urlParams['major']}&majorName=${this.applicationForm.value.major}` : urlQueryParam;
      urlQueryParam = this.applicationForm.value.industry ? `${urlQueryParam ? urlQueryParam + '&' : ''}industry=${this.filterAttributes.industry_id ? this.filterAttributes.industry_id : this.urlParams['industry']}&industryName=${this.applicationForm.value.industry}` : urlQueryParam;
      urlQueryParam = this.applicationForm.value.company ? `${urlQueryParam ? urlQueryParam + '&' : ''}company=${this.applicationForm.value.company}` : urlQueryParam;
      urlQueryParam = this.applicationForm.value.minSal ? `${urlQueryParam ? urlQueryParam + '&' : ''}pay=${this.applicationForm.value.minSal}` : urlQueryParam;
      urlQueryParam = this.applicationForm.value.searchPosition ? `${urlQueryParam ? urlQueryParam + '&' : ''}position=${this.applicationForm.value.searchPosition}` : urlQueryParam;

      if (this.offsetParam || this.filterAttributes.offset === 0 || this.filterAttributes.offset === this.filterAttributes.limit) {
        urlQueryParam = urlQueryParam ? `${urlQueryParam}&offset=${this.filterAttributes.offset === 0 || this.filterAttributes.offset === this.filterAttributes.limit ? 0 : this.offsetParam}` : `offset=${this.filterAttributes.offset === 0 || this.filterAttributes.offset === this.filterAttributes.limit ? 0 : this.offsetParam}`;
        urlQueryParam = urlQueryParam ? `${urlQueryParam}&limit=${this.filterAttributes.limit}` : `offset=${this.filterAttributes.limit}`;
        urlQueryParam = this.applicationForm.value.sortBy ? `${urlQueryParam ? urlQueryParam + '&' : ''}sort=${this.applicationForm.value.sortBy}` : urlQueryParam;

      }


      this.userSkillsList.forEach(skill => {
        queryString = queryString ? queryString + `&skills=${skill.skill_id}` : `skills=${skill.skill_id}&skillName=${skill.skill}`;
        urlQueryParam = urlQueryParam ? urlQueryParam + `&skills=${skill.skill_id}&skillName=${skill.skill}` : `skills=${skill.skill_id}&skillName=${skill.skill}`;
      });
      if (this.skillUrlIdParam.length > 0) {
        this.skillUrlIdParam.forEach(skill => {
          queryString = queryString ? queryString + `&skills=${skill}` : `skills=${skill}`;
          urlQueryParam = urlQueryParam ? urlQueryParam + `&skills=${skill}` : `skills=${skill}`;

        });
      }
      if (this.skillUrlParams.length > 0) {
        this.skillUrlParams.forEach(skill => {
          queryString = queryString ? queryString + `&skillName=${skill}` : `skillName=${skill}`;
          urlQueryParam = urlQueryParam ? urlQueryParam + `&skillName=${skill}` : `skillName=${skill}`;

        });
      }
      queryString = this.applicationForm.value.searchPosition ? `${queryString ? queryString + '&' : ''}position=${this.applicationForm.value.searchPosition}` : queryString;
      queryString = this.applicationForm.value.sortBy ? `${queryString ? queryString + '&' : ''}sort=${this.applicationForm.value.sortBy}` : queryString;

      if (this.queryFlag || this.prequeryFlag) {
        this.router.navigate(['/applications'], { queryParams: { search: urlQueryParam ? urlQueryParam : '' } });
        this.applicationParam = urlQueryParam;
      }
      this.urlQueryParameter = queryString;
    }


    return queryString;
  }
  getApplicationData() {
    this.queryFlag = true;
    this.applicationService.getApplicationFlag = false;
    this.selectedAllFlag = false;
    if (this.searchQueryParam) {
      this.currentPageNumber = (this.urlParams['offset'] / this.urlParams['limit']) + 1;
    } else {
      this.currentPageNumber = (this.filterAttributes.offset / this.filterAttributes.limit) + 1;
    }
    if (this.preLoadDataObject[this.currentPageNumber]) {
      this.applicationList = this.preLoadDataObject[this.currentPageNumber].data.data;
      this.setPaginationValues(this.preLoadDataObject[this.currentPageNumber]);
      if (this.currentPageNumber < this.paginationArr[this.paginationArr.length - 1]) {
        this.preLoadNextPage(this.currentPageNumber + 1);
      } else {
        this.router.navigate(['/applications'], { queryParams: { param: this.urlQueryParameter ? this.urlQueryParameter : '' } });
      }
    } else {
      this.isJobLoading = true;
      let queryParameters;
      queryParameters = this.generateQueryString();
      this.applicationService.getAppliedJobs(queryParameters).subscribe(
        dataJson => {
          this.isJobLoading = false;
          if (dataJson['success'] && dataJson.data.data) {
            this.applicationList = dataJson.data.data;
            this.setPaginationValues(dataJson);
            if (this.currentPageNumber < this.paginationArr[this.paginationArr.length - 1]) {
              this.preLoadNextPage(this.currentPageNumber + 1);
            }
          }
        },
        error => {
          this.isJobLoading = false;
          this.alertsService.show(error.message, AlertType.error);
          this.applicationList = [];
        }
      );
    }


  }

  clearFilter() {
    const sortValue = this.applicationForm.value.sortBy;
    const setPositionValue = this.applicationForm.value.searchPosition;
    this.applicationForm.reset();
    this.preLoadDataObject = {};
    this.skillUrlIdParam = [];
    this.skillUrlParams = [];
    this.userSkillsList = [];
    this.preLoadDataObject = {};
    this.applicationForm.patchValue({ 'sortBy': sortValue });
    this.applicationForm.patchValue({ 'searchPosition': setPositionValue });
    this.toggleTabMenuOpen();
  }

  selectAll(isChecked) {
    this.selectedAllFlag = isChecked;
    this.applicationList = this.applicationList.map(job => {
      job['selected'] = isChecked;
      return job;
    });
  }
  onSearchPosition(event) {
    this.prequeryFlag = true;
    this.offsetFlag = false;
    this.filterAttributes.offset = 0;
    this.preLoadDataObject = {};
    this.getApplicationData();
    event.stopPropagation();
  }

  applyFilter() {
    this.prequeryFlag = true;
    this.offsetFlag = false;
    this.filterAttributes.offset = 0;
    this.toggleTabMenuOpen();
    this.preLoadDataObject = {};
    this.getApplicationData();
  }
  calculateQualificationLevel(fitscore) {
    if (!fitscore) {
      return 'Unknown';
    } else if (fitscore <= 0.2) {
      return 'Unqualified';
    } else if (fitscore > 0.2 && fitscore <= 0.6) {
      return 'Nascent';
    } else if (fitscore > 0.6 && fitscore <= 0.8) {
      return 'Qualified';
    } else if (fitscore > 0.8 && fitscore <= 0.9) {
      return 'Highly Qualified';
    } else if (fitscore > 0.9 && fitscore <= 1.0) {
      return 'Extremely Qualified';
    } else {
      return 'Unknown';
    }
  }
  withdrawApplication(application_id) {
    this.applicationService.withdrawJobs(application_id).subscribe(data => {
      this.getApplicationData();
    },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      });
  }
  pageClicked(pageNo) {
    this.prequeryFlag = true;
    this.offsetFlag = false;
    document.getElementById('sidenav-content').scrollTo(0, 0);
    if (pageNo > 0 && pageNo <= this.paginationArr[this.paginationArr.length - 1]) {
      this.currentPageNumber = pageNo;
      this.filterAttributes.offset = ((this.currentPageNumber - 1) * applicationListLimit);
      this.offsetParam = this.filterAttributes.offset;
      this.getApplicationData();

    }

  }
  preLoadNextPage(nextPageNumber) {
    if (!this.preLoadDataObject[nextPageNumber]) {
      const previousOffset = this.filterAttributes.offset;
      this.filterAttributes.offset = this.filterAttributes.offset + applicationListLimit;
      const queryString = this.generateQueryString();
      this.applicationService.getAppliedJobs(queryString).subscribe(
        dataJson => {
          if (dataJson['success'] && dataJson) {
            this.preLoadDataObject = {};
            this.preLoadDataObject[nextPageNumber] = dataJson;
          }
          this.filterAttributes.offset = previousOffset;
        },
        error => {
          this.applicationList = [];
        }
      );
    }
  }

  getPositionIds() {
    let positionIds = this.applicationList.map(position => `positionList=${position.position_id}`);
    if (this.preLoadDataObject[this.currentPageNumber + 1] && this.preLoadDataObject[this.currentPageNumber + 1].data.data) {
      const preLoadData = this.preLoadDataObject[this.currentPageNumber + 1].data.data.map(position => `applicationList=${position.position_id}`);
      positionIds = [...positionIds, ...preLoadData];
    }
    return positionIds.join('&');
  }
  updateSkillCallback() {
    this.scoreService.putSkillVector().subscribe();
    const positionIds = this.getPositionIds();
    this.scoreService.getUpdatedfitscores(positionIds).subscribe(
      dataJson => {
        this.updatedFitscoreList = [...dataJson.data['fitscores']];
        this.updatedFitscore();
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      });
  }
  updatedFitscore() {
    for (let i = 0; i < this.updatedFitscoreList.length; i++) {
      let index = this.applicationList.findIndex(position => position.position_id === this.updatedFitscoreList[i].position_id);
      if (index > -1) {
        this.applicationList[index]['true_fitscore_info'] = this.updatedFitscoreList[i];
      } else {
        index = this.preLoadDataObject[this.currentPageNumber + 1].data.data.findIndex(position => position.position_id === this.updatedFitscoreList[i].position_id);
        this.preLoadDataObject[this.currentPageNumber + 1].data.data[index]['true_fitscore_info'] = this.updatedFitscoreList[i];
      }
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
  openDialog() {
    const dialogFlag = true;
    const dialogRef = this.dialog.open(SkillDescriptionPopupComponent, {
      data: { dialogFlag },
      width: '100vw',
      maxWidth: '880px',
      minWidth: '280px',
      panelClass: ['edit-dialog-container']
    });
  }
  setPaginationValues(dataJson) {
    let max;
    let min;
    if (this.currentPageNumber >= 5) {
      max = Math.ceil(dataJson.data.count / positionListLimit) <= 6 ? Math.ceil(dataJson.data.count / positionListLimit) + this.currentPageNumber - 1 : this.currentPageNumber + 6;
      min = max > 10 ? max - 9 : 1;
    } else {
      if (this.offsetFlag) {
        this.filterAttributes.offset = parseInt(this.urlParams['offset'], 10);
      }
      max = Math.ceil((dataJson.data.count + this.filterAttributes.offset) / positionListLimit) < 10 ? Math.ceil((dataJson.data.count + this.filterAttributes.offset) / positionListLimit) : 10;
      min = 1;
    }

    this.paginationArr = Array(max - min + 1).fill(0).map((x, i) => i + min);
  }
  getLowestEducationLevel(lowestEducation) {
    let educationLowestLevel;
    if (lowestEducation) {
      educationLowestLevel = lowestEducation.map(level => level.level);
      educationLowestLevel = Math.min(...educationLowestLevel);
      const index = lowestEducation.findIndex(lowestLevel => lowestLevel.level === educationLowestLevel);
      return lowestEducation[index].education_level;
    }
  }
  withdrawApplications() {
    const selectedApplicationArr = this.applicationList.filter(application => application.selected === true);
    this.withdrawApplication(selectedApplicationArr);
  }
  acceptOffers() {
    const selectedAcceptOfferArr = this.applicationList.filter(application => application.selected === true && application.offer_sent);
    if (selectedAcceptOfferArr.length > 0) {
      this.acceptOffer(selectedAcceptOfferArr);
    }
  }
  rejectOffers() {
    const selectedRejectedOfferArr = this.applicationList.filter(application => application.selected === true && application.offer_sent);
    if (selectedRejectedOfferArr.length > 0) {
      this.rejectOffer(selectedRejectedOfferArr);
    }
  }
  onLevelChanged(level: number, application_id) {
    const queryString = 'interest=' + level;
    this.applicationService.getAppliedJobs(queryString).subscribe(
      dataJson => {
        if (dataJson.data.count > 0) {
          if (!(dataJson.data.data[0].application_id === application_id)) {
            this.openInterestLevelDialog(dataJson.data.data, level, application_id);
          }
        } else {
          this.setInterestLevel(level, application_id);
        }
      });

  }
  setInterestLevel(level: number, application_id) {
    const interestLevelQuery = {
      'application_id': application_id,
      'interest_level': level
    };
    this.applicationService.patchInterestLevel(interestLevelQuery).subscribe(
      () => {
        this.getApplicationData();
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      });

  }
  onClose(application_id, level) {
    if (level > 0) {
      const interestLevelQuery = {
        'application_id': application_id,
        'interest_level': 0
      };
      this.applicationService.patchInterestLevel(interestLevelQuery).subscribe(
        () => {
          this.getApplicationData();
        },
        error => {
          this.alertsService.show(error.message, AlertType.error);
        });
    }
  }
  openInterestLevelDialog(data, level, application_id): void {
    const dialogRef = this.dialog.open(InterestLevelPopupComponent, {
      data: { data, level, application_id },
      width: '100vw',
      maxWidth: '800px',
      minWidth: '280px',
      panelClass: ['edit-dialog-container']
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
  acceptOffer(applicationData) {
    this.applicationService.acceptOffer(applicationData).subscribe();
  }
  rejectOffer(applicationData) {
    this.applicationService.rejectOffer(applicationData).subscribe();
  }
  routerNavigate(application_id, position_id) {
    this.router.navigate(['/applications/application-detail/', application_id, position_id], { queryParams: { query: this.applicationParam ? this.applicationParam : '' } });
  }
}


