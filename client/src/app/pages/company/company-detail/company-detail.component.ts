import { Component, OnInit } from '@angular/core';
import {
  AlertsService,
  AlertType,
  CompanyService,
  HelperService,
  PositionService,
  AutoCompleteService
} from 'src/app/services';
import { Router, Params, ActivatedRoute } from '@angular/router';
import {
  CompanyInfoResponse,
  CompanySizeTypes,
  PositionInfoResponse,
  City,
  Skill,
  School,
  Industry,
  Major,
  Company,
  Recruiter,
  positionListLimit,
  PositionLevel,
  EducationLevel,
  SortBy,
  SkillLevelDescription,
  positionSearchMessages,
  JobType
} from 'src/app/models';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-company-detail',
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.scss']
})
export class CompanyDetailComponent implements OnInit {

  company_id: number;
  showBackButton: boolean;
  loading: boolean;
  companyInfo: CompanyInfoResponse;
  companyPositions: PositionInfoResponse[];
  companySizeTypes = CompanySizeTypes;
  tabIndex: number;


  breakpoint: number;
  positionLevel: string[] = PositionLevel;
  educationLevel: string[] = EducationLevel;
  sortBy: object[] = SortBy;
  SkillLevelDescription = SkillLevelDescription;
  positionSearchMessages = positionSearchMessages;
  jobType = JobType;
  // FormGroup
  positionForm: FormGroup;
  // Autocomplete list
  autocomplete_cities: City[];
  autocomplete_skills: Skill[];
  autocomplete_school: School[][];
  autocomplete_additional_industries: Industry[][];
  autocomplete_education_major: Major[][];
  autocomplete_recruiter: Recruiter[][];
  autocomplete_searchposition: string[];
  userSkillsList = [];
  positionList = [];

  filterAttributes = {
    city_id: null,
    industry_id: null,
    major_id: null,
    school_id: null,
    recruiter_id: null,
    offset: 0,
    limit: positionListLimit
  };

  selectedAllFlag = false;
  mathFloor = Math.floor;
  filter_list: boolean;
  currentPageNumber: number;
  paginationArr = [];
  searchQueryParam;
  urlParams = {};
  offsetFlag = false;
  queryFlag = true;
  prequeryFlag = false;
  preLoadDataFlag = true;
  offsetParam;
  urlQueryParameter;
  skillUrlParams = [];
  skillUrlIdParam = [];

  preLoadDataObject = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertsService: AlertsService,
    private companyService: CompanyService,
    private helperService: HelperService,
    private positionService: PositionService,
    private autoCompleteService: AutoCompleteService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.loadBasicCompanyInfo();
    if (this.route.snapshot.queryParamMap.has('tabIndex')) {
      this.tabIndex = parseInt(this.route.snapshot.queryParamMap.get('tabIndex'), 10);
    } else {
      this.tabIndex = 0;
    }
  }

  backToCompaniesPage() {
    this.router.navigate(['companies']);
  }

  companySize(size: string) {
    return this.companySizeTypes.filter(val => val.toLowerCase().includes(size))[0];
  }

  selectTabMenu(tabIndex: number) {
    this.tabIndex = tabIndex;
    switch (this.tabIndex) {
      case 0:
        this.loadBasicCompanyInfo();
        break;
      case 1:
        this.loadCompanyPositionsInfo();
        break;
      case 2:
        this.loadCompanyPeoplesInfo();
        break;
      case 3:
        this.loadCareerFairInfo();
        break;
      default:
        break;
    }
  }

  onSelectNavItem(id: string) {
    const height = 70;
    document.getElementById('sidenav-content').scrollTop = document.getElementById(id).offsetTop - height;
  }

  /**
   * Parse query parameters, Retrieve basic company infomation
   */
  loadBasicCompanyInfo() {
    this.company_id = parseInt(this.route.snapshot.queryParamMap.get('id'), 10) || null;
    this.showBackButton = this.route.snapshot.queryParamMap.get('showBackButton') === 'true' || false;

    if (this.company_id) {
      this.getCompanyById(this.company_id);
    }
  }

  getCompanyById(company_id: number) {
    this.companyService.getCompanyById(company_id).subscribe(
      dataJson => {
        this.loading = false;
        this.companyInfo = dataJson['data'];
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

  /**
   * Retrieve positions info
   */
  loadCompanyPositionsInfo() {
    this.currentPageNumber = 1;

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
      this.currentPageNumber = (this.urlParams['offset'] / this.urlParams['limit']) + 1;
    }

    this.initPositionFilterForm();
    // this.getJobData();

    this.breakpoint = (window.innerWidth <= 500) ? 2 : 4;
    // this.positionService.getCompanyPositions(this.company_id).subscribe(
    //   dataJson => {
    //     this.loading = false;
    //     this.companyPositions = dataJson['data'];
    //   },
    //   error => {
    //     this.alertsService.show(error.message, AlertType.error);
    //   }
    // );
  }

  /**
   * Retrieve peoples info
   */
  loadCompanyPeoplesInfo() {

  }

  /**
   * Retrieve CareerFair Info
   */
  loadCareerFairInfo() {

  }

  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 500) ? 2 : 4;
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
      'education': new FormControl(null),
      'job': new FormControl(null),
      'major': new FormControl(null),
      'industry': new FormControl(null),
      'post': new FormControl(null),
      'school': new FormControl(null),
      'recruiter': new FormControl(null),
      'sortBy': new FormControl('qualification')
    });

    this.positionForm.get('searchPosition').valueChanges.subscribe((searchPosition) => {
      searchPosition ? this.onSearchPositionValueChanges(searchPosition) : this.autocomplete_searchposition = [];
    });
    this.positionForm.get('city').valueChanges.subscribe((city) => {
      city ? this.onCityValueChanges(city) : this.autocomplete_cities = [];
    });
    this.positionForm.get('major').valueChanges.subscribe((major) => {
      major ? this.onMajorValueChanges(major) : this.autocomplete_education_major = [];
    });
    this.positionForm.get('industry').valueChanges.subscribe((industry) => {
      industry ? this.onIndustryValueChanges(industry) : this.autocomplete_additional_industries = [];
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
    if (this.searchQueryParam) {
      this.positionForm.patchValue({
        'searchPosition': this.urlParams['position'],
        'minSal': this.urlParams['pay'],
        'level': this.urlParams['level'],
        'education': this.urlParams['education'],
        'job': this.urlParams['job_type'],
        'company': this.urlParams['company'],
        'major': this.urlParams['majorName'],
        'recruiter': this.urlParams['recruiterName'],
        'school': this.urlParams['schoolName'],
        'industry': this.urlParams['industryName'],
        'city': this.urlParams['cityName'],
        'sortBy': this.urlParams['sort']
      });
    }
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

  onChangeRecruiter(recruiter) {
    this.filterAttributes['recruiter_id'] = recruiter.user_id;
  }

  addSkills(skillItem: Skill) {
    if (this.skillUrlParams.length > 0) {
      this.positionForm.patchValue({ skill: '' });
      if (!(this.skillUrlParams.includes(skillItem.skill))) {
        if (this.userSkillsList.findIndex(skill => skillItem.skill_id === skill.skill_id) === -1) {
          this.userSkillsList.push(skillItem);
        }
      }
    } else {
      this.positionForm.patchValue({ skill: '' });
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
      queryString = this.positionForm.value.city ? `${queryString ? queryString + '&' : ''}city=${this.filterAttributes.city_id ? this.filterAttributes.city_id : this.urlParams['city']}&cityName=${this.positionForm.value.city}` : queryString;
      queryString = this.positionForm.value.position ? `${queryString ? queryString + '&' : ''}level=${this.positionForm.value.position}` : queryString;
      queryString = this.positionForm.value.education ? `${queryString ? queryString + '&' : ''}education=${parseInt(this.positionForm.value.education, 10) + 1}` : queryString;
      queryString = this.positionForm.value.job ? `${queryString ? queryString + '&' : ''}job_type=${this.positionForm.value.job}` : queryString;
      queryString = this.positionForm.value.school ? `${queryString ? queryString + '&' : ''}school=${this.filterAttributes.school_id ? this.filterAttributes.school_id : this.urlParams['school']}&schoolName=${this.positionForm.value.school}` : queryString;
      queryString = this.positionForm.value.major ? `${queryString ? queryString + '&' : ''}major=${this.filterAttributes.major_id ? this.filterAttributes.major_id : this.urlParams['major']}&majorName=${this.positionForm.value.major}` : queryString;
      queryString = this.positionForm.value.industry ? `${queryString ? queryString + '&' : ''}industry=${this.filterAttributes.industry_id ? this.filterAttributes.industry_id : this.urlParams['industry']}&industryName=${this.positionForm.value.industry}` : queryString;
      queryString = this.positionForm.value.company ? `${queryString ? queryString + '&' : ''}company=${this.positionForm.value.company}` : queryString;
      queryString = this.positionForm.value.minSal ? `${queryString ? queryString + '&' : ''}pay=${this.positionForm.value.minSal}` : queryString;
      queryString = this.positionForm.value.recruiter ? `${queryString ? queryString + '&' : ''}recruiter=${this.filterAttributes.recruiter_id ? this.filterAttributes.recruiter_id : this.urlParams['recruiter']}&recruiterName=${this.positionForm.value.recruiter}` : queryString;

      if (this.offsetFlag) {
        queryString = queryString ? `${queryString}&offset=${parseInt(this.urlParams['offset'], 10) + parseInt(this.urlParams['limit'], 10)}` : `offset=${parseInt(this.urlParams['offset'], 10) + this.filterAttributes.limit}`;
        queryString = queryString ? `${queryString}&limit=${parseInt(this.urlParams['limit'], 10)}` : `offset=${parseInt(this.urlParams['limit'], 10)}`;
        this.offsetFlag = false;
      } else {
        queryString = queryString ? `${queryString}&offset=${this.filterAttributes.offset}` : `offset=${this.filterAttributes.offset}`;
        queryString = queryString ? `${queryString}&limit=${this.filterAttributes.limit}` : `offset=${this.filterAttributes.limit}`;

      }
      queryString = this.positionForm.value.searchPosition ? `${queryString ? queryString + '&' : ''}position=${this.positionForm.value.searchPosition}` : queryString;
      queryString = this.positionForm.value.sortBy ? `${queryString ? queryString + '&' : ''}sort=${this.positionForm.value.sortBy}` : queryString;

      urlQueryParam = this.positionForm.value.city ? `${urlQueryParam ? urlQueryParam + '&' : ''}city=${this.filterAttributes.city_id ? this.filterAttributes.city_id : this.urlParams['city']}&cityName=${this.positionForm.value.city}` : urlQueryParam;
      urlQueryParam = this.positionForm.value.position ? `${urlQueryParam ? urlQueryParam + '&' : ''}level=${this.positionForm.value.position}` : urlQueryParam;
      urlQueryParam = this.positionForm.value.education ? `${urlQueryParam ? urlQueryParam + '&' : ''}education=${parseInt(this.positionForm.value.education, 10) + 1}` : urlQueryParam;
      urlQueryParam = this.positionForm.value.job ? `${urlQueryParam ? urlQueryParam + '&' : ''}job_type=${this.positionForm.value.job}` : urlQueryParam;
      urlQueryParam = this.positionForm.value.school ? `${urlQueryParam ? urlQueryParam + '&' : ''}school=${this.filterAttributes.school_id ? this.filterAttributes.school_id : this.urlParams['school']}&schoolName=${this.positionForm.value.school}` : urlQueryParam;
      urlQueryParam = this.positionForm.value.major ? `${urlQueryParam ? urlQueryParam + '&' : ''}major=${this.filterAttributes.major_id ? this.filterAttributes.major_id : this.urlParams['major']}&majorName=${this.positionForm.value.major}` : urlQueryParam;
      urlQueryParam = this.positionForm.value.industry ? `${urlQueryParam ? urlQueryParam + '&' : ''}industry=${this.filterAttributes.industry_id ? this.filterAttributes.industry_id : this.urlParams['industry']}&industryName=${this.positionForm.value.industry}` : urlQueryParam;
      urlQueryParam = this.positionForm.value.company ? `${urlQueryParam ? urlQueryParam + '&' : ''}company=${this.positionForm.value.company}` : urlQueryParam;
      urlQueryParam = this.positionForm.value.minSal ? `${urlQueryParam ? urlQueryParam + '&' : ''}pay=${this.positionForm.value.minSal}` : urlQueryParam;
      urlQueryParam = this.positionForm.value.recruiter ? `${urlQueryParam ? urlQueryParam + '&' : ''}recruiter=${this.filterAttributes.recruiter_id ? this.filterAttributes.recruiter_id : this.urlParams['recruiter']}&recruiterName=${this.positionForm.value.recruiter}` : urlQueryParam;
      urlQueryParam = this.positionForm.value.searchPosition ? `${urlQueryParam ? urlQueryParam + '&' : ''}position=${this.positionForm.value.searchPosition}` : urlQueryParam;

      if (this.offsetParam || this.filterAttributes.offset === 0 || this.filterAttributes.offset === this.filterAttributes.limit) {
        urlQueryParam = urlQueryParam ? `${urlQueryParam}&offset=${this.offsetParam ? this.offsetParam : 0}` : `offset=${this.offsetParam ? this.offsetParam : 0}`;
        urlQueryParam = urlQueryParam ? `${urlQueryParam}&limit=${this.filterAttributes.limit}` : `offset=${this.filterAttributes.limit}`;
        urlQueryParam = this.positionForm.value.sortBy ? `${urlQueryParam ? urlQueryParam + '&' : ''}sort=${this.positionForm.value.sortBy}` : urlQueryParam;

      }


      this.userSkillsList.forEach(skill => {
        queryString = queryString ? queryString + `&skills=${skill.skill_id}&skillName=${skill.skill}` : `skills=${skill.skill_id}&skillName=${skill.skill}`;
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

      if (this.queryFlag || this.prequeryFlag) {
        this.router.navigate(['/positions'], { queryParams: { search: urlQueryParam ? urlQueryParam : '' } });
      }
      this.urlQueryParameter = queryString;

    }
    return queryString;
  }

  getJobData(offset?) {
    this.prequeryFlag = true;
    this.offsetFlag = false;
    this.selectedAllFlag = false;

    if (this.preLoadDataObject[this.currentPageNumber]) {
      this.positionList = this.preLoadDataObject[this.currentPageNumber].data.data;
      this.setPaginationValues(this.preLoadDataObject[this.currentPageNumber]);
      if (this.currentPageNumber < this.paginationArr[this.paginationArr.length - 1]) {
        this.preLoadNextPage(this.currentPageNumber + 1);
      } else {
        this.router.navigate(['/positions'], { queryParams: { param: this.urlQueryParameter ? this.urlQueryParameter : '' } });
      }
    } else {
      // this.isJobLoading = true;
      let queryParameters;
      queryParameters = this.generateQueryString();
      this.positionService.getPositions(queryParameters).subscribe(
        dataJson => {
          // this.isJobLoading = false;
          if (dataJson['success'] && dataJson.data.data) {
            this.positionList = dataJson.data.data;
            this.setPaginationValues(dataJson);
            if (this.currentPageNumber < this.paginationArr[this.paginationArr.length - 1]) {
              this.preLoadNextPage(this.currentPageNumber + 1);
            }

          }
        },
        error => {
          // this.isJobLoading = false;
          this.alertsService.show(error.message, AlertType.error);
          this.positionList = [];
        }
      );
    }
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

  clearFilter() {
    const sortValue = this.positionForm.value.sortBy;
    const setPositionValue = this.positionForm.value.searchPosition;
    this.positionForm.reset();
    this.userSkillsList = [];
    this.preLoadDataObject = {};
    this.positionForm.patchValue({ 'sortBy': sortValue });
    this.positionForm.patchValue({ 'searchPosition': setPositionValue });
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
    this.prequeryFlag = true;
    this.offsetFlag = false;
    this.filterAttributes.offset = 0;
    this.preLoadDataObject = {};
    this.getJobData();
    event.stopPropagation();
  }

  applyFilter() {
    this.prequeryFlag = true;
    this.offsetFlag = false;
    this.filterAttributes.offset = 0;
    this.toggleTabMenuOpen();
    this.preLoadDataObject = {};
    this.getJobData();
  }

  pageClicked(pageNo) {
    this.prequeryFlag = true;
    this.offsetFlag = false;
    document.getElementById('sidenav-content').scrollTo(0, 0);
    if (pageNo > 0 && pageNo <= this.paginationArr[this.paginationArr.length - 1]) {
      this.currentPageNumber = pageNo;
      this.filterAttributes.offset = ((this.currentPageNumber - 1) * positionListLimit);
      this.offsetParam = this.filterAttributes.offset;
      this.getJobData(this.offsetParam);
    }
  }

  preLoadNextPage(nextPageNumber) {
    this.queryFlag = false;
    if (!this.preLoadDataObject[nextPageNumber]) {
      const previousOffset = this.filterAttributes.offset;
      this.filterAttributes.offset = this.filterAttributes.offset + positionListLimit;
      const queryString = this.generateQueryString();
      this.positionService.getPositions(queryString).subscribe(
        dataJson => {
          if (dataJson['success'] && dataJson) {
            this.preLoadDataObject = {};
            this.preLoadDataObject[nextPageNumber] = dataJson;
          }
          this.filterAttributes.offset = previousOffset;
        },
        error => {
          this.positionList = [];
        }
      );
    }
  }

}
