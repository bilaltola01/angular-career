import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
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
  UserStateService,
  PositionService
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
  User,
  Major,
  Level,
  Levels,
  MajorCategory,
  Skill,
  Interest,
  School,
  Industry,
  UserSkillItem
} from 'src/app/models';

export interface PreferredWorkExperience {
  industry: Industry;
  years: number;
  description: string;
  skills_trained: Skill[];
}

export interface EditSkillItem {
  index: number;
  skillItem: UserSkillItem;
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
  autocomplete_education_levels: Level[] = [];
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
  position_city: City;
  position_state: State;
  position_country: number;
  position_salary: number;
  position_level: string;
  position_type: string;
  position_application_type: string;
  position_application_deadline: string;
  position_recruiter: User;

  preferred_education_levels: Level[];
  preferred_education_major: Major;
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

  constructor(
    private alertsService: AlertsService,
    public helperService: HelperService,
    public autoCompleteService: AutoCompleteService,
    private positionService: PositionService
  ) { }

  ngOnInit() {
    this.minDate.setDate(this.currentDate.getDate() + 1);
    this.isTabMenuOpen = false;
    this.isNavMenuOpened = false;
    this.selectedPageIndex = 0;
    this.initializeFormsByPageIndex();
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
    } else if (this.selectedPageIndex === 1 && !(this.positionBasicInfoForm.valid && this.onCheckCompanyValidation() && this.helperService.checkSpacesString(this.positionBasicInfoForm.value.position_company) && this.onCheckCityValidation() && this.onCheckStateValidation() && this.onCheckRecruiterValidation())) {
      return;
    } else if (this.selectedPageIndex === 2 && !(this.preferredEducationForm.valid && this.onCheckEducationMajorValidation())) {
      return;
    } else if (this.selectedPageIndex === 3 && !(this.preferredWorkExperienceFormArray.valid && this.onCheckAllIndustriesValidation())) {
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
      default:
        break;
    }
  }

  goToPage(index: number) {
    if (index > this.selectedPageIndex) {
      if (this.selectedPageIndex === 0 && !this.position_name) {
        this.alertsService.show('Please fill out the position\'s name.', AlertType.error);
        return;
      } else if (this.selectedPageIndex === 1 && !this.position_company) {
        this.alertsService.show('Please provide company information.', AlertType.error);
        return;
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

    this.positionBasicInfoForm = new FormGroup({
      position_company: new FormControl(this.position_company ? this.position_company.company_name : null, [Validators.required]),
      position_city: new FormControl(this.position_city ? this.helperService.cityNameFromAutoComplete(this.position_city.city) : null),
      position_state: new FormControl(this.position_state ? this.position_state.state : null),
      position_country: new FormControl(this.position_country ? Countries[this.position_country - 1] : null),
      position_salary: new FormControl(this.position_salary ? this.position_salary : null),
      position_level: new FormControl(this.position_level ? this.position_level : null, [Validators.required]),
      position_type: new FormControl(this.position_type ? this.position_type : null, [Validators.required]),
      position_application_type: new FormControl(this.position_application_type ? this.position_application_type : null),
      position_application_deadline: new FormControl(this.position_application_deadline ? this.helperService.convertStringToFormattedDateString(this.position_application_deadline, 'YYYY-MM-DD', 'L') : null),
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

  /**
   * Preferred Education Form
   */
  initPreferredEducationForm() {
    this.autocomplete_education_levels = [];
    this.autocomplete_majors = [];
    this.autocomplete_major_categories = [];

    this.preferredEducationForm = new FormGroup({
      search_eduaction_level: new FormControl(''),
      education_major: new FormControl(this.preferred_education_major ? this.preferred_education_major.major_name : ''),
      search_major_category: new FormControl('')
    });

    this.preferredEducationForm.get('search_eduaction_level').valueChanges.subscribe((search_eduaction_level) => {
      if (search_eduaction_level && this.helperService.checkSpacesString(search_eduaction_level)) {
       this.autocomplete_education_levels = this.education_levels.filter(value => value.education_level.includes(search_eduaction_level));
      } else {
        this.autocomplete_education_levels = [];
      }
    });

    this.preferredEducationForm.get('education_major').valueChanges.subscribe((education_major) => {
      if (education_major && this.helperService.checkSpacesString(education_major)) {
        this.autoCompleteService.autoComplete(education_major, 'majors').subscribe(
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

  onSelectEducationLevel(level: Level) {
    if (!this.preferred_education_levels) {
      this.preferred_education_levels = [level];
    } else {
      const filter = this.preferred_education_levels.filter(value => value.level_id === level.level_id);
      if (filter.length === 0) {
        this.preferred_education_levels.push(level);
      }
    }
    this.preferredEducationForm.patchValue({search_eduaction_level: ''});
  }

  onRemoveEducationLevel(level: Level, arrIndex: number) {
    if (this.preferred_education_levels[arrIndex].level_id === level.level_id) {
      this.preferred_education_levels.splice(arrIndex, 1);
    }
    if (this.preferred_education_levels.length === 0) {
      this.preferred_education_levels = null;
    }
  }

  onSelectEducationMajor(major: Major) {
    this.preferred_education_major = major;
  }

  onBlurEducationMajor() {
    const value = this.preferredEducationForm.value.education_major;
    if (value && this.helperService.checkSpacesString(value)) {
      if (this.preferred_education_major && value !== this.preferred_education_major.major_name) {
        this.preferred_education_major = null;
      }
    } else {
      this.preferred_education_major = null;
    }
  }

  onCheckEducationMajorValidation(): boolean {
    const value = this.preferredEducationForm.value.education_major;
    if (value && this.helperService.checkSpacesString(value)) {
      if (this.preferred_education_major) {
        return value === this.preferred_education_major.major_name ? true : false;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

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

  onRemoveEducationMajorCategory(major_category: MajorCategory, arrIndex: number) {
    if (this.preferred_education_major_categories[arrIndex].cat_id === major_category.cat_id) {
      this.preferred_education_major_categories.splice(arrIndex, 1);
    }
    if (this.preferred_education_major_categories.length === 0) {
      this.preferred_education_major_categories = null;
    }
  }

  /**
  * Preferred Work Experience Form
  */
  initPreferredWorkExperienceFormArray() {
    this.autocomplete_industries = [];
    this.autocomplete_skills_trained = [];

    this.preferredWorkExperienceFormArray = new FormArray([]);

    if (!this.preferred_work_experiences || this.preferred_work_experiences.length === 0) {
      this.preferred_work_experiences = [{
        industry: null,
        years: null,
        description: null,
        skills_trained: null
      }];
      this.addPreferredWorkExperienceFormGroup(null, 0);
    } else {
      this.preferred_work_experiences.forEach((experience, index) => {
        this.addPreferredWorkExperienceFormGroup(experience, index);
      });
    }
  }

  addPreferredWorkExperienceFormGroup(experience: PreferredWorkExperience, arrIndex: number) {
    this.autocomplete_industries.push([]);
    this.autocomplete_skills_trained.push([]);

    const experienceForm = new FormGroup({
      industry: new FormControl(experience && experience.industry ? experience.industry.industry_name : '', [Validators.required]),
      years: new FormControl(experience && experience.years ? experience.years : ''),
      description: new FormControl(experience && experience.description ? experience.description : ''),
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
        this.preferred_work_experiences[arrIndex].years = years ? parseInt(years, 10) : null;
      }
    );
    experienceForm.get('description').valueChanges.subscribe(
      (description) => {
        this.preferred_work_experiences[arrIndex].description = description ? this.helperService.checkSpacesString(description) : null;
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
    this.preferred_work_experiences[arrIndex].industry = industry;
  }

  onBlurIndustry(arrIndex: number) {
    const value = this.preferredWorkExperienceFormArray.value[arrIndex].industry;
    if (value && this.helperService.checkSpacesString(value)) {
      if (this.preferred_work_experiences[arrIndex].industry && value !== this.preferred_work_experiences[arrIndex].industry.industry_name) {
        this.preferred_work_experiences[arrIndex].industry = null;
      }
    } else {
      this.preferred_work_experiences[arrIndex].industry = null;
    }
  }

  onCheckIndustryValidation(arrIndex: number): boolean {
    const value = this.preferredWorkExperienceFormArray.value[arrIndex].industry;
    if (value && this.helperService.checkSpacesString(value)) {
      if (this.preferred_work_experiences[arrIndex].industry) {
        return value === this.preferred_work_experiences[arrIndex].industry.industry_name ? true : false;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  onExperienceYearSelect(date: any, index: number, datePicker: MatDatepicker<any>) {
    datePicker.close();
    this.preferredWorkExperienceFormArray.at(index).get('years').setValue(this.helperService.convertToFormattedString(date, 'YYYY'));
  }

  onSelectSkillsTrained(formIndex: number, skill: Skill) {
    if (!this.preferred_work_experiences[formIndex].skills_trained) {
      this.preferred_work_experiences[formIndex].skills_trained = [skill];
    } else {
      const filter = this.preferred_work_experiences[formIndex].skills_trained.filter(value => value.skill_id === skill.skill_id);
      if (filter.length === 0) {
        this.preferred_work_experiences[formIndex].skills_trained.push(skill);
      }
    }
    this.preferredWorkExperienceFormArray.at(formIndex).get('skills_trained').setValue('');
  }

  onRemoveSkillsTrained(formIndex: number, skill: Skill, arrIndex: number) {
    if (this.preferred_work_experiences[formIndex].skills_trained[arrIndex].skill_id === skill.skill_id) {
      this.preferred_work_experiences[formIndex].skills_trained.splice(arrIndex, 1);
    }
    if (this.preferred_work_experiences[formIndex].skills_trained.length === 0) {
      this.preferred_work_experiences[formIndex].skills_trained = null;
    }
  }

  onAddPreferredWorkExperienceFormGroup() {
    if (this.preferredWorkExperienceFormArray.valid && this.onCheckAllIndustriesValidation()) {
      this.preferred_work_experiences.push({
        industry: null,
        years: null,
        description: null,
        skills_trained: null
      });
      this.addPreferredWorkExperienceFormGroup(null, this.preferred_work_experiences.length - 1);
    }
  }

  onRemovePreferredWorkExperienceFormGroup(arrIndex: number) {
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
      const filter = this.minimum_skills.filter(value => value.skill_id === skill.skill_id);
      if (filter.length === 0) {
        this.minimum_skills.push(skillItemData);
        arrIndex = this.minimum_skills.length - 1;
      } else {
        arrIndex = this.minimum_skills.indexOf(filter[0]);
        skillItemData.skill_level = filter[0].skill_level;
      }
    }
    this.temp_minimum_skill = {
      index: arrIndex,
      skillItem: skillItemData
    };
    this.skillsForm.get('search_minimum_skill').setValue('');
  }

  onRemoveMinimumSkill(skill: Skill, arrIndex: number) {
    if (this.minimum_skills[arrIndex].skill_id === skill.skill_id) {
      this.minimum_skills.splice(arrIndex, 1);
    }
    if (this.minimum_skills.length === 0) {
      this.minimum_skills = null;
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
      const filter = this.preferred_skills.filter(value => value.skill_id === skill.skill_id);
      if (filter.length === 0) {
        this.preferred_skills.push(skillItemData);
        arrIndex = this.preferred_skills.length - 1;
      } else {
        arrIndex = this.preferred_skills.indexOf(filter[0]);
        skillItemData.skill_level = filter[0].skill_level;
      }
    }
    this.temp_preferred_skill = {
      index: arrIndex,
      skillItem: skillItemData
    };
    this.skillsForm.get('search_preferred_skill').setValue('');
  }

  onRemovePreferredSkill(skill: Skill, arrIndex: number) {
    if (this.preferred_skills[arrIndex].skill_id === skill.skill_id) {
      this.preferred_skills.splice(arrIndex, 1);
    }
    if (this.preferred_skills.length === 0) {
      this.preferred_skills = null;
    }
  }

  onLevelChanged(level: number, index: number, is_minimum_skill: boolean) {
    if (is_minimum_skill) {
      this.minimum_skills[index].skill_level = level;
    } else {
      this.preferred_skills[index].skill_level = level;
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

  onSelectPreferredInterest(interest: Interest) {
    if (!this.preferred_interests) {
      this.preferred_interests = [interest];
    } else {
      const filter = this.preferred_interests.filter(value => value.interest_id === interest.interest_id);
      if (filter.length === 0) {
        this.preferred_interests.push(interest);
      }
    }
    this.interestsForm.get('search_preferred_interest').setValue('');
  }

  onRemovePreferredInterest(interest: Interest, arrIndex: number) {
    if (this.preferred_interests[arrIndex].interest_id === interest.interest_id) {
      this.preferred_interests.splice(arrIndex, 1);
    }
    if (this.preferred_interests.length === 0) {
      this.preferred_interests = null;
    }
  }

  /**
   * School Restrictions Form
   */
  initSchoolRestrictionsForm() {
    this.autocomplete_preferred_schools = [];

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

  onSelectPreferredSchool(school: School) {
    if (!this.preferred_schools) {
      this.preferred_schools = [school];
    } else {
      const filter = this.preferred_schools.filter(value => value.school_id === school.school_id);
      if (filter.length === 0) {
        this.preferred_schools.push(school);
      }
    }
    this.schoolRestrictionsForm.get('search_preferred_school').setValue('');
  }

  onRemovePreferredSchool(school: School, arrIndex: number) {
    if (this.preferred_schools[arrIndex].school_id === school.school_id) {
      this.preferred_schools.splice(arrIndex, 1);
    }
    if (this.preferred_schools.length === 0) {
      this.preferred_schools = null;
    }
  }

  onClickPublish() {
    if (!this.position) {
      const position: PositionInfoRequest = {
        position:	this.position_name,
        company_id:	this.position_company.company_id,
        level: this.position_level ? this.position_level : null,
        type:	this.position_type ? this.position_type : null,
        position_desc: this.position_desc,
        start_date:	null,
        end_date:	null,
        position_filled: null,
        pay: this.position_salary ? this.position_salary : null,
        negotiable:	null,
        repeat_post: null,
        repeat_date: null,
        cover_letter_req:	null,
        recruiter_id:	this.position_recruiter ? this.position_recruiter.user_id : null,
        department:	null,
        open:	null,
        openings:	null,
        application_deadline:	this.position_application_deadline ? this.position_application_deadline : null
      };

      this.positionService.postPosition(position).subscribe(
        dataJson => {
          this.position = dataJson['data'];
          const position_id = this.position.position_id;

          if (this.position && this.position.position_id) {
            if (this.preferred_education_levels && this.preferred_education_levels.length > 0) {
              this.addPreferredEducationLevels(position_id);
            }
            if (this.preferred_education_major) {
              this.addPreferredEducationMajor(position_id);
            }
            if (this.preferred_education_major_categories && this.preferred_education_major_categories.length > 0) {
              this.addPreferredEducationMajorCategories(position_id);
            }
            if (this.preferred_work_experiences && this.preferred_work_experiences.length > 0) {
              this.addPreferredWorkExperience(position_id);
            }
            if (this.minimum_skills && this.minimum_skills.length > 0) {
              this.addMinimumSkills(position_id);
            }
            if (this.preferred_skills && this.preferred_skills.length > 0) {
              this.addPreferredSkills(position_id);
            }
            if (this.preferred_interests && this.preferred_interests.length > 0) {
              this.addPreferredInterests(position_id);
            }
            if (this.preferred_schools && this.preferred_schools.length > 0) {
              this.addPreferredSchools(position_id);
            }
            if (this.position_city || this.position_state || this.position_country) {
              this.addLocation(position_id);
            }
          }
        },
        error => {
          this.alertsService.show(error.message, AlertType.error);
        }
      );
    }
  }

  addPreferredEducationLevels(position_id: number) {
    const info = {
      position_id: position_id,
      level_ids: this.preferred_education_levels.map((value) => value.level_id)
    };
    this.positionService.postPreferredEducation(info).subscribe(
      dataJson => {
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

  addPreferredEducationMajor(position_id: number) {
    const info = {
      position_id: position_id,
      major_ids: [this.preferred_education_major.major_id]
    };
    this.positionService.postPreferredMajors(info).subscribe(
      dataJson => {
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

  addPreferredEducationMajorCategories(position_id: number) {
    const info = {
      position_id: position_id,
      major_category_ids: this.preferred_education_major_categories.map(value => value.cat_id)
    };
    this.positionService.postPreferredMajorCategories(info).subscribe(
      dataJson => {
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

  addPreferredWorkExperience(position_id: number) {
    this.preferred_work_experiences.forEach(experience => {
      const info = {
        position_id: position_id,
        industry_id: experience.industry.industry_id,
        preferred_years: experience.years,
        exp_desc:	experience.description ? experience.description : null,
        skills_trained_ids: experience.skills_trained && experience.skills_trained.length > 0 ? experience.skills_trained.map(value => value.skill_id) : null
      };
      this.positionService.postPreferredExperience(info).subscribe(
        dataJson => {
        },
        error => {
          this.alertsService.show(error.message, AlertType.error);
        }
      );
    });
  }

  addMinimumSkills(position_id: number) {
    const info = {
      position_id: position_id,
      skills: this.minimum_skills
    };
    this.positionService.postMinimumSkills(info).subscribe(
      dataJson => {
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

  addPreferredSkills(position_id: number) {
    const info = {
      position_id: position_id,
      skills: this.preferred_skills
    };
    this.positionService.postPreferredSkills(info).subscribe(
      dataJson => {
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

  addPreferredInterests(position_id: number) {
    const info = {
      position_id: position_id,
      interest_ids: this.preferred_interests.map(value => value.interest_id)
    };
    this.positionService.postPreferredInterests(info).subscribe(
      dataJson => {
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

  addPreferredSchools(position_id: number) {
    const info = {
      position_id: position_id,
      school_ids: this.preferred_schools.map(value => value.school_id)
    };
    this.positionService.postPreferredSchools(info).subscribe(
      dataJson => {
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

  addLocation(position_id: number) {
    const info = {
      position_id: position_id,
      city_id: this.position_city ? this.position_city.city_id : null,
      state_id:	this.position_state ? this.position_state.state_id : null,
      country_id:	this.position_country ? this.position_country : null
    };
    this.positionService.postLocation(info).subscribe(
      dataJson => {
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

  backToEdit() {
    this.selectedPageIndex = 0;
    this.isNavMenuOpened = false;
    this.initializeFormsByPageIndex();
  }

}
