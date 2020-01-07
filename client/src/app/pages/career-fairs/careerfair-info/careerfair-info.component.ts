import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AlertsService, AlertType, AutoCompleteService, CareerFairService, PositionService, ApplicationService, CartService, HelperService, ScoreService } from '../../../services/index';
import { City, SortBy, Company, companyListLimit, positionListLimit, Skill, School, Industry, Major, Recruiter, PositionLevel, EducationLevel, JobType, CompanySizeTypes, SkillLevelDescription } from 'src/app/models';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { AddSkillPopupComponent } from 'src/app/components/add-skill-popup/add-skill-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { HostListener } from '@angular/core';
@Component({
  selector: 'app-careerfair-info',
  templateUrl: './careerfair-info.component.html',
  styleUrls: ['./careerfair-info.component.scss']
})
export class CareerfairInfoComponent implements OnInit {
  careerfairId;
  filter_list: boolean;
  careerFairData = [];
  compaiesCount;
  positionsCount;
  tabIndex: number;

  /* company info
     variables
    */
  careerFairForm: FormGroup;
  companiesList = [];
  abcFlag = true;
  companyFilterAttributes = {
    city_id: null,
    industry_id: null,
    major_id: null,
    school_id: null,
    recruiter_id: null,
    offset: 0,
    limit: companyListLimit
  };
  companyCurrentPageNumber = 1;
  companyOffsetFlag = false;
  companyUrlQueryParameter;

  companyUrlParams = {};
  companyPaginationArr = [];
  preLoadCompanyDataObject = {};
  companyQueryParam;
  companyQueryFlag = true;
  companyPreQueryFlag = false;
  companySizeTypes: string[] = CompanySizeTypes;

  /* position info
      variables
     */

  filterAttributes = {
    city_id: null,
    industry_id: null,
    major_id: null,
    school_id: null,
    recruiter_id: null,
    offset: 0,
    limit: positionListLimit
  };
  isJobLoading = true;
  selectedAllFlag = false;
  positionCurrentPageNumber = 1;
  positionPaginationArr = [];
  preloadPositionData = {};
  searchQueryParam;
  urlParams = {};
  offsetFlag = false;
  queryFlag = true;
  prequeryFlag = false;
  preLoadDataFlag = true;
  offsetParam;
  urlQueryParameter;
  companySize;
  minDate = new Date;
  currentPage: string;
  public Object = Object;
  positionLevel: string[] = PositionLevel;
  educationLevel: string[] = EducationLevel;
  jobType = JobType;
  positionForm: FormGroup;
  autocomplete_cities: City[] = [];
  autocomplete_skills: Skill[] = [];
  autocomplete_school: School[][] = [];
  autocomplete_additional_industries: Industry[][] = [];
  autocomplete_education_major: Major[][] = [];
  autocomplete_companies: Company[][] = [];
  autocomplete_recruiter: Recruiter[][] = [];
  userSkillsList = [];
  positionList = [];
  savedJobs = [];
  savedJobsMap = {};
  autocomplete_searchposition = [];
  applicationUrlParams;

  mathFloor = Math.floor;
  appliedJobs = [];
  appliedJobsMap = {};
  updatedFitscoreList = [];
  breakpoint: number;
  sortBy: object[] = SortBy;
  skillUrlParams = [];
  skillUrlIdParam = [];

  autocomplete_industries: Industry[] = [];
  SkillLevelDescription = SkillLevelDescription;

  constructor(private autoCompleteService: AutoCompleteService,
    public helperService: HelperService,
    private route: ActivatedRoute,
    private router: Router,
    private alertsService: AlertsService,
    public dialog: MatDialog,
    private scoreService: ScoreService,
    private cartService: CartService,
    private applicationService: ApplicationService,
    private careerfairService: CareerFairService) {
    this.updateSkillCallback = this.updateSkillCallback.bind(this);
    this.careerfairId = parseInt(this.route.snapshot.queryParamMap.get('id'), 10) || null;
    if (this.route.snapshot.queryParamMap.has('tabIndex')) {
      this.tabIndex = parseInt(this.route.snapshot.queryParamMap.get('tabIndex'), 10);
    } else {
      this.tabIndex = 0;
    }
    if (this.careerfairId) {
      this.getCareerFairInfo(this.careerfairId);
      this.getCareerFairCompaniesCount(this.careerfairId);
      this.getCareerFairPositionsCount(this.careerfairId);
    }
  }
  ngOnInit() {
    this.initCompanyFilterForm();
    this.initPositionFilterForm();
  }
  // Carrerfair-information Start
  getCareerFairInfo(careerfairId) {
    this.careerfairService.getCareerFairById(careerfairId).subscribe(dataJson => {
      if (dataJson) {
        this.careerFairData.push(dataJson.data);
        this.selectTabMenu(this.tabIndex);
      }
    },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      });
  }
  getCareerFairCompaniesCount(careerFairId) {
    this.careerfairService.getCompaniesCount(careerFairId).subscribe(dataJson => {
      if (dataJson) {
        this.compaiesCount = dataJson.data['count'];
      }
    },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      });
  }
  getCareerFairPositionsCount(careerFairId) {
    this.careerfairService.getPositionsCount(careerFairId).subscribe(dataJson => {
      if (dataJson) {
        this.positionsCount = dataJson.data['count'];
      }
    },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      });
  }



  selectTabMenu(tabIndex: number) {
    this.tabIndex = tabIndex;
    switch (this.tabIndex) {
      case 0:
        this.isJobLoading = false;
        this.loadCompanyInfo();
        break;
      case 1:
        this.loadPositionsInfo();
        break;
      default:
        break;
    }
  }
  toggleTabMenuOpen() {
    this.filter_list = !this.filter_list;
  }

  // careerfair information Ends
  loadCompanyInfo() {
    this.getCompanyQueryParams();
    this.initCompanyFilterForm();
    this.getCompanyData();
    this.breakpoint = (window.innerWidth <= 500) ? 2 : 4;
  }
  getCompanyQueryParams() {
    const urlParams = new URLSearchParams(window.location.search);
    this.companyQueryParam = urlParams.get('CompanySearch');
    if (this.companyQueryParam) {
      this.companyUrlParams = {};
      this.preLoadDataFlag = false;
      this.companyOffsetFlag = true;
      const urlObject = this.companyQueryParam.split('&');

      for (let i = 0; i < urlObject.length; i++) {
        const result = urlObject[i].split('=');
        this.companyUrlParams[result[0]] = result[1];
      }
    }
  }
  loadPositionsInfo() {
    this.getPositionQueryParams();
    this.initPositionFilterForm();
    this.getPositionsData();
    this.getSavedJobs();
    this.getAppliedJobs();
    this.breakpoint = (window.innerWidth <= 500) ? 2 : 4;
  }
  getPositionQueryParams() {
    const urlParams = new URLSearchParams(window.location.search);
    this.searchQueryParam = urlParams.get('PositionSearch');
    if (this.searchQueryParam) {
      this.urlParams = {};
      this.skillUrlParams = [];
      this.skillUrlIdParam = [];
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
  }

  /* Company information
  Start */
  parseCompanySize(companySizeTypes: string): string {
    let company_size = 'small';
    if (companySizeTypes.includes('Medium')) {
      company_size = 'medium';
    } else if (companySizeTypes.includes('Large')) {
      company_size = 'large';
    }

    return company_size;
  }

  parseReverseCompanySize(companySizeTypes: string): string {
    let company_size = 'Small (1 - 49)';
    if (companySizeTypes.includes('medium')) {
      company_size = 'Medium (50 - 499)';
    } else if (companySizeTypes.includes('large')) {
      company_size = 'Large (500+)';
    }
    return company_size;
  }



  initCompanyFilterForm() {
    this.careerFairForm = new FormGroup({
      'searchCompany': new FormControl(null),
      'industry': new FormControl(null),
      'size': new FormControl(null)
    });

    this.careerFairForm.get('industry').valueChanges.subscribe((industry) => {
      industry ? this.onCompanyIndustryValueChanges(industry) : this.autocomplete_industries = [];
    });
    if (this.companyQueryParam) {
      this.careerFairForm.patchValue({
        'searchCompany': this.companyUrlParams['name'],
        'industry': this.companyUrlParams['industryName'],
      });
      if (this.companyUrlParams['size']) {
        this.careerFairForm.patchValue({
          'size': this.parseReverseCompanySize(this.companyUrlParams['size'])
        });
      }
    }

  }


  onCompanyChangeIndustry(industry) {
    this.companyFilterAttributes['industry_id'] = industry.industry_id;
  }
  onCompanyIndustryValueChanges(industry: string) {
    this.autoCompleteService.autoComplete(industry, 'industries').subscribe(
      dataJson => {
        if (dataJson['success']) {
          this.autocomplete_industries = dataJson['data'];
        }
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
        this.autocomplete_industries = [];
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

  generateCompanyQueryString(): string {
    let queryString;
    let urlQueryParam;
    if (this.companyQueryParam) {
      queryString = this.companyQueryParam;
      this.companyQueryParam = null;
    } else {
      queryString = this.careerFairForm.value.size ? `${queryString ? queryString + '&' : ''}size=${this.parseCompanySize(this.careerFairForm.value.size)}` : queryString;

      queryString = this.careerFairForm.value.industry ? `${queryString ? queryString + '&' : ''}industry=${this.companyFilterAttributes.industry_id ? this.companyFilterAttributes.industry_id : this.companyUrlParams['industry']}&industryName=${this.careerFairForm.value.industry}` : queryString;
      queryString = this.careerFairForm.value.searchCompany ? `${queryString ? queryString + '&' : ''}name=${this.careerFairForm.value.searchCompany}` : queryString;

      if (this.companyOffsetFlag) {
        queryString = queryString ? `${queryString}&offset=${parseInt(this.companyUrlParams['offset'], 10) + parseInt(this.companyUrlParams['limit'], 10)}` : `offset=${parseInt(this.companyUrlParams['offset'], 10) + this.companyFilterAttributes.limit}`;

        queryString = queryString ? `${queryString}&limit=${parseInt(this.companyUrlParams['limit'], 10)}` : `offset=${parseInt(this.companyUrlParams['limit'], 10)}`;

        this.companyOffsetFlag = false;
      } else {

        queryString = queryString ? `${queryString}&offset=${this.companyFilterAttributes.offset}` : `offset=${this.companyFilterAttributes.offset}`;

        queryString = queryString ? `${queryString}&limit=${this.companyFilterAttributes.limit}` : `offset=${this.companyFilterAttributes.limit}`;
      }
      urlQueryParam = this.careerFairForm.value.industry ? `${urlQueryParam ? urlQueryParam + '&' : ''}industry=${this.companyFilterAttributes.industry_id ? this.companyFilterAttributes.industry_id : this.companyUrlParams['industry']}&industryName=${this.careerFairForm.value.industry}` : urlQueryParam;
      urlQueryParam = this.careerFairForm.value.searchCompany ? `${urlQueryParam ? urlQueryParam + '&' : ''}name=${this.careerFairForm.value.searchCompany}` : urlQueryParam;
      urlQueryParam = this.careerFairForm.value.size ? `${urlQueryParam ? urlQueryParam + '&' : ''}size=${this.careerFairForm.value.size ? this.parseCompanySize(this.careerFairForm.value.size) : ''}` : urlQueryParam;
      if (this.offsetParam || this.companyFilterAttributes.offset === 0 || this.companyFilterAttributes.offset === this.companyFilterAttributes.limit) {

        urlQueryParam = urlQueryParam ? `${urlQueryParam}&offset=${this.companyFilterAttributes.offset === 0 || this.companyFilterAttributes.offset === this.companyFilterAttributes.limit ? 0 : this.offsetParam}` : `offset=${this.companyFilterAttributes.offset === 0 || this.companyFilterAttributes.offset === this.companyFilterAttributes.limit ? 0 : this.offsetParam}`;

        urlQueryParam = urlQueryParam ? `${urlQueryParam}&limit=${this.companyFilterAttributes.limit}` : `offset=${this.companyFilterAttributes.limit}`;
      }

      if (this.companyQueryFlag || this.companyPreQueryFlag) {
        this.companyUrlQueryParameter = urlQueryParam;
        this.router.navigate(['/career-fairs/careerfair-info'], {
          queryParams: {
            id: this.careerfairId,
            tabIndex: this.tabIndex,
            CompanySearch: urlQueryParam ? urlQueryParam : ''
          }
        });
      }
      this.companyUrlQueryParameter = queryString;
    }
    return queryString;
  }

  getCompanyData() {
    this.companyQueryFlag = true;
    if (this.companyQueryParam) {
      this.companyCurrentPageNumber = (this.companyUrlParams['offset'] / this.companyUrlParams['limit']) + 1;
    } else {
      this.companyCurrentPageNumber = (this.companyFilterAttributes.offset / this.companyFilterAttributes.limit) + 1;
    }
    if (this.preLoadCompanyDataObject[this.companyCurrentPageNumber]) {
      this.companiesList = this.preLoadCompanyDataObject[this.companyCurrentPageNumber].data.data;

      this.setCompanyPaginationValues(this.preLoadCompanyDataObject[this.companyCurrentPageNumber]);
      if (this.companyCurrentPageNumber < this.companyPaginationArr[this.companyPaginationArr.length - 1]) {
        this.preLoadCompanyNextPage(this.companyCurrentPageNumber + 1);
      } else {
        this.router.navigate(['/career-fairs/careerfair-info'], {
          queryParams: {
            id: this.careerfairId,
            tabIndex: this.tabIndex,
            CompanySearch: this.companyUrlQueryParameter ? this.companyUrlQueryParameter : ''
          }
        });
      }
    } else {
      this.isJobLoading = true;
      let queryParameters;
      queryParameters = this.generateCompanyQueryString();
      this.careerfairService.getPresentcompanies(this.careerfairId, queryParameters).subscribe(
        dataJson => {
          this.isJobLoading = false;
          if (dataJson['success'] && dataJson.data.data) {
            this.companiesList = dataJson.data.data;
            this.setCompanyPaginationValues(dataJson);
            if (this.companyCurrentPageNumber < this.companyPaginationArr[this.companyPaginationArr.length - 1]) {
              this.preLoadCompanyNextPage(this.companyCurrentPageNumber + 1);
            }
          }
        },
        error => {
          this.isJobLoading = false;
          this.alertsService.show(error.message, AlertType.error);
          this.companiesList = [];
        }
      );
    }
  }
  setCompanyPaginationValues(dataJson) {
    let max;
    let min;
    if (this.companyCurrentPageNumber >= 5) {
      max = Math.ceil(dataJson.data.count / companyListLimit) <= 6 ? Math.ceil(dataJson.data.count / companyListLimit) + this.companyCurrentPageNumber - 1 : this.companyCurrentPageNumber + 6;
      min = max > 10 ? max - 9 : 1;
    } else {
      if (this.companyOffsetFlag) {
        this.companyFilterAttributes.offset = parseInt(this.companyUrlParams['offset'], 10);
      }
      max = Math.ceil((dataJson.data.count + this.companyFilterAttributes.offset) / companyListLimit) < 10 ? Math.ceil((dataJson.data.count + this.companyFilterAttributes.offset) / companyListLimit) : 10;
      min = 1;
    }
    this.companyPaginationArr = Array(max - min + 1).fill(0).map((x, i) => i + min);
  }
  clearCompanyFilter() {
    const setPositionValue = this.careerFairForm.value.searchCompany;
    this.careerFairForm.reset();
    this.preLoadCompanyDataObject = {};
    this.careerFairForm.patchValue({ 'searchCompany': setPositionValue });
    this.toggleTabMenuOpen();
  }

  onSearchCompany(event) {
    this.companyOffsetFlag = false;
    this.companyPreQueryFlag = true;
    this.companyFilterAttributes.offset = 0;
    this.preLoadCompanyDataObject = {};
    this.getCompanyData();
    event.stopPropagation();
  }

  applyCompanyFilter() {
    this.companyPreQueryFlag = true;
    this.companyOffsetFlag = false;
    this.companyFilterAttributes.offset = 0;
    this.toggleTabMenuOpen();
    this.preLoadCompanyDataObject = {};
    this.getCompanyData();
  }
  companyPageClicked(pageNo) {
    this.companyPreQueryFlag = true;
    this.companyOffsetFlag = false;
    document.getElementById('sidenav-content').scrollTo(0, 0);
    if (pageNo > 0 && pageNo <= this.companyPaginationArr[this.companyPaginationArr.length - 1]) {
      this.companyCurrentPageNumber = pageNo;
      this.companyFilterAttributes.offset = ((this.companyCurrentPageNumber - 1) * companyListLimit);
      this.offsetParam = this.companyFilterAttributes.offset;
      this.getCompanyData();
    }
  }
  preLoadCompanyNextPage(nextPageNumber) {
    this.companyQueryFlag = false;
    if (!this.preLoadCompanyDataObject[nextPageNumber]) {
      const previousOffset = this.companyFilterAttributes.offset;
      this.companyFilterAttributes.offset = this.companyFilterAttributes.offset + companyListLimit;
      const queryString = this.generateCompanyQueryString();
      this.careerfairService.getPresentcompanies(this.careerfairId, queryString).subscribe(
        dataJson => {
          if (dataJson['success'] && dataJson) {
            this.preLoadCompanyDataObject = {};
            this.preLoadCompanyDataObject[nextPageNumber] = dataJson;
          }
          this.companyFilterAttributes.offset = previousOffset;
        },
        error => {
          this.companiesList = [];
        }
      );
    }
  }


  // Position starts
  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 500) ? 2 : 4;
  }
  reloadResult() {
    this.prequeryFlag = true;
    this.offsetFlag = false;
    this.filterAttributes.offset = 0;
    this.preloadPositionData = {};
    this.getPositionsData();
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
      'company': new FormControl(null),
      'post': new FormControl(null),
      'school': new FormControl(null),
      'recruiter': new FormControl(null),
      'sortBy': new FormControl('qualification')

    });

    this.positionForm.get('searchPosition').valueChanges.subscribe((searchPosition) => {
      searchPosition ? this.onSearchPositionValueChanges(searchPosition) : this.autocomplete_searchposition = [];
    });
    this.positionForm.get('city').valueChanges.subscribe((city) => {
      city ? this.onPositionCityValueChanges(city) : this.autocomplete_cities = [];
    });
    this.positionForm.get('major').valueChanges.subscribe((major) => {
      major ? this.onMajorValueChanges(major) : this.autocomplete_education_major = [];
    });
    this.positionForm.get('industry').valueChanges.subscribe((industry) => {
      industry ? this.onIndustryValueChanges(industry) : this.autocomplete_additional_industries = [];
    });
    this.positionForm.get('company').valueChanges.subscribe((company) => {
      company ? this.onPositionCompanyValueChanges(company) : this.autocomplete_companies = [];
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
        'position': this.urlParams['level'],
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
  onPositionCityValueChanges(city: string) {
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
  onPositionCompanyValueChanges(company: string) {
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
      this.applicationUrlParams = this.searchQueryParam;
      this.searchQueryParam = null;
    } else {
      queryString = this.positionForm.value.city ? `${queryString ? queryString + '&' : ''}city=${this.filterAttributes.city_id ? this.filterAttributes.city_id : this.urlParams['city']}` : queryString;
      queryString = this.positionForm.value.position ? `${queryString ? queryString + '&' : ''}level=${this.positionForm.value.position}` : queryString;
      queryString = this.positionForm.value.education ? `${queryString ? queryString + '&' : ''}education=${parseInt(this.positionForm.value.education, 10)}` : queryString;
      queryString = this.positionForm.value.job ? `${queryString ? queryString + '&' : ''}job_type=${this.positionForm.value.job}` : queryString;
      queryString = this.positionForm.value.school ? `${queryString ? queryString + '&' : ''}school=${this.filterAttributes.school_id ? this.filterAttributes.school_id : this.urlParams['school']}` : queryString;
      queryString = this.positionForm.value.major ? `${queryString ? queryString + '&' : ''}major=${this.filterAttributes.major_id ? this.filterAttributes.major_id : this.urlParams['major']}` : queryString;
      queryString = this.positionForm.value.industry ? `${queryString ? queryString + '&' : ''}industry=${this.filterAttributes.industry_id ? this.filterAttributes.industry_id : this.urlParams['industry']}` : queryString;
      queryString = this.positionForm.value.company ? `${queryString ? queryString + '&' : ''}company=${this.positionForm.value.company}` : queryString;
      queryString = this.positionForm.value.minSal ? `${queryString ? queryString + '&' : ''}pay=${this.positionForm.value.minSal}` : queryString;
      queryString = this.positionForm.value.recruiter ? `${queryString ? queryString + '&' : ''}recruiter=${this.filterAttributes.recruiter_id ? this.filterAttributes.recruiter_id : this.urlParams['recruiter']}` : queryString;
      queryString = this.positionForm.value.sortBy ? `${queryString ? queryString + '&' : ''}sort=${this.positionForm.value.sortBy}` : queryString;
      if (this.offsetFlag) {
        queryString = queryString ? `${queryString}&offset=${parseInt(this.urlParams['offset'], 10) + parseInt(this.urlParams['limit'], 10)}` : `offset=${parseInt(this.urlParams['offset'], 10) + this.filterAttributes.limit}`;
        queryString = queryString ? `${queryString}&limit=${parseInt(this.urlParams['limit'], 10)}` : `offset=${parseInt(this.urlParams['limit'], 10)}`;
        this.offsetFlag = false;
      } else {
        queryString = queryString ? `${queryString}&offset=${this.filterAttributes.offset}` : `offset=${this.filterAttributes.offset}`;
        queryString = queryString ? `${queryString}&limit=${this.filterAttributes.limit}` : `offset=${this.filterAttributes.limit}`;

      }
      queryString = this.positionForm.value.searchPosition ? `${queryString ? queryString + '&' : ''}position=${this.positionForm.value.searchPosition}` : queryString;
      urlQueryParam = this.positionForm.value.city ? `${urlQueryParam ? urlQueryParam + '&' : ''}city=${this.filterAttributes.city_id ? this.filterAttributes.city_id : this.urlParams['city']}&cityName=${this.positionForm.value.city}` : urlQueryParam;
      urlQueryParam = this.positionForm.value.position ? `${urlQueryParam ? urlQueryParam + '&' : ''}level=${this.positionForm.value.position}` : urlQueryParam;
      urlQueryParam = this.positionForm.value.education ? `${urlQueryParam ? urlQueryParam + '&' : ''}education=${parseInt(this.positionForm.value.education, 10)}` : urlQueryParam;
      urlQueryParam = this.positionForm.value.job ? `${urlQueryParam ? urlQueryParam + '&' : ''}job_type=${this.positionForm.value.job}` : urlQueryParam;
      urlQueryParam = this.positionForm.value.school ? `${urlQueryParam ? urlQueryParam + '&' : ''}school=${this.filterAttributes.school_id ? this.filterAttributes.school_id : this.urlParams['school']}&schoolName=${this.positionForm.value.school}` : urlQueryParam;
      urlQueryParam = this.positionForm.value.major ? `${urlQueryParam ? urlQueryParam + '&' : ''}major=${this.filterAttributes.major_id ? this.filterAttributes.major_id : this.urlParams['major']}&majorName=${this.positionForm.value.major}` : urlQueryParam;
      urlQueryParam = this.positionForm.value.industry ? `${urlQueryParam ? urlQueryParam + '&' : ''}industry=${this.filterAttributes.industry_id ? this.filterAttributes.industry_id : this.urlParams['industry']}&industryName=${this.positionForm.value.industry}` : urlQueryParam;
      urlQueryParam = this.positionForm.value.company ? `${urlQueryParam ? urlQueryParam + '&' : ''}company=${this.positionForm.value.company}` : urlQueryParam;
      urlQueryParam = this.positionForm.value.minSal ? `${urlQueryParam ? urlQueryParam + '&' : ''}pay=${this.positionForm.value.minSal}` : urlQueryParam;
      urlQueryParam = this.positionForm.value.recruiter ? `${urlQueryParam ? urlQueryParam + '&' : ''}recruiter=${this.filterAttributes.recruiter_id ? this.filterAttributes.recruiter_id : this.urlParams['recruiter']}&recruiterName=${this.positionForm.value.recruiter}` : urlQueryParam;
      urlQueryParam = this.positionForm.value.searchPosition ? `${urlQueryParam ? urlQueryParam + '&' : ''}position=${this.positionForm.value.searchPosition}` : urlQueryParam;

      if (this.offsetParam || this.filterAttributes.offset === 0 || this.filterAttributes.offset === this.filterAttributes.limit) {
        urlQueryParam = urlQueryParam ? `${urlQueryParam}&offset=${this.filterAttributes.offset === 0 || this.filterAttributes.offset === this.filterAttributes.limit ? 0 : this.offsetParam}` : `offset=${this.filterAttributes.offset === 0 || this.filterAttributes.offset === this.filterAttributes.limit ? 0 : this.offsetParam}`;
        urlQueryParam = urlQueryParam ? `${urlQueryParam}&limit=${this.filterAttributes.limit}` : `offset=${this.filterAttributes.limit}`;

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
        this.applicationUrlParams = urlQueryParam;
        this.router.navigate(['/career-fairs/careerfair-info'], {
          queryParams: {
            id: this.careerfairId,
            tabIndex: this.tabIndex,
            PositionSearch: urlQueryParam ? urlQueryParam : ''
          }
        });
      }
      this.urlQueryParameter = queryString;
    }
    return queryString;
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
    this.preloadPositionData = {};
    this.getPositionsData();
    event.stopPropagation();
  }
  applyPositionFilter() {
    this.prequeryFlag = true;
    this.offsetFlag = false;
    this.filterAttributes.offset = 0;
    this.toggleTabMenuOpen();
    this.preloadPositionData = {};
    this.getPositionsData();
  }
  clearPositionFilter() {
    const setPositionValue = this.careerFairForm.value.searchPosition;
    this.positionForm.reset();
    this.userSkillsList = [];
    this.preloadPositionData = {};
    this.skillUrlIdParam = [];
    this.skillUrlParams = [];
    this.careerFairForm.patchValue({ 'searchPosition': setPositionValue });
    this.toggleTabMenuOpen();
  }
  getPositionsData() {
    this.queryFlag = true;
    this.selectedAllFlag = false;
    if (this.searchQueryParam) {
      this.positionCurrentPageNumber = (this.urlParams['offset'] / this.urlParams['limit']) + 1;
    } else {
      this.positionCurrentPageNumber = (this.filterAttributes.offset / this.filterAttributes.limit) + 1;
    }
    if (this.preloadPositionData[this.positionCurrentPageNumber]) {
      this.positionList = this.preloadPositionData[this.positionCurrentPageNumber].data.data;
      this.setPositionPaginationValues(this.preloadPositionData[this.positionCurrentPageNumber]);
      if (this.positionCurrentPageNumber < this.positionPaginationArr[this.positionPaginationArr.length - 1]) {
        this.preLoadPositionNextPage(this.positionCurrentPageNumber + 1);
      } else {
        this.router.navigate(['/career-fairs/careerfair-info'], {
          queryParams: {
            id: this.careerfairId,
            tabIndex: this.tabIndex,
            PositionSearch: this.urlQueryParameter ? this.urlQueryParameter : ''
          }
        });
      }
    } else {
      this.isJobLoading = true;
      let queryParameters;
      queryParameters = this.generateQueryString();
      this.careerfairService.getPresentPositions(this.careerfairId, queryParameters).subscribe(
        dataJson => {
          this.isJobLoading = false;
          if (dataJson['success'] && dataJson.data.data) {
            this.positionList = dataJson.data.data;
            this.setPositionPaginationValues(dataJson);
            if (this.positionCurrentPageNumber < this.positionPaginationArr[this.positionPaginationArr.length - 1]) {
              this.preLoadPositionNextPage(this.positionCurrentPageNumber + 1);
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
  }
  preLoadPositionNextPage(nextPageNumber) {
    this.queryFlag = false;
    if (!this.preloadPositionData[nextPageNumber]) {
      const previousOffset = this.filterAttributes.offset;
      this.filterAttributes.offset = this.filterAttributes.offset + positionListLimit;
      const queryString = this.generateQueryString();
      this.careerfairService.getPresentPositions(this.careerfairId, queryString).subscribe(
        dataJson => {
          if (dataJson['success'] && dataJson) {
            this.preloadPositionData = {};
            this.preloadPositionData[nextPageNumber] = dataJson;
          }
          this.filterAttributes.offset = previousOffset;
        },
        error => {
          this.positionList = [];
        }
      );
    }
  }
  positionPageClicked(pageNo) {
    this.prequeryFlag = true;
    this.offsetFlag = false;
    document.getElementById('sidenav-content').scrollTo(0, 0);
    if (pageNo > 0 && pageNo <= this.positionPaginationArr[this.positionPaginationArr.length - 1]) {
      this.positionCurrentPageNumber = pageNo;
      this.filterAttributes.offset = ((this.positionCurrentPageNumber - 1) * positionListLimit);
      this.offsetParam = this.filterAttributes.offset;
      this.getPositionsData();
    }
  }
  setPositionPaginationValues(dataJson) {
    let max;
    let min;
    if (this.positionCurrentPageNumber >= 5) {
      max = Math.ceil(dataJson.data.count / positionListLimit) <= 6 ? Math.ceil(dataJson.data.count / positionListLimit) + this.positionCurrentPageNumber - 1 : this.positionCurrentPageNumber + 6;
      min = max > 10 ? max - 9 : 1;
    } else {
      if (this.offsetFlag) {
        this.filterAttributes.offset = parseInt(this.urlParams['offset'], 10);
      }
      max = Math.ceil((dataJson.data.count + this.filterAttributes.offset) / positionListLimit) < 10 ? Math.ceil((dataJson.data.count + this.filterAttributes.offset) / positionListLimit) : 10;
      min = 1;
    }
    this.positionPaginationArr = Array(max - min + 1).fill(0).map((x, i) => i + min);
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

  saveJob(positionArr) {
    this.cartService.saveJob(positionArr).subscribe(data => {
      for (const position of positionArr) {
        this.savedJobsMap[position.position_id] = position.position_id;
      }
      if (positionArr.length > 1) {
        // this.openSnackBarPosition();
      }
    },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      });
  }

  unSaveJob(positionData) {
    this.cartService.unSaveJob(positionData).subscribe(data => {
      delete this.savedJobsMap[positionData[0].position_id];
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
        if (data.length > 1) {
          // this.openSnackBarApplications();
        }
        this.removePositionFromLocalCart(data);
      },
        error => {
          this.alertsService.show(error.message, AlertType.error);
        });
  }
  getPositionIds() {
    let positionIds = this.positionList.map(position => `positionList=${position.position_id}`);
    if (this.preloadPositionData[this.positionCurrentPageNumber + 1] && this.preloadPositionData[this.positionCurrentPageNumber + 1].data.data) {
      const preLoadData = this.preloadPositionData[this.positionCurrentPageNumber + 1].data.data.map(position => `positionList=${position.position_id}`);
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
      });
  }
  updatedFitscore() {
    for (let i = 0; i < this.updatedFitscoreList.length; i++) {
      let index = this.positionList.findIndex(position => position.position_id === this.updatedFitscoreList[i].position_id);
      if (index > -1) {
        this.positionList[index]['true_fitscore_info'] = this.updatedFitscoreList[i];
      } else {
        index = this.preloadPositionData[this.positionCurrentPageNumber + 1].data.data.findIndex(position => position.position_id === this.updatedFitscoreList[i].position_id);
        this.preloadPositionData[this.positionCurrentPageNumber + 1].data.data[index]['true_fitscore_info'] = this.updatedFitscoreList[i];
      }
    }
  }
  applySelected() {
    const selectedPositionArr = this.positionList.filter(position => position.selected === true && !this.appliedJobsMap[position.position_id]);
    this.applyJob(selectedPositionArr);
  }

  saveSelected() {
    const selectedPositionArr = this.positionList.filter(position => position.selected === true && !this.savedJobsMap[position.position_id] && !this.appliedJobsMap[position.position_id]);
    this.saveJob(selectedPositionArr);
  }
  removePositionFromLocalCart(appliedJobs) {
    for (const jobs of appliedJobs) {
      delete this.savedJobsMap[jobs.position_id];
    }
  }
  routerNavigatePosition(position_id) {
    this.router.navigate([`/position-info/${position_id}`]);

  }
  routerNavigate(application_id, position_id) {
      this.router.navigate([`/applications/${application_id}/application-detail/`, position_id], {
        queryParams: {
          id: this.careerfairId,
          tabIndex: this.tabIndex,
          PositionSearchData: this.applicationUrlParams ? this.applicationUrlParams : this.urlQueryParameter
        }

      });
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
  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    // URL Params are updated on the next process tick, so we need to wait
    setTimeout(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const companyParams = urlParams.get('CompanySearch');
      const positionParams = urlParams.get('PositionSearch');
      if (positionParams && this.tabIndex === 1) {
        this.positionForm.reset();
        this.userSkillsList = [];
        this.preloadPositionData = {};
        this.skillUrlIdParam = [];
        this.skillUrlParams = [];
        this.getPositionQueryParams();
        this.initPositionFilterForm();
        this.applyPositionFilter();
      } else if (companyParams && this.tabIndex === 0) {
        this.careerFairForm.reset();
        this.preLoadCompanyDataObject = {};
        this.getCompanyQueryParams();
        this.initCompanyFilterForm();
        this.applyCompanyFilter();
      }
    }, 100);
  }
}
