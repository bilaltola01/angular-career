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
import { UserGeneralInfo, City, Company } from 'src/app/models';

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

    companyList: Company[]; // TODO: Make a company

    // FormGroup
    companiesForm: FormGroup;
    current_user: UserGeneralInfo;

    // Autocomplete List
    autocomplete_searchcompanies: Company[] = [];
    autocomplete_cities: City[] = [];
    preLoadDataObject = {};
    currentPageNumber = 1;
    filterAttributes = {
      city_id: null,
      // major_id: null,
      // school_id: null,
      offset: 0,
      limit: 7,
    };

    // UI Variables
    isLoadingResults = true;
    showFilterListFlag = true;
    searchPlaceholderCopy = 'Search people by name or email.';
    emptyResultsCopy = 'Use the search and filter to find companies.';

    constructor(
        private autoCompleteService: AutoCompleteService,
        private alertsService: AlertsService,
        private userService: UserService,
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
        this.initCompanyFilterForm();
        // Initial search
        this.applyFilter();
    }

    initCompanyFilterForm() {
        const querySearchedName = this.route.snapshot.queryParamMap.get('name') || null;
        const querySearchedCity = this.route.snapshot.queryParamMap.get('city') || null;
        const querySearchedCityId = this.route.snapshot.queryParamMap.get('cityId') || null;

        this.companiesForm = new FormGroup({
            'searchCompanies': new FormControl(querySearchedName),
            'city': new FormControl(querySearchedCity),
        });

        this.companiesForm.get('searchCompanies').valueChanges.subscribe((searchCompanies) => {
          searchCompanies && this.helperService.checkSpacesString(searchCompanies) ? this.onSearchCompaniesValueChanges(searchCompanies) : this.autocomplete_searchcompanies = [];
        });

        this.companiesForm.get('city').valueChanges.subscribe((city) => {
            city && this.helperService.checkSpacesString(city) ? this.onCityValueChanges(city) : this.autocomplete_cities = [];
        });
    }

    applyFilter() {
        this.getCompaniesData();
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
      console.log("TCL: CompaniesComponent -> onSearchCompany -> event", event)
      this.emptyResultsCopy = 'No search results found.';
      this.filterAttributes.offset = 0;
      this.currentPageNumber = 1;
      this.preLoadDataObject = {};
      this.getCompaniesData();
      event.stopPropagation();
    }

    generateQueryString(): string {
      let queryString;
      queryString = this.companiesForm.value.city ? `${queryString ? queryString + '&' : ''}city=${this.filterAttributes.city_id}` : queryString;
      queryString = queryString ? `${queryString}&offset=${this.filterAttributes.offset}` : `offset=${this.filterAttributes.offset}`;
      queryString = queryString ? `${queryString}&limit=${this.filterAttributes.limit}` : `limit=${this.filterAttributes.limit}`;

      const companies = this.companiesForm.value.searchCompanies && this.helperService.checkSpacesString(this.companiesForm.value.searchCompanies) ? this.companiesForm.value.searchCompanies.replace('+', '%2B') : null;

      queryString = companies ? `${queryString ? queryString + '&' : ''}company=${companies}` : queryString;

      return queryString;
    }

    getCompaniesData() {
        const queryString = this.generateQueryString();
        // const queryString = 'offset=0&limit=70';
        this.isLoadingResults = false;
        this.companyService.getCompanies(queryString).subscribe(
            dataJson => {
                console.log("TCL: CompaniesComponent -> getCompaniesData -> dataJson", dataJson)
                this.companyList = dataJson.data.data;
            },
            error => {

            }
        );
    }

    onChangeCity(city: City) {
      this.filterAttributes['city_id'] = city.city_id;
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
      console.log("TCL: CompaniesComponent -> clearFilter -> clearFilter: TODO")
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
}
