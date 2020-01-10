import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AlertsService, AlertType, AutoCompleteService, CareerFairService } from '../../../services/index';

import { City, Company, careerFairsListLimit } from 'src/app/models';
import { Router, ActivatedRoute } from '@angular/router';
import { HostListener } from '@angular/core';


@Component({
  selector: 'app-career-fair-search',
  templateUrl: './career-fair-search.component.html',
  styleUrls: ['./career-fair-search.component.scss']
})
export class CareerFairSearchComponent implements OnInit {
  // FormGroup
  careerFairsForm: FormGroup;
  // Autocomplete list
  autocomplete_cities: City[] = [];
  autocomplete_companies: Company[][] = [];


  careerFairsList = [];
  autocomplete_searchposition = [];
  filterAttributes = {
    city_id: null,
    industry_id: null,
    major_id: null,
    school_id: null,
    recruiter_id: null,
    offset: 0,
    limit: careerFairsListLimit
  };


  isJobLoading = true;
  selectedAllFlag = false;
  filter_list: boolean;
  currentPageNumber = 1;
  paginationArr = [];
  preLoadDataObject = {};
  searchQueryParam;
  urlParams = {};
  offsetFlag = false;
  params = {};
  queryFlag = true;
  prequeryFlag = false;
  preLoadDataFlag = true;
  offsetParam;
  paramsInQuery;
  urlQueryParameter;
  urlQueryParameters;
  minDate = new Date;
  querySearchOffset;
  querySearchlimit;
  urlParamsDate;
  queryParamOffset;
  queryParamLimit;

  constructor(private autoCompleteService: AutoCompleteService, private router: Router, private route: ActivatedRoute,
    private alertsService: AlertsService, private careerfairService: CareerFairService) {
  }
  ngOnInit() {
    this.initPositionFilterForm();
    this.getJobData();

  }

  toggleTabMenuOpen() {
    this.filter_list = !this.filter_list;
  }
  initPositionFilterForm() {
    const querySearchedName = this.route.snapshot.queryParamMap.get('name') || null;
    const querySearchedDate = this.route.snapshot.queryParamMap.get('date') || null;
    const querySearchedLocation = this.route.snapshot.queryParamMap.get('location') || null;
    const querySearchedCompany = this.route.snapshot.queryParamMap.get('company') || null;
    this.queryParamOffset = this.route.snapshot.queryParamMap.get('offset') || null;
    this.queryParamLimit = this.route.snapshot.queryParamMap.get('limit') || null;
    if (this.queryParamOffset) {
      this.offsetFlag = true;
    }

    this.careerFairsForm = new FormGroup({
      'searchCareerfair': new FormControl(querySearchedName),
      'location': new FormControl(querySearchedLocation),
      'company': new FormControl(querySearchedCompany),
      'date': new FormControl(querySearchedDate),
    });
    this.careerFairsForm.get('location').valueChanges.subscribe((location) => {
      location ? this.onCityValueChanges(location) : this.autocomplete_cities = [];
    });
    this.careerFairsForm.get('company').valueChanges.subscribe((company) => {
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
  generateQueryString(): string {
    let queryString;
    queryString = this.careerFairsForm.value.location ? `${queryString ? queryString + '&' : ''}location=${this.careerFairsForm.value.location ? this.careerFairsForm.value.location : ''}` : queryString;
    queryString = this.careerFairsForm.value.company ? `${queryString ? queryString + '&' : ''}company=${this.careerFairsForm.value.company ? this.careerFairsForm.value.company : ''}` : queryString;
    queryString = this.careerFairsForm.value.date ? `${queryString ? queryString + '&' : ''}date=${this.careerFairsForm.value.date}` : queryString;
    queryString = this.careerFairsForm.value.searchCareerfair ? `${queryString ? queryString + '&' : ''}name=${this.careerFairsForm.value.searchCareerfair}` : queryString;
    if (this.offsetFlag) {
      queryString = queryString ? `${queryString}&offset=${this.queryParamOffset}` : `offset=${this.queryParamOffset}`;
      queryString = queryString ? `${queryString}&limit=${this.filterAttributes.limit}` : `offset=${this.filterAttributes.limit}`;
      this.offsetFlag = false;
    } else {
      queryString = queryString ? `${queryString}&offset=${this.filterAttributes.offset}` : `offset=${this.filterAttributes.offset}`;
      queryString = queryString ? `${queryString}&limit=${this.filterAttributes.limit}` : `offset=${this.filterAttributes.limit}`;

    }
    this.params = {
      'name': this.careerFairsForm.value.searchCareerfair,
      'location': this.careerFairsForm.value.location,
      'company': this.careerFairsForm.value.company,
      'date': this.careerFairsForm.value.date,
      'offset': this.filterAttributes.offset,
      'limit': this.filterAttributes.limit
    };




    if (this.queryFlag) {
      const paramsInQuery = {
        'name': this.careerFairsForm.value.searchCareerfair,
        'location': this.careerFairsForm.value.location,
        'company': this.careerFairsForm.value.company,
        'date': this.careerFairsForm.value.date,
        'offset': this.queryParamOffset ? this.queryParamOffset : this.filterAttributes.offset,
        'limit': this.filterAttributes.limit
      };

      this.router.navigate([], { queryParams: paramsInQuery });
    }
    this.urlQueryParameters = queryString;
    return queryString;
  }
  getJobData() {
    this.queryFlag = true;
    this.selectedAllFlag = false;
    if (this.queryParamOffset) {
      this.currentPageNumber = (this.queryParamOffset / this.filterAttributes.limit) + 1;
    } else {
      this.currentPageNumber = (this.filterAttributes.offset / this.filterAttributes.limit) + 1;
    }

    if (this.preLoadDataObject[this.currentPageNumber]) {
      this.careerFairsList = this.preLoadDataObject[this.currentPageNumber].data.data;

      this.setPaginationValues(this.preLoadDataObject[this.currentPageNumber]);
      if (this.currentPageNumber < this.paginationArr[this.paginationArr.length - 1]) {
        this.preLoadNextPage(this.currentPageNumber + 1);
      } else {

        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: this.params,
          queryParamsHandling: 'merge',
        });
      }
    } else {
      this.isJobLoading = true;
      let queryParameters;
      queryParameters = this.generateQueryString();
      this.careerfairService.getCareerFairs(queryParameters).subscribe(
        dataJson => {
          this.isJobLoading = false;
          if (dataJson['success'] && dataJson.data.data) {
            this.careerFairsList = dataJson.data.data;
            this.setPaginationValues(dataJson);
            if (this.currentPageNumber < this.paginationArr[this.paginationArr.length - 1]) {
              this.preLoadNextPage(this.currentPageNumber + 1);
            }
          }
        },
        error => {
          this.isJobLoading = false;
          this.alertsService.show(error.message, AlertType.error);
          this.careerFairsList = [];
        }
      );
    }
  }

  setPaginationValues(dataJson) {

    let max;
    let min;
    if (this.currentPageNumber >= 5) {
      max = Math.ceil(dataJson.data.count / careerFairsListLimit) <= 6 ? Math.ceil(dataJson.data.count / careerFairsListLimit) + this.currentPageNumber - 1 : this.currentPageNumber + 6;
      min = max > 10 ? max - 9 : 1;
    } else {
      if (this.queryParamOffset) {

        this.filterAttributes.offset = parseInt(this.queryParamOffset, 10);
        this.queryParamOffset = '';
      }

      max = Math.ceil((dataJson.data.count + this.filterAttributes.offset) / careerFairsListLimit) < 10 ? Math.ceil((dataJson.data.count + this.filterAttributes.offset) / careerFairsListLimit) : 10;
      min = 1;
    }
    this.paginationArr = Array(max - min + 1).fill(0).map((x, i) => i + min);
  }
  clearFilter() {
    const setPositionValue = this.careerFairsForm.value.searchCareerfair;
    this.careerFairsForm.reset();
    this.preLoadDataObject = {};
    this.careerFairsForm.patchValue({ 'searchCareerfair': setPositionValue });
    this.toggleTabMenuOpen();
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
      this.filterAttributes.offset = ((this.currentPageNumber - 1) * careerFairsListLimit);
      this.offsetParam = this.filterAttributes.offset;
      this.getJobData();

    }

  }
  preLoadNextPage(nextPageNumber) {
    this.queryFlag = false;
    const previousOffset = this.filterAttributes.offset;
    this.filterAttributes.offset = this.filterAttributes.offset + careerFairsListLimit;
    const queryString = this.generateQueryString();
    this.careerfairService.getCareerFairs(queryString).subscribe(
      dataJson => {
        if (dataJson['success'] && dataJson) {
          this.preLoadDataObject = {};
          this.preLoadDataObject[nextPageNumber] = dataJson;
        }
        this.filterAttributes.offset = previousOffset;
      },
      error => {
        this.careerFairsList = [];
      }
    );
  }
  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    // URL Params are updated on the next process tick, so we need to wait
    setTimeout(() => {
      // this.careerFairsForm.reset();
      // debugger
      // this.clearFilter();
      this.careerFairsForm.reset();
      this.preLoadDataObject = {};
      this.initPositionFilterForm();
      this.applyFilter();
    }, 100);
  }
}
