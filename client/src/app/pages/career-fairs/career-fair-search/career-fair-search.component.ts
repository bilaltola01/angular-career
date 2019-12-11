import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AlertsService, AlertType, AutoCompleteService, CareerFairService } from '../../../services/index';

import { City, Company, careerFairsListLimit } from 'src/app/models';



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
  queryFlag = true;
  prequeryFlag = false;
  preLoadDataFlag = true;
  offsetParam;
  urlQueryParameter;
  minDate = new Date;

  constructor(private autoCompleteService: AutoCompleteService,
    private alertsService: AlertsService, private careerfairService: CareerFairService) {
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
        this.urlParams[result[0]] = result[1];
      }
    }

    this.initPositionFilterForm();
    this.getJobData();

  }

  toggleTabMenuOpen() {
    this.filter_list = !this.filter_list;
  }
  initPositionFilterForm() {
    this.careerFairsForm = new FormGroup({
      'searchPosition': new FormControl(null),
      'location': new FormControl(null),
      'company': new FormControl(null),
      'date': new FormControl(null),
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
    // let urlQueryParam;
    queryString = this.careerFairsForm.value.location ? `${queryString ? queryString + '&' : ''}location=${this.careerFairsForm.value.location ? this.careerFairsForm.value.location : ''}` : queryString;
    queryString = this.careerFairsForm.value.company ? `${queryString ? queryString + '&' : ''}company=${this.careerFairsForm.value.company}` : queryString;
    queryString = this.careerFairsForm.value.date ? `${queryString ? queryString + '&' : ''}date=${this.careerFairsForm.value.date}` : queryString;
    queryString = queryString ? `${queryString}&offset=${this.filterAttributes.offset}` : `offset=${this.filterAttributes.offset}`;
    queryString = queryString ? `${queryString}&limit=${this.filterAttributes.limit}` : `offset=${this.filterAttributes.limit}`;
    queryString = this.careerFairsForm.value.searchPosition ? `${queryString ? queryString + '&' : ''}name=${this.careerFairsForm.value.searchPosition}` : queryString;

    return queryString;
  }
  getJobData() {
    this.queryFlag = true;
    this.selectedAllFlag = false;
    if (this.searchQueryParam) {
      this.currentPageNumber = (this.urlParams['offset'] / this.urlParams['limit']) + 1;
    } else {
      this.currentPageNumber = (this.filterAttributes.offset / this.filterAttributes.limit) + 1;
    }

    if (this.preLoadDataObject[this.currentPageNumber]) {
      this.careerFairsList = this.preLoadDataObject[this.currentPageNumber].data.data;

      this.setPaginationValues(this.preLoadDataObject[this.currentPageNumber]);
      if (this.currentPageNumber < this.paginationArr[this.paginationArr.length - 1]) {
        this.preLoadNextPage(this.currentPageNumber + 1);
      } else {
        // this.router.navigate(['/positions'], { queryParams: { search: this.urlQueryParameter ? this.urlQueryParameter : '' } });
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
      if (this.offsetFlag) {
        this.filterAttributes.offset = parseInt(this.urlParams['offset'], 10);
      }
      max = Math.ceil((dataJson.data.count + this.filterAttributes.offset) / careerFairsListLimit) < 10 ? Math.ceil((dataJson.data.count + this.filterAttributes.offset) / careerFairsListLimit) : 10;
      min = 1;
    }
    this.paginationArr = Array(max - min + 1).fill(0).map((x, i) => i + min);
  }
  clearFilter() {
    const sortValue = this.careerFairsForm.value.sortBy;
    const setPositionValue = this.careerFairsForm.value.searchPosition;
    this.careerFairsForm.reset();
    this.preLoadDataObject = {};
    this.careerFairsForm.patchValue({ 'sortBy': sortValue });
    this.careerFairsForm.patchValue({ 'searchPosition': setPositionValue });
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
    if (!this.preLoadDataObject[nextPageNumber]) {
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
  }
}