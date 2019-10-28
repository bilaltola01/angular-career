import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import {
  AutoCompleteService,
  CompanyService,
  AlertsService,
  AlertType,
  HelperService,
  PositionService,
  UserStateService,
  ScoreService
} from 'src/app/services';
import { SkillDescriptionPopupComponent } from 'src/app/components/skill-description-popup/skill-description-popup.component';

import {
  PositionInfoRequest,
  PositionInfoResponse,
  Company,
  City,
  State,
  Countries,
  PositionLevel,
  JobType,
  ApplicationType,
  User,
  Major,
  Level,
  Levels,
  MajorCategory,
  Skill,
  Interest,
  School,
  Industry,
  UserSkillItem,
  CompanyInfoResponse,
  SkillLevelDescription,
  UserGeneralInfo
} from 'src/app/models';

export interface PreferredWorkExperience {
  preferred_exp_id: number;
  industry_id: number;
  industry_name: string;
  preferred_years: number;
  exp_desc: string;
  preferred_skills_trained: Skill[];
}

export interface EditSkillItem {
  index: number;
  skillItem: UserSkillItem;
}

export interface DialogData {
  category: 'skip' | 'quit';
}

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
    'School Restrictions'
  ];
  progressWidth = [
    {
      label: 10,
      width: 100 / 8 - 100 / 16
    },
    {
      label: 20,
      width: 200 / 8 - 100 / 16
    },
    {
      label: 30,
      width: 300 / 8 - 100 / 16
    },
    {
      label: 50,
      width: 400 / 8 - 100 / 16
    },
    {
      label: 60,
      width: 500 / 8 - 100 / 16
    },
    {
      label: 70,
      width: 600 / 8 - 100 / 16
    },
    {
      label: 100,
      width: 100
    }
  ];
  currentDate = new Date();
  minDate = new Date();
  countries: string[] = Countries.slice();
  countries_sort: string[] = Countries.slice().sort();
  displayItemsLimit = 7;
  positionLevels = PositionLevel;
  jobTypes = JobType;
  applicationTypes = ApplicationType;
  education_levels = Levels;

  // FormGroups
  nameOverviewForm: FormGroup;
  positionBasicInfoForm: FormGroup;
  preferredEducationForm: FormGroup;
  preferredWorkExperienceFormArray: FormArray;
  skillsForm: FormGroup;
  interestsForm: FormGroup;
  schoolRestrictionsForm: FormGroup;
  termsAndConditionsForm: FormGroup;

  // autocomplete lists
  autocomplete_companies: Company[] = [];
  autocomplete_cities: City[] = [];
  autocomplete_states: State[] = [];
  autocomplete_recruiters: User[] = [];
  autocomplete_majors: Major[] = [];
  autocomplete_major_categories: MajorCategory[] = [];
  autocomplete_minimum_skills: Skill[] = [];
  autocomplete_preferred_skills: Skill[] = [];
  autocomplete_preferred_interests: Interest[] = [];
  autocomplete_preferred_schools: School[] = [];
  autocomplete_industries: Industry[][] = [];
  autocomplete_skills_trained: Skill[][] = [];

  // Position information
  position_name: string;
  position_desc: string;
  position_company: Company;
  position_company_info: CompanyInfoResponse;
  position_city: City;
  position_state: State;
  position_country: number;
  position_salary: number;
  position_department: string;
  position_level: string;
  position_type: string;
  position_application_type: string;
  position_application_deadline: string;
  position_recruiter: User;

  preferred_education_levels: Level[];
  preferred_education_majors: Major[];
  preferred_education_major_categories: MajorCategory[];

  minimum_skills: UserSkillItem[];
  preferred_skills: UserSkillItem[];
  temp_minimum_skill: EditSkillItem;
  temp_preferred_skill: EditSkillItem;
  preferred_interests: Interest[];
  preferred_schools: School[];

  preferred_work_experiences: PreferredWorkExperience[];

  selectedPageIndex: number;
  isNavMenuOpened: boolean;
  isTabMenuOpen: boolean;

  position: PositionInfoResponse;

  current_user: UserGeneralInfo;
  is_loading: Boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertsService: AlertsService,
    public helperService: HelperService,
    public autoCompleteService: AutoCompleteService,
    private positionService: PositionService,
    private companyService: CompanyService,
    public dialog: MatDialog,
    private userStateService: UserStateService,
    private scoreService: ScoreService
  ) { }

  ngOnInit() {
    this.getCurrentUserInfo();
    this.minDate.setDate(this.currentDate.getDate() + 1);
    this.isTabMenuOpen = false;
    this.isNavMenuOpened = false;
    this.is_loading = false;
    this.selectedPageIndex = 0;
    if (this.route.snapshot.queryParams.type && this.route.snapshot.queryParams.id) {
      if (this.route.snapshot.queryParams.type === 'position') {
        this.selectedPageIndex = 7;
      }
    }
    this.initializeFormsByPageIndex();
    if (this.current_user) {
      this.position_recruiter = {
        user_id: this.current_user.user_id,
        first_name: this.current_user.first_name,
        last_name: this.current_user.last_name,
        photo: this.current_user.photo
      };
    }
  }

  getCurrentUserInfo() {
    this.userStateService.getUser.subscribe(user => {
      this.current_user = user;
    }, error => {
      this.alertsService.show(error.message, AlertType.error);
    });
  }

  onSelectNavItem(id: string) {
    let height = 130;
    if (document.getElementById('legend').clientHeight === 0) {
      height = 70;
    }
    document.getElementById('sidenav-content').scrollTop = document.getElementById(id).offsetTop - height;
  }

  onClickTogggle() {
    this.isNavMenuOpened = !this.isNavMenuOpened;
  }

  toggleTabMenuOpen() {
    this.isTabMenuOpen = !this.isTabMenuOpen;
  }

  goToNextPage() {
    if (this.selectedPageIndex === 0 && !this.position_name) {
      return;
    } else if (this.selectedPageIndex === 1 && !(this.positionBasicInfoForm.valid && this.position_company && this.position_level && this.position_type && this.onCheckCityValidation() && this.onCheckStateValidation() && this.onCheckRecruiterValidation())) {
      return;
    } else if (this.selectedPageIndex === 3 && !((this.preferred_work_experiences && this.preferred_work_experiences.length === 1 && !this.preferredWorkExperienceFormArray.at(0).value.industry && !this.preferredWorkExperienceFormArray.at(0).value.years && !this.preferredWorkExperienceFormArray.at(0).value.description && !this.preferred_work_experiences[0].preferred_skills_trained) || (this.preferredWorkExperienceFormArray.valid && this.onCheckAllIndustriesValidation()))) {
      return;
    } else if (this.selectedPageIndex === 4 && !this.minimum_skills && !this.preferred_skills) {
      this.openDialog('skip');
      return;
    }
    ++this.selectedPageIndex;
    switch (this.selectedPageIndex) {
      case 1:
        this.initPositionBasicInfoForm();
        break;
      case 2:
        this.initPreferredEducationForm();
        break;
      case 3:
        this.initPreferredWorkExperienceFormArray();
        break;
      case 4:
        this.initSkillsForm();
        break;
      case 5:
        this.initInterestsForm();
        break;
      case 6:
        this.initSchoolRestrictionsForm();
        break;
      case 7:
        this.sortPreferredEducationLevels();
        this.getCompanyInfo(this.position.company_id);
        break;
      default:
        break;
    }
  }

  goToPage(index: number) {
    if (index > this.selectedPageIndex) {
      if (this.selectedPageIndex === 0 && !this.position_name) {
        this.alertsService.show('Please fill out the position\'s name.', AlertType.error);
        return;
      } else if (this.selectedPageIndex === 1) {
        if (!this.position_company) {
          this.alertsService.show('You must provide a company.', AlertType.error);
          return;
        } else if (!this.position_country || !this.position_city || (this.positionBasicInfoForm.get('position_city').valid && !this.onCheckCityValidation()) || (this.position_country === 43 && !this.position_state || (this.positionBasicInfoForm.get('position_state').value && this.helperService.checkSpacesString(this.positionBasicInfoForm.get('position_state').value) && !this.onCheckStateValidation()))) {
          this.alertsService.show('You must provide the location information.', AlertType.error);
          return;
        } else if (!this.position_level) {
          this.alertsService.show('You must select position\'s level.', AlertType.error);
          return;
        } else if (!this.position_type) {
          this.alertsService.show('You must select position\'s type.', AlertType.error);
          return;
        } else if (!this.position_application_deadline) {
          this.alertsService.show('You must select application deadline', AlertType.error);
          return;
        } else if (!this.position) {
          this.alertsService.show('Please click "next" button.', AlertType.error);
          return;
        }
      }
    }
    if (index !== this.selectedPageIndex) {
      this.selectedPageIndex = index;
      this.isTabMenuOpen = false;
      this.isNavMenuOpened = false;
      this.initializeFormsByPageIndex();
    }
  }

  initializeFormsByPageIndex() {
    // this.getPositionInfo();
    if ((this.position && this.position.position_id) || (this.route.snapshot.queryParams.type && this.route.snapshot.queryParams.type === 'position')) {
      this.getPositionInfo();
    } else {
      switch (this.selectedPageIndex) {
        case 0:
          this.initNameOverviewForm();
          break;
        case 1:
          this.initPositionBasicInfoForm();
          break;
        case 2:
          this.initPreferredEducationForm();
          break;
        case 3:
          this.initPreferredWorkExperienceFormArray();
          break;
        case 4:
          this.initSkillsForm();
          break;
        case 5:
          this.initInterestsForm();
          break;
        case 6:
          this.initSchoolRestrictionsForm();
          break;
        case 7:
          this.sortPreferredEducationLevels();
          break;
        default:
          break;
      }
    }
  }

  getPositionInfo() {
    if ((this.position && this.position.position_id) || (this.route.snapshot.queryParams.type && this.route.snapshot.queryParams.type === 'position')) {
      const position_id = (this.route.snapshot.queryParams.type && this.route.snapshot.queryParams.id && this.route.snapshot.queryParams.type === 'position') ? this.route.snapshot.queryParams.id : this.position.position_id;
      this.is_loading = true;
      // this.positionService.getPositionById(18).subscribe(
      this.positionService.getPositionById(position_id).subscribe(
        dataJson => {
          this.position = dataJson['data'];
          this.is_loading = false;
          switch (this.selectedPageIndex) {
            case 0:
              this.initNameOverviewForm();
              break;
            case 1:
              this.initPositionBasicInfoForm();
              break;
            case 2:
              this.initPreferredEducationForm();
              break;
            case 3:
              this.initPreferredWorkExperienceFormArray();
              break;
            case 4:
              this.initSkillsForm();
              break;
            case 5:
              this.initInterestsForm();
              break;
            case 6:
              this.initSchoolRestrictionsForm();
              break;
            case 7:
              this.getCompanyInfo(this.position.company_id);
              break;
            default:
              break;
          }
        },
        error => {
          this.alertsService.show(error.message, AlertType.error);
        }
      );
    }
  }

  sortPreferredEducationLevels() {
    if (this.preferred_education_levels && this.preferred_education_levels.length > 2) {
      this.preferred_education_levels.sort((a, b) => (a.level > b.level) ? 1 : ((b.level > a.level) ? -1 : 0));
    }
  }

  /**
   * Position Name and Overview Form
   */
  initNameOverviewForm() {
    if (this.position) {
      this.position_name = this.position.position;
      this.position_desc = this.position.position_desc;
    }
    this.nameOverviewForm = new FormGroup({
      position_name: new FormControl(this.position_name ? this.position_name : null, [Validators.required]),
      position_desc: new FormControl(this.position_desc ? this.position_desc : null),
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

    if (this.position) {
      this.position_company = {
        company_id: this.position.company_id,
        company_name: this.position.company_name,
        company_logo: null
      };
      this.position_city = this.position.locations && this.position.locations.length > 0 ? {
        city_id: this.position.locations[0].city_id,
        city: this.position.locations[0].city
      } : null;
      this.position_state = this.position.locations && this.position.locations.length > 0 ? {
        state_id: this.position.locations[0].state_id,
        state: this.position.locations[0].state
      } : null;
      this.position_country = this.position.locations && this.position.locations.length > 0 ? this.position.locations[0].country_id : null;
      this.position_salary = this.position.pay ? this.position.pay : null;
      this.position_department = this.position.department ? this.position.department : null;
      this.position_level = this.position.level ? this.position.level : null;
      this.position_type = this.position.type ? this.position.type : null;
      this.position_application_type = this.position.application_type ? this.position.application_type : null;
      this.position_application_deadline = this.position.application_deadline ? this.helperService.convertToFormattedString(this.position.application_deadline, 'YYYY-MM-DD') : null;
      if (this.position.recruiter_id && this.position.recruiter_name) {
        this.position_recruiter.user_id = this.position.recruiter_id;
      }
    }

    this.positionBasicInfoForm = new FormGroup({
      position_company: new FormControl(this.position_company ? this.position_company.company_name : null, [Validators.required]),
      position_city: new FormControl(this.position_city ? this.helperService.cityNameFromAutoComplete(this.position_city.city) : null, [Validators.required]),
      position_state: new FormControl(this.position_state ? this.position_state.state : null),
      position_country: new FormControl(this.position_country ? Countries[this.position_country - 1] : null, [Validators.required]),
      position_salary: new FormControl(this.position_salary ? this.position_salary : null),
      position_department: new FormControl(this.position_department ? this.position_department : null),
      position_level: new FormControl(this.position_level ? this.position_level : null, [Validators.required]),
      position_type: new FormControl(this.position_type ? this.position_type : null, [Validators.required]),
      position_application_type: new FormControl(this.position_application_type ? this.position_application_type : null),
      position_application_deadline: new FormControl(this.position_application_deadline ? this.helperService.convertStringToFormattedDateString(this.position_application_deadline, 'YYYY-MM-DD', 'L') : null, [Validators.required]),
      position_recruiter: new FormControl(this.position_recruiter ? (this.position && this.position_recruiter.user_id === this.position.recruiter_id ? this.position.recruiter_name : `${this.position_recruiter.first_name} ${this.position_recruiter.last_name}`) + (this.position_recruiter.user_id === this.current_user.user_id ? ' (Me)' : '')  : null)
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
          if (this.position_country !== 43) {
            this.position_state = null;
            this.positionBasicInfoForm.get('position_state').setValue('');
          }
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

    this.positionBasicInfoForm.get('position_department').valueChanges.subscribe(
      (position_department) => {
        this.position_department = position_department ? this.helperService.checkSpacesString(position_department) : null;
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
        this.position_application_deadline = position_application_deadline && this.helperService.checkSpacesString(position_application_deadline) ? this.helperService.convertStringToFormattedDateString(position_application_deadline, 'L', 'YYYY-MM-DD') : null;
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
    this.getCompanyInfo(this.position_company.company_id);
  }

  getCompanyInfo(company_id: number) {
    this.companyService.getCompanyById(company_id).subscribe(
      dataJson => {
        if (dataJson['success']) {
          this.position_company_info = dataJson['data'];
        }
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
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
      if (this.position_recruiter) {
        if (this.position_recruiter.user_id !== this.current_user.user_id && value !== `${this.position_recruiter.first_name} ${this.position_recruiter.last_name}`) {
          this.position_recruiter = null;
        } else if (this.position_recruiter.user_id === this.current_user.user_id && value !== `${this.position_recruiter.first_name} ${this.position_recruiter.last_name} (Me)`) {
          this.position_recruiter = null;
        }
      }
    } else {
      this.position_recruiter = null;
    }
  }

  onCheckRecruiterValidation(): boolean {
    const value = this.positionBasicInfoForm.value.position_recruiter;
    if (value && this.helperService.checkSpacesString(value)) {
      if (this.position_recruiter) {
        if (this.position_recruiter.user_id !== this.current_user.user_id) {
          return value === `${this.position_recruiter.first_name} ${this.position_recruiter.last_name}` ? true : false;
        } else {
          return value === `${this.position_recruiter.first_name} ${this.position_recruiter.last_name} (Me)` ? true : false;
        }
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

  /**
   * Preferred Education Form
   */
  initPreferredEducationForm() {
    this.autocomplete_majors = [];
    this.autocomplete_major_categories = [];

    if (this.position && this.position.position_id) {
      this.preferred_education_levels = this.position.preferred_education_levels && this.position.preferred_education_levels.length > 0 ? this.position.preferred_education_levels.slice() : null;
      this.preferred_education_majors = this.position.preferred_majors && this.position.preferred_majors.length > 0 ? this.position.preferred_majors.slice() : null;
      this.preferred_education_major_categories = this.position.preferred_major_categories && this.position.preferred_major_categories.length > 0 ? this.position.preferred_major_categories.slice() : null;
    }

    this.preferredEducationForm = new FormGroup({
      search_eduaction_level: new FormControl(''),
      search_education_major: new FormControl(''),
      search_major_category: new FormControl('')
    });

    this.preferredEducationForm.get('search_education_major').valueChanges.subscribe((search_education_major) => {
      if (search_education_major && this.helperService.checkSpacesString(search_education_major)) {
        this.autoCompleteService.autoComplete(search_education_major, 'majors').subscribe(
          dataJson => {
            if (dataJson['success']) {
              this.autocomplete_majors = dataJson['data'];
            }
          },
          error => {
            this.alertsService.show(error.message, AlertType.error);
            this.autocomplete_majors = [];
          }
        );
      } else {
        this.autocomplete_majors = [];
      }
    });

    this.preferredEducationForm.get('search_major_category').valueChanges.subscribe((search_major_category) => {
      if (search_major_category && this.helperService.checkSpacesString(search_major_category)) {
        this.autoCompleteService.autoComplete(search_major_category, 'major-categories').subscribe(
          dataJson => {
            if (dataJson['success']) {
              this.autocomplete_major_categories = dataJson['data'];
            }
          },
          error => {
            this.alertsService.show(error.message, AlertType.error);
            this.autocomplete_major_categories = [];
          }
        );
      } else {
        this.autocomplete_major_categories = [];
      }
    });
  }

  /**
   * Select Education Level from dropdown list, add current eduaction Level to array.
   * @param level - education level
   */
  onSelectEducationLevel(level: Level) {
    // if array is null, create a new array.
    if (!this.preferred_education_levels) {
      this.preferred_education_levels = [level];
    } else {
      // current education level is not in array, add it.
      const filter = this.preferred_education_levels.filter(value => value.level_id === level.level_id);
      if (filter.length === 0) {
        this.preferred_education_levels.push(level);
      }
    }
    this.preferredEducationForm.patchValue({search_eduaction_level: ''});
  }

  /**
   * Remove Education level from array
   * @param level - education level
   * @param arrIndex - array Index
   */
  onRemoveEducationLevel(level: Level, arrIndex: number) {
    if (this.preferred_education_levels[arrIndex].level_id === level.level_id) {
      this.preferred_education_levels.splice(arrIndex, 1);
    }
    if (this.preferred_education_levels.length === 0) {
      this.preferred_education_levels = null;
    }
    // if the current education level exists in database, remove it from database.
    const index = this.position.preferred_education_levels.findIndex(value => value.level_id === level.level_id);
    if (index !== -1) {
      this.removePreferredEducationLevel(this.position.position_id, level.level_id, index);
    }
  }

  /**
   * Select Education Major from autocomplete list, add current major to array
   * @param major - major
   */
  onSelectEducationMajor(major: Major) {
    if (!this.preferred_education_majors) {
      this.preferred_education_majors = [major];
    } else {
      const filter = this.preferred_education_majors.filter(value => value.major_id === major.major_id);
      if (filter.length === 0) {
        this.preferred_education_majors.push(major);
      }
    }
    this.preferredEducationForm.patchValue({search_education_major: ''});
  }

  /**
   * Remove current major from array
   * @param major - major
   * @param arrIndex - array Index
   */
  onRemoveEducationMajor(major: Major, arrIndex: number) {
    if (this.preferred_education_majors[arrIndex].major_id === major.major_id) {
      this.preferred_education_majors.splice(arrIndex, 1);
    }
    if (this.preferred_education_majors.length === 0) {
      this.preferred_education_majors = null;
    }
    const index = this.position.preferred_majors.findIndex(value => value.major_id === major.major_id);
    if (index !== -1) {
      this.removePreferredEducationMajor(this.position.position_id, major.major_id, index);
    }
  }

  /**
   * Select Education Major Category from autocomplete list, add to array.
   * @param major_category
   */
  onSelectEducationMajorCategory(major_category: MajorCategory) {
    if (!this.preferred_education_major_categories) {
      this.preferred_education_major_categories = [major_category];
    } else {
      const filter = this.preferred_education_major_categories.filter(value => value.cat_id === major_category.cat_id);
      if (filter.length === 0) {
        this.preferred_education_major_categories.push(major_category);
      }
    }
    this.preferredEducationForm.patchValue({search_major_category: ''});
  }

  /**
   * Remove from array
   * @param major_category
   * @param arrIndex
   */
  onRemoveEducationMajorCategory(major_category: MajorCategory, arrIndex: number) {
    if (this.preferred_education_major_categories[arrIndex].cat_id === major_category.cat_id) {
      this.preferred_education_major_categories.splice(arrIndex, 1);
    }
    if (this.preferred_education_major_categories.length === 0) {
      this.preferred_education_major_categories = null;
    }

    const index = this.position.preferred_major_categories.findIndex(value => value.cat_id === major_category.cat_id);
    if (index !== -1) {
      this.removePreferredEducationMajorCategory(this.position.position_id, major_category.cat_id, index);
    }
  }

  /**
  * Preferred Work Experience Form
  */
  initPreferredWorkExperienceFormArray() {
    this.autocomplete_industries = [];
    this.autocomplete_skills_trained = [];

    if (this.position && this.position.position_id && this.position.preferred_experience && this.position.preferred_experience.length > 0) {
      const data = {experiences: this.position.preferred_experience};
      this.preferred_work_experiences = JSON.parse(JSON.stringify(data)).experiences;
    }

    this.preferredWorkExperienceFormArray = new FormArray([]);

    if (!this.preferred_work_experiences || this.preferred_work_experiences.length === 0) {
      this.preferred_work_experiences = [{
        preferred_exp_id: null,
        industry_id: null,
        industry_name: null,
        preferred_years: null,
        exp_desc: null,
        preferred_skills_trained: null
      }];
      this.addPreferredWorkExperienceFormGroup(null);
    } else {
      this.preferred_work_experiences.forEach((experience) => {
        this.addPreferredWorkExperienceFormGroup(experience);
      });
    }
  }

  addPreferredWorkExperienceFormGroup(experience: PreferredWorkExperience) {
    this.autocomplete_industries.push([]);
    this.autocomplete_skills_trained.push([]);

    const arrIndex = this.autocomplete_industries.length - 1;

    const experienceForm = new FormGroup({
      industry: new FormControl(experience && experience.industry_id ? experience.industry_name : '', [Validators.required]),
      years: new FormControl(experience && experience.preferred_years ? experience.preferred_years : '', [Validators.required]),
      description: new FormControl(experience && experience.exp_desc ? experience.exp_desc : ''),
      skills_trained: new FormControl('')
    });

    experienceForm.get('industry').valueChanges.subscribe((industry) => {
      if (industry && this.helperService.checkSpacesString(industry)) {
        this.autoCompleteService.autoComplete(industry, 'industries').subscribe(
          dataJson => {
            if (dataJson['success']) {
              this.autocomplete_industries[arrIndex] = dataJson['data'];
            }
          },
          error => {
            this.alertsService.show(error.message, AlertType.error);
            this.autocomplete_industries[arrIndex] = [];
          }
        );
      } else {
        this.autocomplete_industries[arrIndex] = [];
      }
    });
    experienceForm.get('years').valueChanges.subscribe(
      (years) => {
        this.preferred_work_experiences[arrIndex].preferred_years = years && this.preferredWorkExperienceFormArray.at(arrIndex).get('years').valid ? parseInt(years, 10) : null;
      }
    );
    experienceForm.get('description').valueChanges.subscribe(
      (description) => {
        this.preferred_work_experiences[arrIndex].exp_desc = description ? this.helperService.checkSpacesString(description) : null;
      }
    );
    experienceForm.get('skills_trained').valueChanges.subscribe((skills_trained) => {
      if (skills_trained && this.helperService.checkSpacesString(skills_trained)) {
        this.autoCompleteService.autoComplete(skills_trained, 'skills').subscribe(
          dataJson => {
            if (dataJson['success']) {
              this.autocomplete_skills_trained[arrIndex] = dataJson['data'];
            }
          },
          error => {
            this.alertsService.show(error.message, AlertType.error);
            this.autocomplete_skills_trained[arrIndex] = [];
          }
        );
      } else {
        this.autocomplete_skills_trained[arrIndex] = [];
      }
    });

    this.preferredWorkExperienceFormArray.push(experienceForm);
  }

  onSelectIndustry(industry: Industry, arrIndex: number) {
    this.preferred_work_experiences[arrIndex].industry_id = industry.industry_id;
    this.preferred_work_experiences[arrIndex].industry_name = industry.industry_name;
  }

  onBlurIndustry(arrIndex: number) {
    const value = this.preferredWorkExperienceFormArray.value[arrIndex].industry;
    if (value && this.helperService.checkSpacesString(value)) {
      if (this.preferred_work_experiences[arrIndex].industry_id && value !== this.preferred_work_experiences[arrIndex].industry_name) {
        this.preferred_work_experiences[arrIndex].industry_id = null;
        this.preferred_work_experiences[arrIndex].industry_name = null;
      }
    } else {
      this.preferred_work_experiences[arrIndex].industry_id = null;
      this.preferred_work_experiences[arrIndex].industry_name = null;
    }
  }

  onCheckIndustryValidation(arrIndex: number): boolean {
    const value = this.preferredWorkExperienceFormArray.value[arrIndex].industry;
    if (value && this.helperService.checkSpacesString(value)) {
      if (this.preferred_work_experiences[arrIndex].industry_id) {
        return value === this.preferred_work_experiences[arrIndex].industry_name ? true : false;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  onSelectSkillsTrained(formIndex: number, skill: Skill) {
    if (!this.preferred_work_experiences[formIndex].preferred_skills_trained) {
      this.preferred_work_experiences[formIndex].preferred_skills_trained = [skill];
    } else {
      const filter = this.preferred_work_experiences[formIndex].preferred_skills_trained.filter(value => value.skill_id === skill.skill_id);
      if (filter.length === 0) {
        this.preferred_work_experiences[formIndex].preferred_skills_trained.push(skill);
      }
    }
    this.preferredWorkExperienceFormArray.at(formIndex).get('skills_trained').setValue('');
  }

  onRemoveSkillsTrained(formIndex: number, skill: Skill, arrIndex: number) {
    if (this.preferred_work_experiences[formIndex].preferred_skills_trained[arrIndex].skill_id === skill.skill_id) {
      this.preferred_work_experiences[formIndex].preferred_skills_trained.splice(arrIndex, 1);
    }
    if (this.preferred_work_experiences[formIndex].preferred_skills_trained.length === 0) {
      this.preferred_work_experiences[formIndex].preferred_skills_trained = null;
    }
    if (this.preferred_work_experiences[formIndex].preferred_exp_id) {
      const exp_index = this.position.preferred_experience.findIndex(value => value.preferred_exp_id === this.preferred_work_experiences[formIndex].preferred_exp_id);
      if (exp_index !== -1) {
        const skill_index = this.position.preferred_experience[exp_index].preferred_skills_trained.findIndex(value => value.skill_id === skill.skill_id);
        if (skill_index !== -1) {
          this.removePreferredWorkExperienceSkillTrained(this.preferred_work_experiences[formIndex].preferred_exp_id, skill.skill_id, exp_index, skill_index);
        }
      }
    }
  }

  onAddPreferredWorkExperienceFormGroup() {
    if (this.preferredWorkExperienceFormArray.valid && this.onCheckAllIndustriesValidation()) {
      this.preferred_work_experiences.push({
        preferred_exp_id: null,
        industry_id: null,
        industry_name: null,
        preferred_years: null,
        exp_desc: null,
        preferred_skills_trained: null
      });
      this.addPreferredWorkExperienceFormGroup(null);
    }
  }

  onRemovePreferredWorkExperienceFormGroup(arrIndex: number) {
    if (this.preferred_work_experiences[arrIndex].preferred_exp_id) {
      const index = this.position.preferred_experience.findIndex(value => value.preferred_exp_id === this.preferred_work_experiences[arrIndex].preferred_exp_id);
      this.removePreferredWorkExperience(this.position.position_id, this.preferred_work_experiences[arrIndex].preferred_exp_id, index);
    }
    this.preferredWorkExperienceFormArray.removeAt(arrIndex);
    this.preferred_work_experiences.splice(arrIndex, 1);
    this.autocomplete_industries.splice(arrIndex, 1);
    this.autocomplete_skills_trained.splice(arrIndex, 1);
  }

  onCheckAllIndustriesValidation(): boolean {
    let valid = true;
    this.preferred_work_experiences.forEach((_, arrIndex) => {
      if (!this.onCheckIndustryValidation(arrIndex)) {
        valid = false;
      }
    });
    return valid;
  }


  /**
   * Skills Form
   */
  initSkillsForm() {
    this.autocomplete_minimum_skills = [];
    this.autocomplete_preferred_skills = [];
    this.temp_minimum_skill = null;
    this.temp_preferred_skill = null;

    if (this.position && this.position.position_id) {
      this.preferred_skills = this.position.preferred_skills && this.position.preferred_skills.length > 0 ? this.position.preferred_skills.slice() : null;
      this.minimum_skills = this.position.minimum_skills && this.position.minimum_skills.length > 0 ? this.position.minimum_skills.slice() : null;
    }

    this.skillsForm = new FormGroup({
      search_minimum_skill: new FormControl(''),
      search_preferred_skill: new FormControl('')
    });

    this.skillsForm.get('search_minimum_skill').valueChanges.subscribe((search_minimum_skill) => {
      if (search_minimum_skill && this.helperService.checkSpacesString(search_minimum_skill)) {
        this.autoCompleteService.autoComplete(search_minimum_skill, 'skills').subscribe(
          dataJson => {
            if (dataJson['success']) {
              this.autocomplete_minimum_skills = dataJson['data'];
            }
          },
          error => {
            this.alertsService.show(error.message, AlertType.error);
            this.autocomplete_minimum_skills = [];
          }
        );
      } else {
        this.autocomplete_minimum_skills = [];
      }
    });

    this.skillsForm.get('search_preferred_skill').valueChanges.subscribe((search_preferred_skill) => {
      if (search_preferred_skill && this.helperService.checkSpacesString(search_preferred_skill)) {
        this.autoCompleteService.autoComplete(search_preferred_skill, 'skills').subscribe(
          dataJson => {
            if (dataJson['success']) {
              this.autocomplete_preferred_skills = dataJson['data'];
            }
          },
          error => {
            this.alertsService.show(error.message, AlertType.error);
            this.autocomplete_preferred_skills = [];
          }
        );
      } else {
        this.autocomplete_preferred_skills = [];
      }
    });
  }

  /**
   * select skill from autocomplete list, add to array
   * @param skill
   */
  onSelectMinimumSkill(skill: Skill) {
    const skillItemData = {
      skill_id: skill.skill_id,
      skill: skill.skill,
      skill_level: 1
    };

    let arrIndex = 0;
    if (!this.minimum_skills) {
      this.minimum_skills = [skillItemData];
    } else {
      arrIndex = this.minimum_skills.findIndex(value => value.skill_id === skill.skill_id);
      if (arrIndex === -1) {
        this.minimum_skills.push(skillItemData);
        arrIndex = this.minimum_skills.length - 1;
      } else {
        skillItemData.skill_level = this.minimum_skills[arrIndex].skill_level;
      }
    }
    this.temp_minimum_skill = {
      index: arrIndex,
      skillItem: skillItemData
    };
    this.skillsForm.patchValue({search_minimum_skill: ''});
  }

  /**
   * Remove from array
   * @param skill
   * @param arrIndex
   */
  onRemoveMinimumSkill(skill: Skill, arrIndex: number) {
    if (this.minimum_skills[arrIndex].skill_id === skill.skill_id) {
      this.minimum_skills.splice(arrIndex, 1);
    }
    if (this.minimum_skills.length === 0) {
      this.minimum_skills = null;
    }
    this.temp_minimum_skill = null;
    const index = this.position.minimum_skills.findIndex(value => value.skill_id === skill.skill_id);
    if (index !== -1) {
      this.removeMinimumSkill(this.position.position_id, skill.skill_id, index);
    }
  }

  onSelectPreferredSkill(skill: Skill) {
    const skillItemData = {
      skill_id: skill.skill_id,
      skill: skill.skill,
      skill_level: 1
    };
    let arrIndex = 0;
    if (!this.preferred_skills) {
      this.preferred_skills = [skillItemData];
    } else {
      arrIndex = this.preferred_skills.findIndex(value => value.skill_id === skill.skill_id);
      if (arrIndex === -1) {
        this.preferred_skills.push(skillItemData);
        arrIndex = this.preferred_skills.length - 1;
      } else {
        skillItemData.skill_level = this.preferred_skills[arrIndex].skill_level;
      }
    }
    this.temp_preferred_skill = {
      index: arrIndex,
      skillItem: skillItemData
    };
    this.skillsForm.patchValue({search_preferred_skill: ''});
  }

  onRemovePreferredSkill(skill: Skill, arrIndex: number) {
    if (this.preferred_skills[arrIndex].skill_id === skill.skill_id) {
      this.preferred_skills.splice(arrIndex, 1);
    }
    if (this.preferred_skills.length === 0) {
      this.preferred_skills = null;
    }
    this.temp_preferred_skill = null;
    const index = this.position.preferred_skills.findIndex(value => value.skill_id === skill.skill_id);
    if (index !== -1) {
      this.removePreferredSkill(this.position.position_id, skill.skill_id, index);
    }
  }

  onLevelChanged(level: number, index: number, is_minimum_skill: boolean) {
    let arrIndex;
    if (is_minimum_skill) {
      arrIndex = this.position.minimum_skills.findIndex(value => value.skill_id === this.minimum_skills[index].skill_id);
      if (arrIndex !== -1 && this.position.minimum_skills[arrIndex].skill_level !== level) {
        this.patchMimimumSkill(this.position.position_id, this.position.minimum_skills[arrIndex].skill_id, level, arrIndex);
      }
      this.minimum_skills[index].skill_level = level;
      if (this.temp_minimum_skill) {
        this.temp_minimum_skill.skillItem = this.minimum_skills[index];
      }
    } else {
      arrIndex = this.position.preferred_skills.findIndex(value => value.skill_id === this.preferred_skills[index].skill_id);
      if (arrIndex !== -1 && this.position.preferred_skills[arrIndex].skill_level !== level) {
        this.patchPreferredSkill(this.position.position_id, this.position.preferred_skills[arrIndex].skill_id, level, arrIndex);
      }
      this.preferred_skills[index].skill_level = level;
      if (this.temp_preferred_skill) {
        this.temp_preferred_skill.skillItem = this.preferred_skills[index];
      }
    }
  }

  editSkillDone(is_minimum_skill: boolean) {
    if (is_minimum_skill) {
      this.temp_minimum_skill = null;
    } else {
      this.temp_preferred_skill = null;
    }
  }


  /**
  * Interests Form
  */
  initInterestsForm() {
    this.autocomplete_preferred_interests = [];

    if (this.position && this.position.position_id) {
      this.preferred_interests = this.position.preferred_interests && this.position.preferred_interests.length > 0 ? this.position.preferred_interests.slice() : null;
    }

    this.interestsForm = new FormGroup({
      search_preferred_interest: new FormControl('')
    });

    this.interestsForm.get('search_preferred_interest').valueChanges.subscribe((search_preferred_interest) => {
      if (search_preferred_interest && this.helperService.checkSpacesString(search_preferred_interest)) {
        this.autoCompleteService.autoComplete(search_preferred_interest, 'interests').subscribe(
          dataJson => {
            if (dataJson['success']) {
              this.autocomplete_preferred_interests = dataJson['data'];
            }
          },
          error => {
            this.alertsService.show(error.message, AlertType.error);
            this.autocomplete_preferred_interests = [];
          }
        );
      } else {
        this.autocomplete_preferred_interests = [];
      }
    });
  }

  /**
   * Select interest from autocomplete list, add to array
   * @param interest
   */
  onSelectPreferredInterest(interest: Interest) {
    if (!this.preferred_interests) {
      this.preferred_interests = [interest];
    } else {
      const filter = this.preferred_interests.filter(value => value.interest_id === interest.interest_id);
      if (filter.length === 0) {
        this.preferred_interests.push(interest);
      }
    }
    this.interestsForm.patchValue({search_preferred_interest: ''});
  }

  /**
   * Remove from array
   * @param interest
   * @param arrIndex
   */
  onRemovePreferredInterest(interest: Interest, arrIndex: number) {
    if (this.preferred_interests[arrIndex].interest_id === interest.interest_id) {
      this.preferred_interests.splice(arrIndex, 1);
    }
    if (this.preferred_interests.length === 0) {
      this.preferred_interests = null;
    }

    const index = this.position.preferred_interests.findIndex(value => value.interest_id === interest.interest_id);
    if (index !== -1) {
      this.removePreferredInterest(this.position.position_id, interest.interest_id, index);
    }
  }

  /**
   * School Restrictions Form
   */
  initSchoolRestrictionsForm() {
    this.autocomplete_preferred_schools = [];

    if (this.position && this.position.position_id) {
      this.preferred_schools = this.position.preferred_schools && this.position.preferred_schools.length > 0 ? this.position.preferred_schools.slice() : null;
    }

    this.schoolRestrictionsForm = new FormGroup({
      search_preferred_school: new FormControl('')
    });

    this.schoolRestrictionsForm.get('search_preferred_school').valueChanges.subscribe((search_preferred_school) => {
      if (search_preferred_school && this.helperService.checkSpacesString(search_preferred_school)) {
        this.autoCompleteService.autoComplete(search_preferred_school, 'schools').subscribe(
          dataJson => {
            if (dataJson['success']) {
              this.autocomplete_preferred_schools = dataJson['data'];
            }
          },
          error => {
            this.alertsService.show(error.message, AlertType.error);
            this.autocomplete_preferred_schools = [];
          }
        );
      } else {
        this.autocomplete_preferred_schools = [];
      }
    });
  }

  /**
   * Select school from autocomplete list, add to array
   * @param school
   */
  onSelectPreferredSchool(school: School) {
    if (!this.preferred_schools) {
      this.preferred_schools = [school];
    } else {
      const filter = this.preferred_schools.filter(value => value.school_id === school.school_id);
      if (filter.length === 0) {
        this.preferred_schools.push(school);
      }
    }
    this.schoolRestrictionsForm.patchValue({search_preferred_school: ''});
  }

  /**
   * Remove from array
   * @param school
   * @param arrIndex
   */
  onRemovePreferredSchool(school: School, arrIndex: number) {
    if (this.preferred_schools[arrIndex].school_id === school.school_id) {
      this.preferred_schools.splice(arrIndex, 1);
    }
    if (this.preferred_schools.length === 0) {
      this.preferred_schools = null;
    }

    const index = this.position.preferred_schools.findIndex(value => value.school_id === school.school_id);
    if (index !== -1) {
      this.removePreferredSchool(this.position.position_id, school.school_id, index);
    }
  }

  /**
   * Create new position.
   * poistion is still inactive, won't be published yet. open: 0
   * if new position already created, then update the position with the latest infomation.
   * Once position has been created or updated, location for current position should be updated.
   */
  createPosition() {
    // request data
    const positionInfo: PositionInfoRequest = {
      position:	this.position_name,
      company_id:	this.position_company.company_id,
      level: this.position_level ? this.position_level : null,
      type:	this.position_type ? this.position_type : null,
      position_desc: this.position_desc ? this.position_desc : null,
      start_date:	null,
      end_date:	null,
      position_filled: null,
      pay: this.position_salary ? this.position_salary : null,
      negotiable:	null,
      repeat_post: null,
      repeat_date: null,
      cover_letter_req:	null,
      recruiter_id:	this.position_recruiter ? this.position_recruiter.user_id : null,
      department:	this.position_department ? this.position_department : null,
      open:	0,
      openings:	null,
      application_deadline:	this.position_application_deadline ? this.position_application_deadline : null
    };

    if (this.position && this.position.position_id) {
      // If position has already created, then current position should be updated with the latest data.
      if ( positionInfo.position === this.position.position
        && positionInfo.position_desc === this.position.position_desc
        && positionInfo.company_id === this.position.company_id
        && positionInfo.level === this.position.level
        && positionInfo.type === this.position.type
        && positionInfo.pay === this.position.pay
        && positionInfo.recruiter_id === this.position.recruiter_id
        && positionInfo.department === this.position.department
        && positionInfo.application_deadline === this.helperService.convertToFormattedString(this.position.application_deadline, 'YYYY-MM-DD')
      ) {
        this.addPositionLocationInfo(this.position.position_id);
      } else {
        this.positionService.patchPosition(this.position.position_id, positionInfo).subscribe(
          dataJson => {
            this.position = dataJson['data'];
            this.addPositionLocationInfo(this.position.position_id);
          },
          error => {
            this.alertsService.show(error.message, AlertType.error);
          }
        );
      }
    } else {
      // Create new position
      this.positionService.postPosition(positionInfo).subscribe(
        dataJson => {
          this.position = dataJson['data'];
          this.addPositionLocationInfo(this.position.position_id);
        },
        error => {
          this.alertsService.show(error.message, AlertType.error);
        }
      );
    }
  }

  /**
   *  Add Position Location Info
   * @param position_id - position's id
   *
   * If location already exist for current position, delete it and add a new location
   * state is selectable for USA only.
   */
  addPositionLocationInfo(position_id: number) {
    if (this.position_city || this.position_state || this.position_country) {

      let location = null;
      const locationInfo = {
        position_id: position_id,
        city_id: this.position_city ? this.position_city.city_id : null,
        state_id:	this.position_state ? this.position_state.state_id : null,
        country_id:	this.position_country ? this.position_country : null
      };

      // if location info already exist for current position
      if (this.position.locations && this.position.locations.length > 0) {
        location = this.position.locations[0];

        if (location && location.city_id === locationInfo.city_id && location.state_id === locationInfo.state_id && location.country_id === locationInfo.country_id) {
          // if Location is same, go to next page without API call.
          this.goToNextPage();
        } else {
          // if locaiton is not same, delete current location, and add new location.
          if (location.city_id && location.country_id) {
            this.positionService.deletePositionLocations(position_id, location.city_id, location.country_id).subscribe(
              dataJson => {
                this.addLocation(this.position.position_id, locationInfo);
              },
              error => {
                this.alertsService.show(error.message, AlertType.error);
                this.goToNextPage();
              }
            );
          }
        }
      } else {
        // if location is not exist for current position, add new location.
        this.addLocation(this.position.position_id, locationInfo);
      }
    } else {
      this.goToNextPage();
    }
  }

  /**
   * Add position's location.
   * @param position_id - position id
   * @param locationInfo - request data
   */
  addLocation(position_id: number, locationInfo: any) {
    this.positionService.postLocation(locationInfo).subscribe(
      dataJson => {
        this.goToNextPage();
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
        this.goToNextPage();
      }
    );
  }

  onClickPublish() {
    if (this.position) {
      const position: PositionInfoRequest = {
        position:	this.position_name,
        company_id:	this.position_company.company_id,
        level: this.position_level ? this.position_level : null,
        type:	this.position_type ? this.position_type : null,
        position_desc: this.position_desc ? this.position_desc : null,
        start_date:	null,
        end_date:	null,
        position_filled: null,
        pay: this.position_salary ? this.position_salary : null,
        negotiable:	null,
        repeat_post: null,
        repeat_date: null,
        cover_letter_req:	null,
        recruiter_id:	this.position_recruiter ? this.position_recruiter.user_id : null,
        department:	this.position_department ? this.position_department : null,
        open:	1,
        openings:	null,
        application_deadline:	this.position_application_deadline ? this.position_application_deadline : null
      };

      this.positionService.patchPosition(this.position.position_id, position).subscribe(
        dataJson => {
          this.position = dataJson['data'];

          if (dataJson['data'] && dataJson['data'].position_id) {
            this.addPreferredEducationLevels(dataJson['data'].position_id);
          }
        },
        error => {
          this.alertsService.show(error.message, AlertType.error);
        }
      );
    }
  }

  /**
   * Add position's information. This method should be called when user click "next" button.
   * @param form_name - form name
   */
  addPositionInfo(form_name: string) {
    if (this.position && this.position.position_id) {
      switch (form_name) {
        case 'education':
          this.addPreferredEducationLevels(this.position.position_id);
          break;
        case 'work_experience':
          this.addPreferredWorkExperiences(this.position.position_id);
          break;
        case 'skills':
          this.addMinimumSkills(this.position.position_id);
          break;
        case 'interests':
          this.addPreferredInterests(this.position.position_id);
          break;
        case 'schools':
          this.addPreferredSchools(this.position.position_id);
          break;
        default:
          break;
      }
    } else {
      this.alertsService.show('unknown error!', AlertType.error);
      this.goToPage(0);
    }
  }

  /**
   * Add preferred educaiton levels in current position.
   * @param position_id - position id
   */
  addPreferredEducationLevels(position_id: number) {
    let temp_arr;
    if (this.preferred_education_levels && this.preferred_education_levels.length > 0) {
      if (this.position.preferred_education_levels && this.position.preferred_education_levels.length > 0) {
        temp_arr = this.preferred_education_levels.filter((local_value) => {
          return !(this.position.preferred_education_levels.some(value => {
            return value.level_id === local_value.level_id;
          }));
        });
      } else {
        temp_arr = this.preferred_education_levels;
      }
    }

    if (temp_arr && temp_arr.length > 0) {
      const info = {
        position_id: position_id,
        level_ids: temp_arr.map((value) => value.level_id)
      };
      this.positionService.postPreferredEducation(info).subscribe(
        dataJson => {
          this.addPreferredEducationMajors(position_id);
        },
        error => {
          this.alertsService.show(error.message, AlertType.error);
          this.addPreferredEducationMajors(position_id);
        }
      );
    } else {
      this.addPreferredEducationMajors(position_id);
    }
  }

  /**
   * Remove selected Education level from database.
   * @param position_id - position id
   * @param level_id - education level id
   * @param arrIndex - Index of array
   */
  removePreferredEducationLevel(position_id: number, level_id: number, arrIndex: number) {
    this.positionService.deletePreferredEducation(position_id, level_id).subscribe(
      dataJson => {
        this.position.preferred_education_levels.splice(arrIndex, 1);
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

  addPreferredEducationMajors(position_id: number) {
    let temp_arr;
    if (this.preferred_education_majors && this.preferred_education_majors.length > 0) {
      if (this.position.preferred_majors && this.position.preferred_majors.length > 0) {
        temp_arr = this.preferred_education_majors.filter((local_value) => {
          return !(this.position.preferred_majors.some(value => {
            return value.major_id === local_value.major_id;
          }));
        });
      } else {
        temp_arr = this.preferred_education_majors;
      }
    }

    if (temp_arr && temp_arr.length > 0) {
      const info = {
        position_id: position_id,
        major_ids: temp_arr.map((value) => value.major_id)
      };
      this.positionService.postPreferredMajors(info).subscribe(
        dataJson => {
          this.addPreferredEducationMajorCategories(position_id);
        },
        error => {
          this.alertsService.show(error.message, AlertType.error);
          this.addPreferredEducationMajorCategories(position_id);
        }
      );
    } else  {
      this.addPreferredEducationMajorCategories(position_id);
    }
  }

  removePreferredEducationMajor(position_id: number, major_id: number, arrIndex: number) {
    this.positionService.deletePreferredMajor(position_id, major_id).subscribe(
      dataJson => {
        this.position.preferred_majors.splice(arrIndex, 1);
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

  addPreferredEducationMajorCategories(position_id: number) {
    let temp_arr;
    if (this.preferred_education_major_categories && this.preferred_education_major_categories.length > 0) {
      if (this.position.preferred_major_categories && this.position.preferred_major_categories.length > 0) {
        temp_arr = this.preferred_education_major_categories.filter((local_value) => {
          return !(this.position.preferred_major_categories.some(value => {
            return value.cat_id === local_value.cat_id;
          }));
        });
      } else {
        temp_arr = this.preferred_education_major_categories;
      }
    }

    if (temp_arr && temp_arr.length > 0) {
      const info = {
        position_id: position_id,
        major_category_ids: temp_arr.map(value => value.cat_id)
      };
      this.positionService.postPreferredMajorCategories(info).subscribe(
        dataJson => {
          this.goToNextPage();
        },
        error => {
          this.alertsService.show(error.message, AlertType.error);
          this.goToNextPage();
        }
      );
    } else {
      this.goToNextPage();
    }
  }

  removePreferredEducationMajorCategory(position_id: number, category_id: number, arrIndex: number) {
    this.positionService.deletePreferredMajorCategory(position_id, category_id).subscribe(
      dataJson => {
        this.position.preferred_major_categories.splice(arrIndex, 1);
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

  /**
   * Add minimum skills in current position
   * @param position_id
   */
  addMinimumSkills(position_id: number) {
    let temp_arr;
    if (this.minimum_skills && this.minimum_skills.length > 0) {
      if (this.position.minimum_skills && this.position.minimum_skills.length > 0) {
        temp_arr = this.minimum_skills.filter((local_value) => {
          return !(this.position.minimum_skills.some(value => {
            return value.skill_id === local_value.skill_id;
          }));
        });
      } else {
        temp_arr = this.minimum_skills;
      }
    }

    if (temp_arr && temp_arr.length > 0) {
      const info = {
        position_id: position_id,
        skills: temp_arr
      };
      this.positionService.postMinimumSkills(info).subscribe(
        dataJson => {
          this.addPreferredSkills(position_id);
        },
        error => {
          this.alertsService.show(error.message, AlertType.error);
          this.addPreferredSkills(position_id);
        }
      );
    } else {
      this.addPreferredSkills(position_id);
    }
  }

  /**
   * Remove minimum skill from database
   * @param position_id
   * @param skill_id
   * @param arrIndex
   */
  removeMinimumSkill(position_id: number, skill_id: number, arrIndex: number) {
    this.positionService.deleteMinimumSkill(position_id, skill_id).subscribe(
      dataJson => {
        this.position.minimum_skills.splice(arrIndex, 1);
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

  /**
   * Update skill level from database
   * @param position_id
   * @param skill_id
   * @param skill_level
   * @param arrIndex
   */
  patchMimimumSkill(position_id: number, skill_id: number, skill_level: number, arrIndex: number) {
    const info = {
      position_id: position_id,
      skill_id: skill_id,
      skill_level: skill_level
    };
    this.positionService.patchMinimumSkill(info).subscribe(
      dataJson => {
        this.position.minimum_skills[arrIndex].skill_level = skill_level;
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

  addPreferredSkills(position_id: number) {
    let temp_arr;
    if (this.preferred_skills && this.preferred_skills.length > 0) {
      if (this.position.preferred_skills && this.position.preferred_skills.length > 0) {
        temp_arr = this.preferred_skills.filter((local_value) => {
          return !(this.position.preferred_skills.some(value => {
            return value.skill_id === local_value.skill_id;
          }));
        });
      } else {
        temp_arr = this.preferred_skills;
      }
    }

    if (temp_arr && temp_arr.length > 0) {
      const info = {
        position_id: position_id,
        skills: temp_arr
      };
      this.positionService.postPreferredSkills(info).subscribe(
        dataJson => {
          this.goToNextPage();
        },
        error => {
          this.alertsService.show(error.message, AlertType.error);
          this.goToNextPage();
        }
      );
    } else {
      this.goToNextPage();
    }
  }

  removePreferredSkill(position_id: number, skill_id: number, arrIndex: number) {
    this.positionService.deletePreferredSkill(position_id, skill_id).subscribe(
      dataJson => {
        this.position.preferred_skills.splice(arrIndex, 1);
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

  patchPreferredSkill(position_id: number, skill_id: number, skill_level: number, arrIndex) {
    const info = {
      position_id: position_id,
      skill_id: skill_id,
      skill_level: skill_level
    };
    this.positionService.patchPreferredSkill(info).subscribe(
      dataJson => {
        this.position.preferred_skills[arrIndex].skill_level = skill_level;
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

  /**
   * Add preferred Interests in current position
   * @param position_id
   */
  addPreferredInterests(position_id: number) {
    let temp_arr;
    if (this.preferred_interests && this.preferred_interests.length > 0) {
      if (this.position.preferred_interests && this.position.preferred_interests.length > 0) {
        temp_arr = this.preferred_interests.filter((local_value) => {
          return !(this.position.preferred_interests.some(value => {
            return value.interest_id === local_value.interest_id;
          }));
        });
      } else {
        temp_arr = this.preferred_interests;
      }
    }

    if (temp_arr && temp_arr.length > 0) {
      const info = {
        position_id: position_id,
        interest_ids: temp_arr.map(value => value.interest_id)
      };
      this.positionService.postPreferredInterests(info).subscribe(
        dataJson => {
          this.goToNextPage();
        },
        error => {
          this.alertsService.show(error.message, AlertType.error);
          this.goToNextPage();
        }
      );
    } else {
      this.goToNextPage();
    }
  }

  /**
   * Remove selected Interest from database
   * @param position_id
   * @param interest_id
   * @param arrIndex
   */
  removePreferredInterest(position_id: number, interest_id: number, arrIndex: number) {
    this.positionService.deletePreferredInterest(position_id, interest_id).subscribe(
      dataJson => {
        this.position.preferred_interests.splice(arrIndex, 1);
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

  /**
   * Add Preferred Schools in current position
   * @param position_id
   */
  addPreferredSchools(position_id: number) {
    let temp_arr;
    if (this.preferred_schools && this.preferred_schools.length > 0) {
      if (this.position.preferred_schools && this.position.preferred_schools.length > 0) {
        temp_arr = this.preferred_schools.filter((local_value) => {
          return !(this.position.preferred_schools.some(value => {
            return value.school_id === local_value.school_id;
          }));
        });
      } else {
        temp_arr = this.preferred_schools;
      }
    }

    if (temp_arr && temp_arr.length > 0) {
      const info = {
        position_id: position_id,
        school_ids: temp_arr.map(value => value.school_id)
      };
      this.positionService.postPreferredSchools(info).subscribe(
        dataJson => {
          this.goToNextPage();
        },
        error => {
          this.alertsService.show(error.message, AlertType.error);
          this.goToNextPage();
        }
      );
    } else {
      this.goToNextPage();
    }
  }

  removePreferredSchool(position_id: number, school_id: number, arrIndex: number) {
    this.positionService.deletePreferredSchool(position_id, school_id).subscribe(
      dataJson => {
        this.position.preferred_schools.splice(arrIndex, 1);
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

  addPreferredWorkExperiences(position_id: number) {
    if (this.preferred_work_experiences && this.preferred_work_experiences.length > 0 && this.preferred_work_experiences[0].industry_id && this.preferred_work_experiences[0].preferred_years) {
      this.addPreferredWorkExperience(position_id, 0);
    } else {
      this.goToNextPage();
    }
  }

  addPreferredWorkExperience(position_id: number, arrIndex: number) {
    // If experience already exists in database, update. otherwise add a new experience.
    if (this.preferred_work_experiences[arrIndex].preferred_exp_id) {
      const index = this.position.preferred_experience.findIndex(value => value.preferred_exp_id === this.preferred_work_experiences[arrIndex].preferred_exp_id);

      if (index !== -1) {
        let temp_arr;
        if (this.preferred_work_experiences[arrIndex].preferred_skills_trained && this.preferred_work_experiences[arrIndex].preferred_skills_trained.length > 0) {
          if (this.position.preferred_experience[index].preferred_skills_trained && this.position.preferred_experience[index].preferred_skills_trained.length > 0) {
            temp_arr = this.preferred_work_experiences[arrIndex].preferred_skills_trained.filter((local_value) => {
              return !(this.position.preferred_experience[index].preferred_skills_trained.some(value => {
                return value.skill_id === local_value.skill_id;
              }));
            });
          } else {
            temp_arr = this.preferred_work_experiences[arrIndex].preferred_skills_trained;
          }
        }
        console.log('___', temp_arr, this.preferred_work_experiences[arrIndex].preferred_skills_trained, this.position.preferred_experience[index].preferred_skills_trained);

        const info = {
          position_id: position_id,
          preferred_exp_id: this.preferred_work_experiences[arrIndex].preferred_exp_id,
          industry_id: this.preferred_work_experiences[arrIndex].industry_id,
          preferred_years: this.preferred_work_experiences[arrIndex].preferred_years,
          exp_desc:	this.preferred_work_experiences[arrIndex].exp_desc ? this.preferred_work_experiences[arrIndex].exp_desc : null
        };

        this.positionService.patchPreferredExperience(info).subscribe(
          dataJson => {
            if (temp_arr && temp_arr.length > 0) {
              const skills_trained_info = {
                preferred_exp_id: this.preferred_work_experiences[arrIndex].preferred_exp_id,
                skill_ids: temp_arr.map(value => value.skill_id)
              };
              this.positionService.postPreferredExperienceSkillsTrained(skills_trained_info).subscribe(
                data => {
                  this.position.preferred_experience[index].preferred_skills_trained = this.preferred_work_experiences[arrIndex].preferred_skills_trained.slice();
                  if (arrIndex < this.preferred_work_experiences.length - 1) {
                    this.addPreferredWorkExperience(position_id, arrIndex + 1);
                  } else {
                    this.goToNextPage();
                  }
                },
                error => {
                  this.alertsService.show(error.message, AlertType.error);
                }
              );
            } else {
              if (arrIndex < this.preferred_work_experiences.length - 1) {
                this.addPreferredWorkExperience(position_id, arrIndex + 1);
              } else {
                this.goToNextPage();
              }
            }
          },
          error => {
            this.alertsService.show(error.message, AlertType.error);
            if (arrIndex < this.preferred_work_experiences.length - 1) {
              this.addPreferredWorkExperience(position_id, arrIndex + 1);
            } else {
              this.goToNextPage();
            }
          }
        );
      } else {
        if (arrIndex < this.preferred_work_experiences.length - 1) {
          this.addPreferredWorkExperience(position_id, arrIndex + 1);
        } else {
          this.goToNextPage();
        }
      }
    } else {
      const info = {
        position_id: position_id,
        industry_id: this.preferred_work_experiences[arrIndex].industry_id,
        preferred_years: this.preferred_work_experiences[arrIndex].preferred_years,
        exp_desc:	this.preferred_work_experiences[arrIndex].exp_desc ? this.preferred_work_experiences[arrIndex].exp_desc : null
      };
      if (this.preferred_work_experiences[arrIndex].preferred_skills_trained && this.preferred_work_experiences[arrIndex].preferred_skills_trained.length > 0) {
        info['skills_trained_ids'] = this.preferred_work_experiences[arrIndex].preferred_skills_trained.map(value => value.skill_id);
        this.positionService.postFullPreferredExperience(info).subscribe(
          dataJson => {
            if (arrIndex < this.preferred_work_experiences.length - 1) {
              this.addPreferredWorkExperience(position_id, arrIndex + 1);
            } else {
              this.goToNextPage();
            }
          },
          error => {
            this.alertsService.show(error.message, AlertType.error);
            if (arrIndex < this.preferred_work_experiences.length - 1) {
              this.addPreferredWorkExperience(position_id, arrIndex + 1);
            } else {
              this.goToNextPage();
            }
          }
        );
      } else {
        this.positionService.postPreferredExperience(info).subscribe(
          dataJson => {
            if (arrIndex < this.preferred_work_experiences.length - 1) {
              this.addPreferredWorkExperience(position_id, arrIndex + 1);
            } else {
              this.goToNextPage();
            }
          },
          error => {
            this.alertsService.show(error.message, AlertType.error);
            if (arrIndex < this.preferred_work_experiences.length - 1) {
              this.addPreferredWorkExperience(position_id, arrIndex + 1);
            } else {
              this.goToNextPage();
            }
          }
        );
      }
    }
  }

  removePreferredWorkExperience(position_id: number, preferred_exp_id: number, arrIndex: number)  {
    this.positionService.deletePreferredExperience(position_id, preferred_exp_id).subscribe(
      dataJson => {
        this.position.preferred_experience.splice(arrIndex, 1);
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

  removePreferredWorkExperienceSkillTrained(preferred_exp_id: number, skill_id: number, exp_index: number, skill_index: number) {
    this.positionService.deletePreferredExperienceSkillTrained(preferred_exp_id, skill_id).subscribe(
      dataJson => {
        this.position.preferred_experience[exp_index].preferred_skills_trained.splice(skill_index, 1);
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

  updatePositionVectors(position_id: number) {
    this.scoreService.putPositionVectors(position_id).subscribe(
      dataJson => {
        this.router.navigate(['/positions']);
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
        this.router.navigate(['/positions']);
      }
    );
  }

  backToEdit() {
    this.selectedPageIndex = 0;
    this.isNavMenuOpened = false;
    this.initializeFormsByPageIndex();
  }

  onClickQuit() {
    this.openDialog('quit');
  }

  openSkillDescriptionDialog() {
    const dialogRef = this.dialog.open(SkillDescriptionPopupComponent, {
      data: { skillDesc : SkillLevelDescription},
      width:  '100vw',
      maxWidth: '880px',
      minWidth: '280px',
      panelClass: ['edit-dialog-container']
    });
  }

  openDialog(category: string) {
    // tslint:disable-next-line: no-use-before-declare
    const dialgoRef = this.dialog.open(CreatePositionDialogComponent, {
      data: {
        category: category
      },
      width: '100vw',
      maxWidth: '880px',
      minWidth: '280px',
      panelClass: ['edit-dialog-container']
    });
    dialgoRef.afterClosed().subscribe(result => {
      if (category === 'quit') {
        if (result && result.quit) {
          this.router.navigate(['/positions']);
        }
      } else if (category === 'skip') {
        if (result && result.skip) {
          this.goToPage(5);
        }
      }
    });
  }

}

@Component({
  selector: 'create-position-dialog',
  templateUrl: './create-position-dialog.component.html',
  styleUrls: ['./create-position-dialog.component.scss'],
})

export class CreatePositionDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<CreatePositionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  onClickQiut() {
    this.dialogRef.close({quit: true});
  }

  onClickSkip() {
    this.dialogRef.close({skip: true});
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
