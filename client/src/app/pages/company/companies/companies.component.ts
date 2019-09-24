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

@Component({
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss']
})

export class CompaniesComponent implements OnInit {

    companyList = [{
        "company_id": 8,
        "company_name": "werke",
        "company_desc": "bmw",
        "company_logo": "https://careerfair-images-development.s3.amazonaws.com/company-images/8/Screen Shot 2019-09-10 at 8.11.48 PM.png",
        "company_size": "small",
        "hq_city": 17,
        "hq_city_name": "Delta",
        "hq_country_name": "Saint Helena",
        "hq_country": 3,
        "founding_year": 2019,
        "hq_state_name": "Alabama",
        "hq_state": 1,
        "main_industry": 162,
        "main_industry_name": "Car Manufacturers",
        "school": 0,
        "active": 1,
        "verified": 0,
        "website": "das.com",
        "company_industries": [
            "Car Dealers, Imports",
            "Car Manufacturers"
        ],
        "company_industry_ids": [
            162,
            176
        ]
    }, {
        "company_id": 2,
        "company_name": "Moodle",
        "company_desc": "Development of Plugins\n",
        "company_logo": "https://careerfair-images-development.s3.amazonaws.com/company-images/2/Screen Shot 2019-09-10 at 8.27.04 PM.png",
        "company_size": "small",
        "hq_city": 17484,
        "hq_city_name": "Los Angeles",
        "hq_country_name": "United States",
        "hq_country": 43,
        "founding_year": 2019,
        "hq_state_name": "California",
        "hq_state": 5,
        "main_industry": 35,
        "main_industry_name": "Computer Software",
        "school": 0,
        "active": 1,
        "verified": 0,
        "website": "moodle.com",
        "company_industries": [
            "Education",
            "Research and Development",
            "Schools/Education"
        ],
        "company_industry_ids": [
            67,
            70,
            291
        ]
    }];

    // FormGroup
    companiesForm: FormGroup;

    current_user: UserGeneralInfo;

    // Autocomplete List
    autocomplete_searchcompanies: Company[] = [];

    autocomplete_cities: City[] = [];

    // UI Variables
    isLoadingResults = true;
    showFilterListFlag = true;
    searchPlaceholderCopy = 'Search people by name or email.';

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

    onSearchCompany(event) {
        console.log("TCL: CompaniesComponent -> onSearchCompany -> event", event)
        // this.emptyResultsCopy = 'No search results found.';
        // this.filterAttributes.offset = 0;
        // this.currentPageNumber = 1;
        // this.preLoadDataObject = {};
        // this.getCompaniesData();
        event.stopPropagation();
      }

    getCompaniesData() {
        // const queryString = this.generateQueryString();
        const queryString = 'offset=7&limit=7';
        this.isLoadingResults = false;
        this.companyService.getCompanies(queryString).subscribe(
            dataJson => {
                console.log("TCL: CompaniesComponent -> getCompaniesData -> dataJson", dataJson)

            },
            error => {

            }
        );
    }

    getCurrentUser() {
        this.userStateService.getUser
          .subscribe(user => {
            this.current_user = user;
          }, error => {
            this.alertsService.show(error.message, AlertType.error);
          });
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
