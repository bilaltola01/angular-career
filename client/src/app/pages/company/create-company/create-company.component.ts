import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import {MatDatepicker} from '@angular/material/datepicker';
import {
  AutoCompleteService,
  CompanyService,
  AlertsService,
  UserService,
  AlertType,
  HelperService
} from 'src/app/services';

import {
  City,
  UserGeneralInfo,
  CompanySizeTypes,
  Genders,
  State,
  Countries,
  Industry
} from 'src/app/models';

@Component({
  selector: 'app-create-company',
  templateUrl: './create-company.component.html',
  styleUrls: ['./create-company.component.scss']
})
export class CreateCompanyComponent implements OnInit {
  @Output() updatedGeneralInfoData = new EventEmitter();

  page_titles = [
    'Name & Overview',
    'Company Information',
    'Industry',
    'Administrators',
    'Recruiters',
    ''
  ];

  profileCreationPages = [
    'profile-basic',
    'profile-basic',
    'profile-skills',
    'profile-links',
    'profile-skills',
    'profile-skills',
    'profile-project',
    'profile-publication',
    'profile-links',
    'profile-status'
  ];

  isTabMenuOpen: boolean;

  progressWidth = [
    {
      label: 20,
      width: 100 / 6 - 100 / 12
    },
    {
      label: 40,
      width: 200 / 6 - 100 / 12
    },
    {
      label: 60,
      width: 300 / 6 - 100 / 12
    },
    {
      label: 80,
      width: 400 / 6 - 100 / 12
    },
    {
      label: 90,
      width: 500 / 6 - 100 / 12
    },
    {
      label: 100,
      width: 100
    }
  ];

  maxDate = new Date();

  // constants
  genders: string[] = Genders;
  companySizeTypes: string[] = CompanySizeTypes;
  countries: string[] = Countries.slice().sort();
  displayItemsLimit = 7;
  tab_menus = [
    'About',
    'People'
  ];

  // FormGroups
  nameOverviewForm: FormGroup;
  companyBasicInfoForm: FormGroup;
  companyIndustryForm: FormGroup;
  companyAdministratorsForm: FormGroup;
  companyRecruitersForm: FormGroup;


  // autocomplete lists
  autocomplete_cities: City[] = [];
  autocomplete_states: State[] = [];
  autocomplete_main_industries: Industry[];
  autocomplete_company_industries: Industry[];
  autocomplete_administrators: UserGeneralInfo[];
  autocomplete_recruiters: UserGeneralInfo[];

  selectedPageIndex: number;

  company_logo: string;
  company_name: string;
  company_desc: string;
  company_size:	string;
  hq_city: City;
  hq_state:	State;
  hq_country:	number;
  founding_year: any;
  website: string;
  main_industry: Industry;
  company_industries: Industry[] = [];

  company_administrators: UserGeneralInfo[] = [];
  company_recruiters: UserGeneralInfo[] = [];

  current_tab: string;
  is_administrators: boolean;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private autoCompleteService: AutoCompleteService,
    private userService: UserService,
    private companyService: CompanyService,
    private alertsService: AlertsService,
    public helperService: HelperService) { }

  ngOnInit() {
    this.isTabMenuOpen = false;

    this.company_size = CompanySizeTypes[0];
    this.current_tab = this.tab_menus[0];
    this.is_administrators = false;
    this.selectedPageIndex = 0;
    this.initializeFormsByPageIndex();
  }

  toggleTabMenuOpen() {
    this.isTabMenuOpen = !this.isTabMenuOpen;
  }

  goToNextPage() {
    ++this.selectedPageIndex;
    switch (this.selectedPageIndex) {
      case 1:
        this.initCompanyBasicInfoForm();
        break;
      case 2:
        this.initCompanyIndustryForm();
        break;
      case 3:
        this.initCompanyAdministratorsForm();
        break;
      case 4:
        this.initCompanyRecruitersForm();
        break;
      case 5:
        this.current_tab = this.tab_menus[0];
        this.is_administrators = false;
        break;
      default:
        break;
    }
  }

  goToPage(index: number) {
    this.selectedPageIndex = index;
    this.initializeFormsByPageIndex();
  }

  goToMyProfilePage() {
    this.router.navigate(['/my-profile']);
  }

  initializeFormsByPageIndex() {
    switch (this.selectedPageIndex) {
      case 0:
        this.initNameOverviewForm();
        break;
      case 1:
        this.initCompanyBasicInfoForm();
        break;
      case 2:
        this.initCompanyIndustryForm();
        break;
      case 3:
        this.initCompanyAdministratorsForm();
        break;
      case 4:
        this.initCompanyRecruitersForm();
        break;
      case 5:
        this.current_tab = this.tab_menus[0];
        this.is_administrators = false;
        break;
      default:
        break;
    }
  }

  /**
   * Company Name and Overview Form
   */
  initNameOverviewForm() {
    this.nameOverviewForm = new FormGroup({
      company_logo: new FormControl(this.company_logo ? this.company_logo : null),
      company_name: new FormControl(this.company_name ? this.company_name : null, [Validators.required]),
      company_desc: new FormControl(this.company_desc ? this.company_desc : null, [Validators.required]),
    });

    this.nameOverviewForm.get('company_logo').valueChanges.subscribe((company_logo) => {
      this.company_logo = company_logo ? company_logo : null;
    });

    this.nameOverviewForm.get('company_name').valueChanges.subscribe((company_name) => {
      this.company_name = company_name && this.helperService.checkSpacesString(company_name) ? company_name : null;
    });

    this.nameOverviewForm.get('company_desc').valueChanges.subscribe((company_desc) => {
      this.company_desc = company_desc && this.helperService.checkSpacesString(company_desc) ? company_desc : null;
    });
  }

  public onPhotoFileSelected(event): void {
    if (event.target.files && event.target.files[0]) {
      if (event.target.files[0].size > 1830020) {
        this.alertsService.show('Image size too big.', AlertType.error);
        return null;
      }

      const file = event.target.files[0];

      this.userService.getSignedPhotoUrl(file)
        .subscribe((signedPhoto) => {
          this.userService.uploadPhotoToS3(file, signedPhoto.data.signedUrl, signedPhoto.data.url)
            .subscribe((response) => {
              this.nameOverviewForm.patchValue({
                company_logo: response.data
              });
            }, err => {
              this.alertsService.show(err.message, AlertType.error);
            });
          }, err => {
            this.alertsService.show(err.message, AlertType.error);
          }
        );
    }
  }

  /**
   * Company Basic Info
   */
  initCompanyBasicInfoForm() {
    this.autocomplete_cities = [];
    this.autocomplete_states = [];

    this.companyBasicInfoForm = new FormGroup({
      company_size: new FormControl(this.company_size ? this.company_size : null, [Validators.required]),
      founding_year: new FormControl(this.founding_year ? this.helperService.convertStringToFormattedDateString(this.founding_year, 'L', 'YYYY') : null),
      hq_city: new FormControl(this.hq_city ? this.helperService.cityNameFromAutoComplete(this.hq_city.city) : null),
      hq_state: new FormControl(this.hq_state ? this.hq_state.state : null),
      hq_country: new FormControl(this.hq_country ? Countries[this.hq_country - 1] : null),
      website: new FormControl(this.website ? this.website : null)
    });

    this.companyBasicInfoForm.get('hq_city').valueChanges.subscribe((hq_city) => {
      if (hq_city && this.helperService.checkSpacesString(hq_city)) {
        this.autoCompleteService.autoComplete(hq_city, 'cities').subscribe(
          dataJson => {
            if (dataJson['success']) {
              this.autocomplete_cities = dataJson['data'];
              if (this.autocomplete_cities.length === 0) {
                this.hq_city = null;
              }
            }
          },
          error => {
            this.alertsService.show(error.message, AlertType.error);
            this.autocomplete_cities = [];
            this.hq_city = null;
          }
        );
      } else {
        this.autocomplete_cities = [];
        this.hq_city = null;
      }
    });

    this.companyBasicInfoForm.get('hq_state').valueChanges.subscribe((hq_state) => {
      if (hq_state && this.helperService.checkSpacesString(hq_state)) {
        this.autoCompleteService.autoComplete(hq_state, 'states').subscribe(
          dataJson => {
            if (dataJson['success']) {
              this.autocomplete_states = dataJson['data'];
              if (this.autocomplete_states.length === 0) {
                this.hq_state = null;
              }
            }
          },
          error => {
            this.alertsService.show(error.message, AlertType.error);
            this.autocomplete_states = [];
            this.hq_state = null;
          }
        );
      } else {
        this.autocomplete_states = [];
        this.hq_state = null;
      }
    });

    this.companyBasicInfoForm.get('hq_country').valueChanges.subscribe(
      (hq_country) => {
        if (hq_country) {
          this.hq_country = Countries.indexOf(hq_country) + 1;
        } else {
          this.hq_country = null;
        }
      }
    );

    this.companyBasicInfoForm.get('founding_year').valueChanges.subscribe(
      (founding_year) => {
        this.founding_year = founding_year ? this.helperService.convertStringToFormattedDateString(founding_year, 'YYYY', 'L') : null;
      }
    );

    this.companyBasicInfoForm.get('website').valueChanges.subscribe(
      (website) => {
        this.website = website ? this.helperService.checkSpacesString(website) : null;
      }
    );
  }

  onSelectCity(city: City) {
    this.hq_city = city;
  }

  onBlurCity() {
    if (this.hq_city && this.companyBasicInfoForm.value.hq_city !== this.helperService.cityNameFromAutoComplete(this.hq_city.city)) {
      this.hq_city = null;
    }
  }

  onCheckCityValidation(): boolean {
    const value = this.companyBasicInfoForm.get('hq_city').value;
    if (value && this.helperService.checkSpacesString(value)) {
      if (this.hq_city) {
        return value === this.helperService.cityNameFromAutoComplete(this.hq_city.city) ? true : false;
      } else {
        return false;
      }
    } else {
      return this.hq_city ? false : true;
    }
  }

  onSelectState(state: State) {
    this.hq_state = state;
  }

  onBlurState() {
    if (this.hq_state && this.companyBasicInfoForm.value.hq_state !== this.hq_state.state) {
      this.hq_state = null;
    }
  }

  onCheckStateValidation(): boolean {
    const value = this.companyBasicInfoForm.value.hq_state;
    if (value && this.helperService.checkSpacesString(value)) {
      if (this.hq_state) {
        return value === this.hq_state.state ? true : false;
      } else {
        return false;
      }
    } else {
      return this.hq_state ? true : false;
    }
  }

  onFoundedYearSelect(date: any, datePicker: MatDatepicker<any>) {
    datePicker.close();
    this.companyBasicInfoForm.get('founding_year').setValue(this.helperService.convertToFormattedString(date, 'YYYY'));
  }

  /**
   * Company Industry
   */

  initCompanyIndustryForm() {
    this.autocomplete_main_industries = [];
    this.autocomplete_company_industries = [];

    this.companyIndustryForm = new FormGroup({
      main_industry: new FormControl(this.main_industry ? this.main_industry.industry_name : null),
      company_industry: new FormControl(''),
    });

    this.companyIndustryForm.get('main_industry').valueChanges.subscribe(
      (industry) => {
        if (industry && this.helperService.checkSpacesString(industry)) {
          this.autoCompleteService.autoComplete(industry, 'industries').subscribe(
            dataJson => {
              if (dataJson['success']) {
                this.autocomplete_main_industries = dataJson['data'];
              }
            },
            error => {
              this.autocomplete_main_industries = [];
              this.alertsService.show(error.message, AlertType.error);
            }
          );
        } else {
          this.autocomplete_main_industries = [];
        }
      }
    );

    this.companyIndustryForm.get('company_industry').valueChanges.subscribe(
      (industry) => {
        if (industry && this.helperService.checkSpacesString(industry)) {
          this.autoCompleteService.autoComplete(industry, 'industries').subscribe(
            dataJson => {
              if (dataJson['success']) {
                this.autocomplete_company_industries = dataJson['data'];
              }
            },
            error => {
              this.autocomplete_company_industries = [];
              this.alertsService.show(error.message, AlertType.error);
            }
          );
        } else {
          this.autocomplete_company_industries = [];
        }
      }
    );
  }

  onSelectMainIndustry(industry: Industry) {
    this.main_industry = industry;
  }

  onBlurMainIndustry() {
    if (this.main_industry && this.companyIndustryForm.value.main_industry !== this.main_industry.industry_name) {
      this.main_industry = null;
    }
  }

  onCheckMainIndustryValidation(): boolean {
    const value = this.companyIndustryForm.value.main_industry;
    if (value && this.helperService.checkSpacesString(value)) {
      if (this.main_industry) {
        return value === this.main_industry.industry_name ? true : false;
      } else {
        return false;
      }
    } else {
      return this.main_industry ? false : true;
    }
  }

  addCompanyIndustry(industry: Industry) {
    if (industry) {
      if (this.company_industries.filter(company_industry => company_industry.industry_id === industry.industry_id).length === 0) {
        this.company_industries.push(industry);
      }
      this.companyIndustryForm.get('company_industry').setValue('');
    }
  }

  onRemoveCompanyIndustry(industry: Industry, arrIndex: number) {
    if (this.company_industries[arrIndex].industry_id === industry.industry_id) {
      this.company_industries.splice(arrIndex, 1);
    }
  }

  /**
   * Company Administrators Form
   */
  initCompanyAdministratorsForm() {
    this.autocomplete_administrators = [];

    this.companyAdministratorsForm = new FormGroup({
      company_administrator: new FormControl(''),
    });

    this.companyAdministratorsForm.get('company_administrator').valueChanges.subscribe(
      (user) => {
        if (user && this.helperService.checkSpacesString(user)) {
          this.autoCompleteService.autoComplete(user, 'users').subscribe(
            dataJson => {
              if (dataJson['success']) {
                this.autocomplete_administrators = dataJson['data'];
              }
            },
            error => {
              this.autocomplete_administrators = [];
              this.alertsService.show(error.message, AlertType.error);
            }
          );
        } else {
          this.autocomplete_administrators = [];
        }
      }
    );
  }

  addCompanyAdministrator(administrator: UserGeneralInfo) {
    if (administrator) {
      if (this.company_administrators.filter(company_administrator => company_administrator.user_id === administrator.user_id).length === 0) {
        this.userService.getGeneralInfo(administrator.user_id).subscribe(
          dataJson => {
            if (dataJson['success']) {
              this.company_administrators.push(dataJson['data']);
            }
          },
          error => {
            this.alertsService.show(error.message, AlertType.error);
          }
        );
      }
      this.companyAdministratorsForm.get('company_administrator').setValue('');
    }
  }

  onRemoveCompanyAdministrator(administrator: UserGeneralInfo, arrIndex: number) {
    if (this.company_administrators[arrIndex].user_id === administrator.user_id) {
      this.company_administrators.splice(arrIndex, 1);
    }
  }

  /**
   * Company Recruiters Form
   */
  initCompanyRecruitersForm() {
    this.autocomplete_recruiters = [];

    this.companyRecruitersForm = new FormGroup({
      company_recruiter: new FormControl(''),
    });

    this.companyRecruitersForm.get('company_recruiter').valueChanges.subscribe(
      (user) => {
        if (user && this.helperService.checkSpacesString(user)) {
          this.autoCompleteService.autoComplete(user, 'users').subscribe(
            dataJson => {
              if (dataJson['success']) {
                this.autocomplete_recruiters = dataJson['data'];
              }
            },
            error => {
              this.autocomplete_recruiters = [];
              this.alertsService.show(error.message, AlertType.error);
            }
          );
        } else {
          this.autocomplete_recruiters = [];
        }
      }
    );
  }

  addCompanyRecruiter(recruiter: UserGeneralInfo) {
    if (recruiter) {
      if (this.company_recruiters.filter(company_recruiter => company_recruiter.user_id === recruiter.user_id).length === 0) {
        this.userService.getGeneralInfo(recruiter.user_id).subscribe(
          dataJson => {
            if (dataJson['success']) {
              this.company_recruiters.push(dataJson['data']);
            }
          },
          error => {
            this.alertsService.show(error.message, AlertType.error);
          }
        );
      }
      this.companyRecruitersForm.get('company_recruiter').setValue('');
    }
  }

  onRemoveCompanyRecruiter(recruiter: UserGeneralInfo, arrIndex: number) {
    if (this.company_recruiters[arrIndex].user_id === recruiter.user_id) {
      this.company_recruiters.splice(arrIndex, 1);
    }
  }

  onSelectNavItem(id: string) {
    let height = 130;
    if (document.getElementById('legend').clientHeight === 0) {
      height = 70;
    }
    document.getElementById('sidenav-content').scrollTop = document.getElementById(id).offsetTop - height;
  }

  onSelectTabMenu(arrIndex: number) {
    this.current_tab = this.tab_menus[arrIndex];
  }

  onSelectNavMenuPeople(is_administrators: boolean) {
    this.is_administrators = is_administrators;
  }

}

