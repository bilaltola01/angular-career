import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {MatDatepicker} from '@angular/material/datepicker';
import {
  AutoCompleteService,
  CompanyService,
  AlertsService,
  UserService,
  AlertType,
  HelperService,
  CompanyRecruiterService,
  CompanyAdminService,
  UserStateService
} from 'src/app/services';

import {
  PositionInfoRequest,
  PositionInfoResponse,
  Company,
  City,
  State,
  Countries,
  UserGeneralInfo,
  PositionLevel,
  JobType,
  ApplicationType,
  User
} from 'src/app/models';

@Component({
  selector: 'app-create-position',
  templateUrl: './create-position.component.html',
  styleUrls: ['./create-position.component.scss']
})
export class CreatePositionComponent implements OnInit {

  // constants
  page_titles = [
    'Name & Overview',
    'Position Information',
    'Education',
    'Experience',
    'Skills',
    'Interests',
    'School Restrictions',
    'T & C'
  ];
  progressWidth = [
    {
      label: 10,
      width: 100 / 9 - 100 / 18
    },
    {
      label: 20,
      width: 200 / 9 - 100 / 18
    },
    {
      label: 30,
      width: 300 / 9 - 100 / 18
    },
    {
      label: 50,
      width: 400 / 9 - 100 / 18
    },
    {
      label: 60,
      width: 500 / 9 - 100 / 18
    },
    {
      label: 70,
      width: 600 / 9 - 100 / 18
    },
    {
      label: 80,
      width: 700 / 9 - 100 / 18
    },
    {
      label: 100,
      width: 100
    }
  ];
  maxDate = new Date();
  countries: string[] = Countries.slice();
  countries_sort: string[] = Countries.slice().sort();
  displayItemsLimit = 7;
  positionLevels = PositionLevel;
  jobTypes = JobType;
  applicationTypes = ApplicationType;

  // FormGroups
  nameOverviewForm: FormGroup;
  positionBasicInfoForm: FormGroup;

  // autocomplete lists
  autocomplete_companies: Company[] = [];
  autocomplete_cities: City[] = [];
  autocomplete_states: State[] = [];
  autocomplete_recruiters: User[] = [];

  // Position information
  position_name: string;
  position_desc: string;
  position_company: Company;
  position_city: City;
  position_state: State;
  position_country: number;
  position_salary: number;
  position_level: string;
  position_type: string;
  position_application_type: string;
  position_application_deadline: string;
  position_recruiter: User;

  selectedPageIndex: number;
  isNavMenuOpened: boolean;

  constructor(
    private alertsService: AlertsService,
    public helperService: HelperService,
    public autoCompleteService: AutoCompleteService
  ) { }

  ngOnInit() {
    this.isNavMenuOpened = false;
    this.selectedPageIndex = 0;
    this.initializeFormsByPageIndex();
  }

  onClickTogggle() {
    this.isNavMenuOpened = !this.isNavMenuOpened;
  }

  goToNextPage() {
    ++this.selectedPageIndex;
    switch (this.selectedPageIndex) {
      case 1:
        this.initPositionBasicInfoForm();
        break;
      default:
        break;
    }
  }

  goToPage(index: number) {
    if (this.selectedPageIndex === 0 && !this.position_name && !this.position_desc) {
      this.alertsService.show('Please fill out the position\'s name and description field.', AlertType.error);
      return;
    }
    this.selectedPageIndex = index;
    this.isNavMenuOpened = false;
    this.initializeFormsByPageIndex();
  }

  initializeFormsByPageIndex() {
    switch (this.selectedPageIndex) {
      case 0:
        this.initNameOverviewForm();
        break;
      case 1:
        this.initPositionBasicInfoForm();
        break;
      default:
        break;
    }
  }

  /**
   * Position Name and Overview Form
   */
  initNameOverviewForm() {
    this.nameOverviewForm = new FormGroup({
      position_name: new FormControl(this.position_name ? this.position_name : null, [Validators.required]),
      position_desc: new FormControl(this.position_desc ? this.position_desc : null, [Validators.required]),
    });

    this.nameOverviewForm.get('position_name').valueChanges.subscribe((position_name) => {
      this.position_name = position_name && this.helperService.checkSpacesString(position_name) ? position_name : null;
    });

    this.nameOverviewForm.get('position_desc').valueChanges.subscribe((position_desc) => {
      this.position_desc = position_desc && this.helperService.checkSpacesString(position_desc) ? position_desc : null;
    });
  }

  /**
   * Position Basic Info
   */
  initPositionBasicInfoForm() {
    this.autocomplete_companies = [];
    this.autocomplete_cities = [];
    this.autocomplete_states = [];
    this.autocomplete_recruiters = [];

    this.positionBasicInfoForm = new FormGroup({
      position_company: new FormControl(this.position_company ? this.position_company.company_name : null, [Validators.required]),
      position_city: new FormControl(this.position_city ? this.helperService.cityNameFromAutoComplete(this.position_city.city) : null),
      position_state: new FormControl(this.position_state ? this.position_state.state : null),
      position_country: new FormControl(this.position_country ? Countries[this.position_country - 1] : null),
      position_salary: new FormControl(this.position_salary ? this.position_salary : null),
      position_level: new FormControl(this.position_level ? this.position_level : null),
      position_type: new FormControl(this.position_type ? this.position_type : null),
      position_application_type: new FormControl(this.position_application_type ? this.position_application_type : null),
      position_application_deadline: new FormControl(this.position_application_deadline ? this.position_application_deadline : null),
      position_recruiter: new FormControl(this.position_recruiter ? `${this.position_recruiter.first_name} ${this.position_recruiter.last_name}` : null)
    });

    this.positionBasicInfoForm.get('position_company').valueChanges.subscribe((position_company) => {
      if (position_company && this.helperService.checkSpacesString(position_company)) {
        this.autoCompleteService.autoComplete(position_company, 'companies').subscribe(
          dataJson => {
            if (dataJson['success']) {
              this.autocomplete_companies = dataJson['data'];
              if (this.autocomplete_companies.length === 0) {
                this.position_company = null;
              }
            }
          },
          error => {
            this.alertsService.show(error.message, AlertType.error);
            this.autocomplete_companies = [];
            this.position_company = null;
          }
        );
      } else {
        this.autocomplete_companies = [];
        this.position_company = null;
      }
    });

    this.positionBasicInfoForm.get('position_city').valueChanges.subscribe((position_city) => {
      if (position_city && this.helperService.checkSpacesString(position_city)) {
        this.autoCompleteService.autoComplete(position_city, 'cities').subscribe(
          dataJson => {
            if (dataJson['success']) {
              this.autocomplete_cities = dataJson['data'];
              if (this.autocomplete_cities.length === 0) {
                this.position_city = null;
              }
            }
          },
          error => {
            this.alertsService.show(error.message, AlertType.error);
            this.autocomplete_cities = [];
            this.position_city = null;
          }
        );
      } else {
        this.autocomplete_cities = [];
        this.position_city = null;
      }
    });

    this.positionBasicInfoForm.get('position_state').valueChanges.subscribe((position_state) => {
      if (position_state && this.helperService.checkSpacesString(position_state)) {
        this.autoCompleteService.autoComplete(position_state, 'states').subscribe(
          dataJson => {
            if (dataJson['success']) {
              this.autocomplete_states = dataJson['data'];
              if (this.autocomplete_states.length === 0) {
                this.position_state = null;
              }
            }
          },
          error => {
            this.alertsService.show(error.message, AlertType.error);
            this.autocomplete_states = [];
            this.position_state = null;
          }
        );
      } else {
        this.autocomplete_states = [];
        this.position_state = null;
      }
    });

    this.positionBasicInfoForm.get('position_country').valueChanges.subscribe(
      (position_country) => {
        if (position_country) {
          this.position_country = Countries.indexOf(position_country) + 1;
        } else {
          this.position_country = null;
        }
      }
    );

    this.positionBasicInfoForm.get('position_salary').valueChanges.subscribe(
      (position_salary) => {
        this.position_salary = position_salary ? parseInt(position_salary, 10) : null;
      }
    );

    this.positionBasicInfoForm.get('position_level').valueChanges.subscribe(
      (position_level) => {
        this.position_level = position_level ? this.helperService.checkSpacesString(position_level) : null;
      }
    );

    this.positionBasicInfoForm.get('position_type').valueChanges.subscribe(
      (position_type) => {
        this.position_type = position_type ? this.helperService.checkSpacesString(position_type) : null;
      }
    );

    this.positionBasicInfoForm.get('position_application_type').valueChanges.subscribe(
      (position_application_type) => {
        this.position_application_type = position_application_type ? this.helperService.checkSpacesString(position_application_type) : null;
      }
    );

    this.positionBasicInfoForm.get('position_application_deadline').valueChanges.subscribe(
      (position_application_deadline) => {
        this.position_application_deadline = position_application_deadline ? this.helperService.checkSpacesString(position_application_deadline) : null;
      }
    );

    this.positionBasicInfoForm.get('position_recruiter').valueChanges.subscribe((position_recruiter) => {
      if (position_recruiter && this.helperService.checkSpacesString(position_recruiter)) {
        this.autoCompleteService.autoComplete(position_recruiter, 'users').subscribe(
          dataJson => {
            if (dataJson['success']) {
              this.autocomplete_recruiters = dataJson['data'];
              if (this.autocomplete_recruiters.length === 0) {
                this.position_recruiter = null;
              }
            }
          },
          error => {
            this.alertsService.show(error.message, AlertType.error);
            this.autocomplete_recruiters = [];
            this.position_recruiter = null;
          }
        );
      } else {
        this.autocomplete_recruiters = [];
        this.position_recruiter = null;
      }
    });
  }

  onSelectCompany(company: Company) {
    this.position_company = company;
  }

  onBlurCompany() {
    const value = this.positionBasicInfoForm.value.position_company;
    if (value && this.helperService.checkSpacesString(value)) {
      if (this.position_company && value !== this.position_company.company_name) {
        this.position_company = null;
      }
    } else {
      this.position_company = null;
    }
  }

  onCheckCompanyValidation(): boolean {
    const value = this.positionBasicInfoForm.get('position_company').value;
    if (value && this.helperService.checkSpacesString(value)) {
      if (this.position_company) {
        return value === this.position_company.company_name ? true : false;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  onSelectCity(city: City) {
    this.position_city = city;
  }

  onBlurCity() {
    const value = this.positionBasicInfoForm.value.position_city;
    if (value && this.helperService.checkSpacesString(value)) {
      if (this.position_city && value !== this.helperService.cityNameFromAutoComplete(this.position_city.city)) {
        this.position_city = null;
      }
    } else {
      this.position_city = null;
    }
  }

  onCheckCityValidation(): boolean {
    const value = this.positionBasicInfoForm.get('position_city').value;
    if (value && this.helperService.checkSpacesString(value)) {
      if (this.position_city) {
        return value === this.helperService.cityNameFromAutoComplete(this.position_city.city) ? true : false;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  onSelectState(state: State) {
    this.position_state = state;
  }

  onBlurState() {
    const value = this.positionBasicInfoForm.value.position_state;
    if (value && this.helperService.checkSpacesString(value)) {
      if (this.position_state && value !== this.position_state.state) {
        this.position_state = null;
      }
    } else {
      this.position_state = null;
    }
  }

  onCheckStateValidation(): boolean {
    const value = this.positionBasicInfoForm.value.position_state;
    if (value && this.helperService.checkSpacesString(value)) {
      if (this.position_state) {
        return value === this.position_state.state ? true : false;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  onSelectRecruiter(recruiter: User) {
    this.position_recruiter = recruiter;
  }

  onBlurRecruiter() {
    const value = this.positionBasicInfoForm.value.position_recruiter;
    if (value && this.helperService.checkSpacesString(value)) {
      if (this.position_recruiter && value !== `${this.position_recruiter.first_name} ${this.position_recruiter.last_name}`) {
        this.position_recruiter = null;
      }
    } else {
      this.position_recruiter = null;
    }
  }

  onCheckRecruiterValidation(): boolean {
    const value = this.positionBasicInfoForm.value.position_recruiter;
    if (value && this.helperService.checkSpacesString(value)) {
      if (this.position_recruiter) {
        return value === `${this.position_recruiter.first_name} ${this.position_recruiter.last_name}` ? true : false;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  onChangeApplicationDeadline(date: any) {
    if (date.value) {
      this.positionBasicInfoForm.get('position_application_deadline').setValue(this.helperService.convertToFormattedString(date.value, 'L'));
    } else {
      this.positionBasicInfoForm.get('position_application_deadline').setValue('');
    }
  }

}
