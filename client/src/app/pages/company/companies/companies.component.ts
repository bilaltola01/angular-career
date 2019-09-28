import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
// import { Companies, CompanyModel } from '../../../models';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { FormControl, FormGroup } from '@angular/forms';
import {
  AlertsService, AlertType,
  AutoCompleteService,
  UserService,
  HelperService,
  UserStateService,
  CompanyService
} from '../../../services';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { UserGeneralInfo, City, Company, CompanySizeTypes, Industry, companyListLimit } from 'src/app/models';

class CompanySize {
  id: number;
  name: string;
}

export interface Company {
  company_id: number;
  company_name: string;
  company_desc: string;
  company_logo: string;
  company_size: string;
  hq_city: number;
  hq_city_name: string;
  hq_country: number;
  hq_country_name: string;
  hq_state: number;
  hq_state_name: string;
  main_industry: number;
  founding_year: number;
  main_industry_name: string;
  school: number;
  active: number;
  verified: number;
  website: string;
  company_industries?: (string)[] | null;
  company_industry_ids?: (number)[] | null;
  position_levels: PositionLevels;
}
export interface PositionLevels {
  entry_level_count: number;
  senior_level_count: number;
  manager_level_count: number;
  executive_level_count: number;
  total_count: number;
}


@Component({
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss']
})

export class CompaniesComponent implements OnInit {

  companyList: Company[]; // TODO: Make a company?!

  // FormGroup
  companiesForm: FormGroup;
  current_user: UserGeneralInfo;
  company_size: string;

  // Autocomplete List
  autocomplete_searchcompanies: Company[] = [];
  autocomplete_cities: City[] = [];
  autocomplete_industries: Industry[] = [];

  currentPageNumber = 1;
  paginationArr = [];
  preLoadDataObject = {};
  filterAttributes = {
    city_id: null,
    industry_id: null,
    offset: 0,
    limit: 7,
  };
  companySizeTypes: string[] = CompanySizeTypes;

  // UI Variables
  isLoadingResults = true;
  showFilterListFlag = true;
  searchPlaceholderCopy = 'Search companies by name.';
  emptyResultsCopy = 'Use the search and filter to find companies.';

  constructor(
    private autoCompleteService: AutoCompleteService,
    private alertsService: AlertsService,
    // private userService: UserService,
    private companyService: CompanyService,
    public helperService: HelperService,
    private userStateService: UserStateService,
    private breakpointObserver: BreakpointObserver,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.getCurrentUser();
  }

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(['(max-width: 991px)'])
    .pipe(
      map(result => result.matches)
    );

  ngOnInit() {
    // this.company_size = CompanySizeTypes[0];
    this.initCompanyFilterForm();
    // Initial search
    this.applyFilter();
  }

  initCompanyFilterForm() {
    const querySearchedName = this.route.snapshot.queryParamMap.get('name') || null;
    const querySearchedIndustry = this.route.snapshot.queryParamMap.get('industry') || null;
    const querySearchedIndustryId = this.route.snapshot.queryParamMap.get('industryId') || null;
    const querySearchedCity = this.route.snapshot.queryParamMap.get('city') || null;
    const querySearchedCityId = this.route.snapshot.queryParamMap.get('cityId') || null;
    const querySearchedSize = this.route.snapshot.queryParamMap.get('size') || null;

    this.companiesForm = new FormGroup({
      'searchCompanies': new FormControl(querySearchedName),
      'industry': new FormControl(querySearchedIndustry),
      'size': new FormControl(querySearchedSize),
      'city': new FormControl(querySearchedCity),
    });

    this.companiesForm.get('searchCompanies').valueChanges.subscribe((searchCompanies) => {
      searchCompanies && this.helperService.checkSpacesString(searchCompanies) ? this.onSearchCompaniesValueChanges(searchCompanies) : this.autocomplete_searchcompanies = [];
    });

    this.companiesForm.get('industry').valueChanges.subscribe((industry) => {
      industry ? this.onIndustryValueChanges(industry) : this.autocomplete_industries = [];
    });

    this.companiesForm.get('city').valueChanges.subscribe((city) => {
      city && this.helperService.checkSpacesString(city) ? this.onCityValueChanges(city) : this.autocomplete_cities = [];
    });
  }

  applyFilter() {
    this.emptyResultsCopy = 'No search results found.';
    this.filterAttributes.offset = 0;
    this.currentPageNumber = 1;
    this.toggleTabMenuOpen();
    this.preLoadDataObject = {};
    this.getCompaniesData();
  }

  onChangeCity(city: City) {
    this.filterAttributes['city_id'] = city.city_id;
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

  onChangeIndustry(industry) {
    this.filterAttributes['industry_id'] = industry.industry_id;
  }

  onIndustryValueChanges(industry: string) {
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

  onSearchCompaniesValueChanges(searchCompanies: string) {
    if (!searchCompanies.includes('@')) {
      this.autoCompleteService.autoComplete(searchCompanies, 'companies').subscribe(
        dataJson => {
          if (dataJson['success']) {
            this.autocomplete_searchcompanies = dataJson['data'];
          }
        },
        error => {
          this.alertsService.show(error.message, AlertType.error);
          this.autocomplete_searchcompanies = [];
        }
      );
    } else {
      this.autocomplete_searchcompanies = [];
    }
  }

  onSearchCompany(event) {
    this.emptyResultsCopy = 'No search results found.';
    this.filterAttributes.offset = 0;
    this.currentPageNumber = 1;
    this.preLoadDataObject = {};
    this.getCompaniesData();
    event.stopPropagation();
  }

  parseCompanySize(companySizeTypes: string): string {
    let company_size = 'small';
    if (companySizeTypes.includes('Medium')) {
      company_size = 'medium';
    } else if (companySizeTypes.includes('Large')) {
      company_size = 'large';
    }

    return company_size;
  }

  generateQueryString(): string {
    let queryString;
    queryString = this.companiesForm.value.size ? `${queryString ? queryString + '&' : ''}size=${this.parseCompanySize(this.companiesForm.value.size)}` : queryString;
    queryString = this.companiesForm.value.industry ? `${queryString ? queryString + '&' : ''}industry=${this.filterAttributes.industry_id}` : queryString;
    queryString = this.companiesForm.value.city ? `${queryString ? queryString + '&' : ''}city=${this.filterAttributes.city_id}` : queryString;
    queryString = queryString ? `${queryString}&offset=${this.filterAttributes.offset}` : `offset=${this.filterAttributes.offset}`;
    queryString = queryString ? `${queryString}&limit=${this.filterAttributes.limit}` : `limit=${this.filterAttributes.limit}`;

    const companies = this.companiesForm.value.searchCompanies && this.helperService.checkSpacesString(this.companiesForm.value.searchCompanies) ? this.companiesForm.value.searchCompanies.replace('+', '%2B') : null;

    queryString = companies ? `${queryString ? queryString + '&' : ''}company=${companies}` : queryString;

    return queryString;
  }

  getCompaniesData() {
    if (this.preLoadDataObject[this.currentPageNumber]) {
      this.companyList = this.preLoadDataObject[this.currentPageNumber].data;
      this.setPaginationValues(this.preLoadDataObject[this.currentPageNumber]);
      if (this.currentPageNumber < this.paginationArr[this.paginationArr.length - 1]) {
        this.preLoadNextPage(this.currentPageNumber + 1);
      }
    } else {
      this.isLoadingResults = true;
      const queryString = this.generateQueryString();
      this.companyService.getCompanies(queryString).subscribe(
        dataJson => {
          this.isLoadingResults = false;
          if (dataJson['success'] && dataJson.data.data) {
            this.companyList = [];
            dataJson.data.data.forEach((data) => {
              this.companyList.push(data);
            });
            const prelaodData = {
              data: this.companyList,
              count: dataJson.data.count
            };

            this.setPaginationValues(prelaodData);
            this.preLoadDataObject[this.currentPageNumber] = prelaodData;
            if (this.currentPageNumber < this.paginationArr[this.paginationArr.length - 1]) {
              this.preLoadNextPage(this.currentPageNumber + 1);
            }
          }
        },
        error => {
          this.isLoadingResults = false;
          this.alertsService.show(error.message, AlertType.error);
          this.companyList = [];
        }
      );
    }
  }

  getCurrentUser() {
    this.userStateService.getUser
      .subscribe(user => {
        this.current_user = user;
      }, error => {
        this.alertsService.show(error.message, AlertType.error);
      });
  }

  clearFilter() {
    console.log('TCL: CompaniesComponent -> clearFilter -> clearFilter: TODO');
  }
  // --- UI ---

  toggleTabMenuOpen() {
    this.isHandset$.subscribe(handsetFlag => {
      if (handsetFlag) {
        this.showFilterListFlag = !this.showFilterListFlag;
      } else {
        this.showFilterListFlag = true;
      }
    });
  }

  setPaginationValues(data) {
    let max;
    let min;
    if (this.currentPageNumber >= 5) {
      max = Math.ceil(data.count / companyListLimit) <= 6 ? Math.ceil(data.count / companyListLimit) + this.currentPageNumber - 1 : this.currentPageNumber + 6;
      min = max > 10 ? max - 9 : 1;
    } else {
      max = Math.ceil((data.count + this.filterAttributes.offset) / companyListLimit) < 10 ? Math.ceil((data.count + this.filterAttributes.offset) / companyListLimit) : 10;
      min = 1;
    }

    this.paginationArr = Array(max - min + 1).fill(0).map((x, i) => i + min);
  }

  pageClicked(pageNo) {
    document.getElementById('sidenav-content').scrollTo(0, 0);
    if (pageNo > 0 && pageNo <= this.paginationArr[this.paginationArr.length - 1]) {
      this.currentPageNumber = pageNo;
      this.filterAttributes.offset = ((this.currentPageNumber - 1) * companyListLimit);
      this.getCompaniesData();
    }
  }

  preLoadNextPage(nextPageNumber) {
    if (!this.preLoadDataObject[nextPageNumber]) {
      const previousOffset = this.filterAttributes.offset;
      this.filterAttributes.offset = this.filterAttributes.offset + companyListLimit;
      const queryString = this.generateQueryString();
      this.companyService.getCompanies(queryString).subscribe(
        dataJson => {
          if (dataJson['success'] && dataJson.data.data) {
            const companyList = [];
            dataJson.data.data.forEach((data) => {
              companyList.push(data);
            });
            const prelaodData = {
              data: companyList,
              count: dataJson.data.count
            };
            this.preLoadDataObject[nextPageNumber] = prelaodData;
            // this.getUsersInfo(nextPageNumber); TODO: what?!
          }
          this.filterAttributes.offset = previousOffset;
        },
        error => {
          this.companyList = [];
        }
      );
    }
  }
}
