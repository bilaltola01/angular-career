import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AlertsService, AlertType, AutoCompleteService, CareerFairService, PositionService, ApplicationService, CartService } from '../../../services/index';
import { City, SortBy, Company, companyListLimit, positionListLimit, Skill, School, Industry, Major, Recruiter, PositionLevel, EducationLevel, JobType } from 'src/app/models';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
@Component({
  selector: 'app-careerfair-info',
  templateUrl: './careerfair-info.component.html',
  styleUrls: ['./careerfair-info.component.scss']
})
export class CareerfairInfoComponent implements OnInit {
  careerfairId;

  // FormGroup
  careerFairForm: FormGroup;
  // Autocomplete list
  //  autocomplete_cities: City[] = [];
  //  autocomplete_companies: Company[][] = [];
  companiesList = [];
  //  autocomplete_searchposition = [];
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
  filter_list: boolean;
  companyCurrentPageNumber = 1;
  positionCurrentPageNumber = 1;
  companyPaginationArr = [];
  positionPaginationArr = [];
  preLoadCompanyDataObject = {};
  preloadPositionData = {};
  searchQueryParam;
  urlParams = {};
  offsetFlag = false;
  queryFlag = true;
  prequeryFlag = false;
  preLoadDataFlag = true;
  offsetParam;
  urlQueryParameter;
  minDate = new Date;
  careerFairData = [];
  compaiesCount;
  positionsCount;
  currentPage: string;
  public Object = Object;

  // Position Variable+
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

  // isJobLoading = true;
  // selectedAllFlag = false;
  mathFloor = Math.floor;
  // filter_list: boolean;
  // currentPageNumber = 1;
  // paginationArr = [];
  appliedJobs = [];
  appliedJobsMap = {};
  // preLoadDataObject = {};
  updatedFitscoreList = [];
  // searchQueryParam;
  // urlParams = {};
  // offsetFlag = false;
  breakpoint: number;
  sortBy: object[] = SortBy;


  constructor(private autoCompleteService: AutoCompleteService, private route: ActivatedRoute, private router: Router,
    private alertsService: AlertsService, private cartService: CartService, private applicationService: ApplicationService, private positionService: PositionService, private careerfairService: CareerFairService) {
    this.careerfairId = this.route.snapshot.paramMap.get('careerfair_id');
    this.getCareerFairInfo(this.careerfairId);
    this.getCareerFairCompaniesCount(this.careerfairId);
    this.getCareerFairPositionsCount(this.careerfairId);
    this.parseRouterUrl(router.url);
  }
  ngOnInit() {
    // const urlParams = new URLSearchParams(window.location.search);
    // this.searchQueryParam = urlParams.get('CompanySearch');

    // if (this.searchQueryParam) {
    //   this.preLoadDataFlag = false;
    //   this.offsetFlag = true;
    //   const urlObject = this.searchQueryParam.split('&');

    //   for (let i = 0; i < urlObject.length; i++) {
    //     const result = urlObject[i].split('=');
    //     this.urlParams[result[0]] = result[1];
    //   }
    // }
    this.initCompanyFilterForm();
    this.initPositionFilterForm();
    this.getCompanyData();
    this.getPositionsData();
    this.getSavedJobs();
    this.getAppliedJobs();
    this.breakpoint = (window.innerWidth <= 500) ? 2 : 4;
  }
  toggleTabMenuOpen() {
    this.filter_list = !this.filter_list;
  }

  parseRouterUrl(url: string) {
    if (url.includes('careerfair-info')) {
      this.router.events.subscribe((val) => {
        if (val instanceof NavigationEnd) {
          if (!(val.url.includes('company')) && !(val.url.includes('position'))) {
            // console.log('not in both page')
            this.currentPage = 'company';
            this.router.navigate([`company`], { relativeTo: this.route });
          } else if (val.url.includes('company')) {
            this.currentPage = 'company';
            // console.log('company page')
            // this.router.navigate([`company`], { relativeTo: this.route });
          } else if (val.url.includes('position')) {
            this.currentPage = 'position';
            //  console.log('position page')
            //  this.router.navigate([`position`], { relativeTo: this.route });
          }
        }
      });
    }
  }

  // Carrerfair-information Start
  getCareerFairInfo(careerfairId) {
    this.careerfairService.getCareerFairById(careerfairId).subscribe(dataJson => {
      if (dataJson) {
        this.careerFairData.push(dataJson.data);
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
  // careerfair information Ends


  // Company information Start
  initCompanyFilterForm() {
    this.careerFairForm = new FormGroup({
      'searchCompany': new FormControl(null),
      'location': new FormControl(null),
      'company': new FormControl(null),
      'date': new FormControl(null),
    });
    this.careerFairForm.get('location').valueChanges.subscribe((location) => {
      location ? this.onCityValueChanges(location) : this.autocomplete_cities = [];
    });
    this.careerFairForm.get('company').valueChanges.subscribe((company) => {
      company ? this.onCompanyValueChanges(company) : this.autocomplete_companies = [];
    });
  }

  onCityValueChanges(location: string) {
    this.autoCompleteService.autoComplete(location, 'cities').subscribe(
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
    queryString = this.careerFairForm.value.location ? `${queryString ? queryString + '&' : ''}location=${this.careerFairForm.value.location ? this.careerFairForm.value.location : ''}` : queryString;
    queryString = this.careerFairForm.value.company ? `${queryString ? queryString + '&' : ''}company=${this.careerFairForm.value.company}` : queryString;
    queryString = this.careerFairForm.value.date ? `${queryString ? queryString + '&' : ''}date=${this.careerFairForm.value.date}` : queryString;
    queryString = queryString ? `${queryString}&offset=${this.companyFilterAttributes.offset}` : `offset=${this.companyFilterAttributes.offset}`;
    queryString = queryString ? `${queryString}&limit=${this.companyFilterAttributes.limit}` : `offset=${this.companyFilterAttributes.limit}`;
    queryString = this.careerFairForm.value.searchCompany ? `${queryString ? queryString + '&' : ''}name=${this.careerFairForm.value.searchCompany}` : queryString;

    return queryString;
  }

  getCompanyData() {
    // this.companyCurrentPageNumber = (this.companyFilterAttributes.offset / this.companyFilterAttributes.limit) + 1;
    if (this.preLoadCompanyDataObject[this.companyCurrentPageNumber]) {
      this.companiesList = this.preLoadCompanyDataObject[this.companyCurrentPageNumber].data.data;
      this.setCompanyPaginationValues(this.preLoadCompanyDataObject[this.companyCurrentPageNumber]);
      if (this.companyCurrentPageNumber < this.companyPaginationArr[this.companyPaginationArr.length - 1]) {
        this.preLoadCompanyNextPage(this.companyCurrentPageNumber + 1);
      }
    } else {
      this.isJobLoading = true;
      let queryParameters;
      queryParameters = this.generateCompanyQueryString();
      // console.log('company list queryParameters', queryParameters)
      this.careerfairService.getPresentcompanies(this.careerfairId, queryParameters).subscribe(
        dataJson => {
          this.isJobLoading = false;
          if (dataJson['success'] && dataJson.data.data) {
            this.companiesList = dataJson.data.data;
            // console.log('careerfair companies ', this.companiesList)
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
  parseReverseCompanySize(companySizeTypes: string): string {
    let company_size = 'Small (1 - 49)';
    if (companySizeTypes.includes('medium')) {
      company_size = 'Medium (50 - 499)';
    } else if (companySizeTypes.includes('large')) {
      company_size = 'Large (500+)';
    }

    return company_size;
  }
  setCompanyPaginationValues(dataJson) {
    // console.log("data=====================>", dataJson);
    let max;
    let min;
    if (this.companyCurrentPageNumber >= 5) {
      max = Math.ceil(dataJson.data.count / companyListLimit) <= 6 ? Math.ceil(dataJson.data.count / companyListLimit) + this.companyCurrentPageNumber - 1 : this.companyCurrentPageNumber + 6;
      min = max > 10 ? max - 9 : 1;
    } else {
      max = Math.ceil((dataJson.data.count + this.companyFilterAttributes.offset) / companyListLimit) < 10 ? Math.ceil((dataJson.data.count + this.companyFilterAttributes.offset) / companyListLimit) : 10;
      min = 1;
    }
    this.companyPaginationArr = Array(max - min + 1).fill(0).map((x, i) => i + min);
  }
  clearCompanyFilter() {
    // const sortValue = this.careerFairForm.value.sortBy;
    const setPositionValue = this.careerFairForm.value.searchCompany;
    this.careerFairForm.reset();
    this.preLoadCompanyDataObject = {};
    this.careerFairForm.patchValue({ 'searchCompany': setPositionValue });
    this.toggleTabMenuOpen();
  }

  onSearchCompany(event) {
    this.companyFilterAttributes.offset = 0;
    this.preLoadCompanyDataObject = {};
    this.getCompanyData();
    event.stopPropagation();
  }

  applyCompanyFilter() {
    this.prequeryFlag = true;
    this.offsetFlag = false;
    this.companyFilterAttributes.offset = 0;
    this.toggleTabMenuOpen();
    this.preLoadCompanyDataObject = {};
    this.getCompanyData();
  }
  companyPageClicked(pageNo) {
    // console.log('pageno', pageNo, this.companyPaginationArr)
    // this.prequeryFlag = true;
    // this.offsetFlag = false;
    document.getElementById('sidenav-content').scrollTo(0, 0);
    if (pageNo > 0 && pageNo <= this.companyPaginationArr[this.companyPaginationArr.length - 1]) {
      this.companyCurrentPageNumber = pageNo;
      this.companyFilterAttributes.offset = ((this.companyCurrentPageNumber - 1) * companyListLimit);
      this.offsetParam = this.companyFilterAttributes.offset;
      this.getCompanyData();
    }
  }
  preLoadCompanyNextPage(nextPageNumber) {
    this.queryFlag = false;
    if (!this.preLoadCompanyDataObject[nextPageNumber]) {
      const previousOffset = this.companyFilterAttributes.offset;
      this.companyFilterAttributes.offset = this.companyFilterAttributes.offset + companyListLimit;
      const queryString = this.generateCompanyQueryString();
      this.careerfairService.getPresentcompanies(this.careerfairId, queryString).subscribe(
        dataJson => {
          if (dataJson['success'] && dataJson) {
            this.preLoadCompanyDataObject = {};
            this.preLoadCompanyDataObject[nextPageNumber] = dataJson;
            // console.log('preload company ', this.preLoadCompanyDataObject[nextPageNumber])
          }
          this.companyFilterAttributes.offset = previousOffset;
        },
        error => {
          this.companiesList = [];
        }
      );
    }
  }

  navigateToCompanies() {
    this.currentPage = 'company';
    this.abcFlag = true;
    this.router.navigate([`company`], { relativeTo: this.route });
  }

  navigateToPositions() {
    this.currentPage = 'position';
    this.abcFlag = false;
    this.router.navigate([`position`], { relativeTo: this.route });
  }
  routerNavigate(application_id, position_id) {
    this.router.navigate([`/applications/${application_id}/application-detail/`, position_id]);
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
      // console.log("data",searchPosition);
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
    this.positionForm.patchValue({ skill: '' });
    if (this.userSkillsList.findIndex(skill => skillItem.skill_id === skill.skill_id) === -1) {
      this.userSkillsList.push(skillItem);
    }
  }
  removeUserSkillsData(index: number) {
    this.userSkillsList.splice(index, 1);
  }
  generateQueryString(): string {
    let queryString;
    queryString = this.positionForm.value.city ? `${queryString ? queryString + '&' : ''}city=${this.filterAttributes.city_id ? this.filterAttributes.city_id : this.urlParams['city']}` : queryString;
    queryString = this.positionForm.value.position ? `${queryString ? queryString + '&' : ''}level=${this.positionForm.value.position}` : queryString;
    queryString = this.positionForm.value.education ? `${queryString ? queryString + '&' : ''}education=${parseInt(this.positionForm.value.education, 10) + 1}` : queryString;
    queryString = this.positionForm.value.job ? `${queryString ? queryString + '&' : ''}job_type=${this.positionForm.value.job}` : queryString;
    queryString = this.positionForm.value.school ? `${queryString ? queryString + '&' : ''}school=${this.filterAttributes.school_id ? this.filterAttributes.school_id : this.urlParams['school']}` : queryString;
    queryString = this.positionForm.value.major ? `${queryString ? queryString + '&' : ''}major=${this.filterAttributes.major_id ? this.filterAttributes.major_id : this.urlParams['major']}` : queryString;
    queryString = this.positionForm.value.industry ? `${queryString ? queryString + '&' : ''}industry=${this.filterAttributes.industry_id ? this.filterAttributes.industry_id : this.urlParams['industry']}` : queryString;
    queryString = this.positionForm.value.company ? `${queryString ? queryString + '&' : ''}company=${this.positionForm.value.company}` : queryString;
    queryString = this.positionForm.value.minSal ? `${queryString ? queryString + '&' : ''}pay=${this.positionForm.value.minSal}` : queryString;
    queryString = this.positionForm.value.recruiter ? `${queryString ? queryString + '&' : ''}recruiter=${this.filterAttributes.recruiter_id ? this.filterAttributes.recruiter_id : this.urlParams['recruiter']}` : queryString;
    queryString = this.positionForm.value.searchPosition ? `${queryString ? queryString + '&' : ''}position=${this.positionForm.value.searchPosition}` : queryString;
    queryString = this.positionForm.value.sortBy ? `${queryString ? queryString + '&' : ''}sort=${this.positionForm.value.sortBy}` : queryString;
    queryString = queryString ? `${queryString}&offset=${this.filterAttributes.offset}` : `offset=${this.filterAttributes.offset}`;
    queryString = queryString ? `${queryString}&limit=${this.filterAttributes.limit}` : `offset=${this.filterAttributes.limit}`;
    this.userSkillsList.forEach(skill => {
      queryString = queryString ? queryString + `&skills=${skill.skill_id}&skillName=${skill.skill}` : `skills=${skill.skill_id}&skillName=${skill.skill}`;
    });
    // console.log(queryString)
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
    this.filterAttributes.offset = 0;
    this.toggleTabMenuOpen();
    this.preloadPositionData = {};
    this.getPositionsData();
  }
  clearPositionFilter() {
    // const sortValue = this.careerFairForm.value.sortBy;
    // const setPositionValue = this.careerFairForm.value;
    this.positionForm.reset();
    this.preloadPositionData = {};
    // this.careerFairForm.patchValue({ 'searchCompany': setPositionValue });
    this.toggleTabMenuOpen();
  }
  getPositionsData() {
    this.queryFlag = true;
    this.selectedAllFlag = false;
    this.positionCurrentPageNumber = (this.filterAttributes.offset / this.filterAttributes.limit) + 1;
    if (this.preloadPositionData[this.positionCurrentPageNumber]) {
      // console.log('if');
      this.positionList = this.preloadPositionData[this.positionCurrentPageNumber].data.data;
      // console.log('position', this.positionList);
      this.setPositionPaginationValues(this.preloadPositionData[this.positionCurrentPageNumber]);
    } else {
      // console.log('else');
      this.isJobLoading = true;
      let queryParameters;
      queryParameters = this.generateQueryString();
      // console.log('queryParameters', queryParameters);
      this.careerfairService.getPresentPositions(this.careerfairId, queryParameters).subscribe(
        dataJson => {
          this.isJobLoading = false;
          if (dataJson['success'] && dataJson.data.data) {
            this.positionList = dataJson.data.data;
            // console.log('position', this.positionList)
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
            // console.log('positionpreload', this.preloadPositionData[nextPageNumber]);
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
    // console.log('pageno', pageNo, this.positionPaginationArr)
    document.getElementById('sidenav-content').scrollTo(0, 0);
    if (pageNo > 0 && pageNo <= this.positionPaginationArr[this.positionPaginationArr.length - 1]) {
      this.positionCurrentPageNumber = pageNo;
      this.filterAttributes.offset = ((this.positionCurrentPageNumber - 1) * companyListLimit);
      this.offsetParam = this.filterAttributes.offset;
      this.getPositionsData();
    }
  }
  setPositionPaginationValues(dataJson) {
    // console.log("data====================++++++++=>", dataJson);
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
}
