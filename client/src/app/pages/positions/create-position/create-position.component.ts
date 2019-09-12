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
  User,
  Major,
  Level,
  Levels,
  MajorCategory,
  Skill,
  Interest
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
  maxDate = new Date();
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
  preferredWorkExperienceForm: FormGroup;
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
  preferred_education_majors: Major[];
  preferred_education_major_categories: MajorCategory[];

  minimum_skills: Skill[];
  preferred_skills: Skill[];
  preferred_interests: Interest[];

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
      case 2:
        this.initPreferredEducationForm();
        break;
      case 3:
        this.initPreferredWorkExperienceForm();
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
      case 2:
        this.initPreferredEducationForm();
        break;
      case 3:
        this.initPreferredWorkExperienceForm();
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

  /**
   * Preferred Education Form
   */
  initPreferredEducationForm() {
    this.autocomplete_education_levels = [];
    this.autocomplete_majors = [];
    this.autocomplete_major_categories = [];

    this.preferredEducationForm = new FormGroup({
      search_eduaction_level: new FormControl(''),
      search_education_major: new FormControl(''),
      search_major_category: new FormControl('')
    });

    this.preferredEducationForm.get('search_eduaction_level').valueChanges.subscribe((search_eduaction_level) => {
      if (search_eduaction_level && this.helperService.checkSpacesString(search_eduaction_level)) {
       this.autocomplete_education_levels = this.education_levels.filter(value => value.education_level.includes(search_eduaction_level));
      } else {
        this.autocomplete_education_levels = [];
      }
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

  onSelectEducationLevel(level: Level) {
    if (!this.preferred_education_levels) {
      this.preferred_education_levels = [level];
    } else {
      const filter = this.preferred_education_levels.filter(value => value.level_id = level.level_id);
      if (filter.length === 0) {
        this.preferred_education_levels.push(level);
      }
    }
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
    if (!this.preferred_education_majors) {
      this.preferred_education_majors = [major];
    } else {
      const filter = this.preferred_education_majors.filter(value => value.major_id === major.major_id);
      if (filter.length === 0) {
        this.preferred_education_majors.push(major);
      }
    }
  }

  onRemoveEducationMajor(major: Major, arrIndex: number) {
    if (this.preferred_education_majors[arrIndex].major_id === major.major_id) {
      this.preferred_education_majors.splice(arrIndex, 1);
    }
    if (this.preferred_education_majors.length === 0) {
      this.preferred_education_majors = null;
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
  initPreferredWorkExperienceForm() {
    
  }

  /**
   * Skills Form
   */
  initSkillsForm() {
    this.autocomplete_minimum_skills = [];
    this.autocomplete_preferred_skills = [];

    this.skillsForm = new FormGroup({
      search_minimum_skill: new FormControl(''),
      search_preferred_skill: new FormControl('')
    });

    this.preferredEducationForm.get('search_minimum_skill').valueChanges.subscribe((search_minimum_skill) => {
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

    this.preferredEducationForm.get('search_preferred_skill').valueChanges.subscribe((search_preferred_skill) => {
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
    if (!this.minimum_skills) {
      this.minimum_skills = [skill];
    } else {
      const filter = this.minimum_skills.filter(value => value.skill_id === skill.skill_id);
      if (filter.length === 0) {
        this.minimum_skills.push(skill);
      }
    }
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
    if (!this.preferred_skills) {
      this.preferred_skills = [skill];
    } else {
      const filter = this.preferred_skills.filter(value => value.skill_id === skill.skill_id);
      if (filter.length === 0) {
        this.preferred_skills.push(skill);
      }
    }
  }

  onRemovePreferredSkill(skill: Skill, arrIndex: number) {
    if (this.preferred_skills[arrIndex].skill_id === skill.skill_id) {
      this.preferred_skills.splice(arrIndex, 1);
    }
    if (this.preferred_skills.length === 0) {
      this.preferred_skills = null;
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

    this.preferredEducationForm.get('search_preferred_interest').valueChanges.subscribe((search_preferred_interest) => {
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

  }

}
