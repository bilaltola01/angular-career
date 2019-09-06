import { Component, OnInit, EventEmitter, Output } from '@angular/core';
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
  City,
  UserGeneralInfo,
  CompanySizeTypes,
  State,
  Countries,
  Industry,
  CompanyInfoRequest,
  CompanyInfoResponse
} from 'src/app/models';

@Component({
  selector: 'app-create-company',
  templateUrl: './create-company.component.html',
  styleUrls: ['./create-company.component.scss']
})
export class CreateCompanyComponent implements OnInit {

  // constants
  page_titles = [
    'Name & Overview',
    'Company Information',
    'Industry',
    'Administrators',
    'Recruiters',
    ''
  ];

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
      label: 100,
      width: 100
    }
  ];

  maxDate = new Date();
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

  // Company information
  company_logo: File;
  company_logo_url: string;
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

  company: CompanyInfoResponse;
  currentUser: UserGeneralInfo;

  selectedPageIndex: number;
  current_tab: string;
  is_administrators: boolean;
  isNavMenuOpened: boolean;
  isTabMenuOpen: boolean;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private autoCompleteService: AutoCompleteService,
    private userService: UserService,
    private companyService: CompanyService,
    private companyAdminService: CompanyAdminService,
    private companyRecruiterService: CompanyRecruiterService,
    private userStateService: UserStateService,
    private alertsService: AlertsService,
    public helperService: HelperService
  ) {
    this.getCurrentUserInfo();
  }

  ngOnInit() {
    this.isTabMenuOpen = false;
    this.isNavMenuOpened = false;

    this.company_size = CompanySizeTypes[0];
    this.current_tab = this.tab_menus[0];
    this.is_administrators = false;
    this.selectedPageIndex = 0;
    this.initializeFormsByPageIndex();
  }

  onClickTogggle() {
    this.isNavMenuOpened = !this.isNavMenuOpened;
  }

  toggleTabMenuOpen() {
    this.isTabMenuOpen = !this.isTabMenuOpen;
  }

  getCurrentUserInfo() {
    this.userStateService.getUser
      .subscribe(user => {
        this.currentUser = user;
      }, error => {
        this.alertsService.show(error.message, AlertType.error);
      });
  }

  goToNextPage() {
    if (this.selectedPageIndex === 0 && !this.company_name && !this.company_desc) {
      return;
    }
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
    if (this.selectedPageIndex === 0 && !this.company_name && !this.company_desc) {
      this.alertsService.show('Please fill out the company\'s name and description field.', AlertType.error);
      return;
    }
    this.selectedPageIndex = index;
    this.isTabMenuOpen = false;
    this.isNavMenuOpened = false;
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

      const reader = new FileReader();

      reader.onload = (reader_event: any) => {
        this.company_logo_url = reader_event.target.result;
      };

      reader.readAsDataURL(event.target.files[0]);
      this.company_logo = event.target.files[0];
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
      founding_year: new FormControl(this.founding_year ? this.founding_year : null),
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
        this.founding_year = founding_year ? parseInt(founding_year, 10) : null;
      }
    );

    this.companyBasicInfoForm.get('website').valueChanges.subscribe(
      (website) => {
        this.website = website ? this.helperService.checkSpacesString(website) : null;
      }
    );

    this.companyBasicInfoForm.get('company_size').valueChanges.subscribe(
      (company_size) => {
        this.company_size = company_size;
      }
    );
  }

  onSelectCity(city: City) {
    this.hq_city = city;
  }

  onBlurCity() {
    const value = this.companyBasicInfoForm.value.hq_city;
    if (value && this.helperService.checkSpacesString(value)) {
      if (this.hq_city && value !== this.helperService.cityNameFromAutoComplete(this.hq_city.city)) {
        this.hq_city = null;
      }
    } else {
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
      return true;
    }
  }

  onSelectState(state: State) {
    this.hq_state = state;
  }

  onBlurState() {
    const value = this.companyBasicInfoForm.value.hq_state;
    if (value && this.helperService.checkSpacesString(value)) {
      if (this.hq_state && value !== this.hq_state.state) {
        this.hq_state = null;
      }
    } else {
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
      return true;
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
    const value = this.companyIndustryForm.value.main_industry;
    if (value && this.helperService.checkSpacesString(value)) {
      if (this.main_industry && this.companyIndustryForm.value.main_industry !== this.main_industry.industry_name) {
        this.main_industry = null;
      }
    } else {
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
      return true;
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
    this.isNavMenuOpened = false;
  }

  onClickPublish() {
    if (!this.company) {
      const company: CompanyInfoRequest = {
        company_logo: null,
        company_name: this.company_name,
        company_desc: this.company_desc,
        company_size: this.parseCompanySize(this.company_size),
        hq_city: this.hq_city ? this.hq_city.city_id : null,
        hq_state: this.hq_state ? this.hq_state.state_id : null,
        hq_country: this.hq_country,
        founding_year: this.founding_year,
        website: this.website,
        main_industry: this.main_industry ? this.main_industry.industry_id : null,
        company_industry_ids: this.company_industries.length !== 0 ? this.company_industries.map((industry) => industry.industry_id) : null,
        active: 1
      };

      this.companyService.postCompany(company).subscribe(
        dataJson => {
          this.company = dataJson['data'];
          if (this.company.warning) {
            this.alertsService.show(this.company.warning, AlertType.error);
          }
          if (this.company_logo) {
            this.addCompanyLogo();
          }
          if (this.company_recruiters.length > 0) {
            this.addRecruiters();
          }
          if (this.company_administrators.length > 0) {
            this.addAdministrators();
          }
        },
        error => {
          this.alertsService.show(error.message, AlertType.error);
        }
      );
    }
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

  addCompanyLogo() {
    this.companyService.getSignedS3Url(this.company_logo, this.company.company_id)
      .subscribe((signedS3Url) => {
        this.userService.uploadPhotoToS3(this.company_logo, signedS3Url.data.signedUrl, signedS3Url.data.url)
          .subscribe((response) => {
              if (response.data) {
                this.company_logo_url = response.data;
                this.companyService.patchCompanyById({company_logo: this.company_logo_url}, this.company.company_id).subscribe(
                  dataJson => {
                    this.company = dataJson['data'];
                  },
                  error => {
                    this.alertsService.show(error.message, AlertType.error);
                  }
                );
              }
          }, err => {
            this.alertsService.show(err.message, AlertType.error);
          });
        }, err => {
          this.alertsService.show(err.message, AlertType.error);
        }
      );
  }

  addRecruiters() {
    this.company_recruiters.forEach(recruiter => {
      this.companyRecruiterService.postRecruiterByCompanyId({recruiterId: recruiter.user_id}, this.company.company_id).subscribe(
        dataJson => {
        },
        error => {
          this.alertsService.show(error.message, AlertType.error);
        }
      );
    });
  }

  addAdministrators() {
    this.company_administrators.forEach(administrator => {
      if (administrator.user_id !== this.currentUser.user_id) {
        this.companyAdminService.postAdmin({admin_id: administrator.user_id, company_id: this.company.company_id}).subscribe(
          dataJson => {
          },
          error => {
            this.alertsService.show(error.message, AlertType.error);
          }
        );
      }
    });
  }

  backToEdit() {
    if (this.current_tab === 'About') {
      this.goToPage(0);
    } else if (this.current_tab === 'People') {
      this.goToPage(this.is_administrators ? 3 : 4);
    }
  }

}

