import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  AlertsService, AlertType,
  AutoCompleteService,
  UserService
} from '../../../services';

import {
  State,
  City,
  Skill,
  EducationLevel,
  School,
  Major,
  User,
  peopleListLimit
} from 'src/app/models';

@Component({
  selector: 'app-people-search',
  templateUrl: './people-search.component.html',
  styleUrls: ['./people-search.component.scss']
})
export class PeopleSearchComponent implements OnInit {
  // Constants
  breakpoint: number;
  educationLevel: string[] = EducationLevel;
  // FormGroup
  peopleForm: FormGroup;
  // Autocomplete list
  autocomplete_states: State[] = [];
  autocomplete_cities: City[] = [];
  autocomplete_skills: Skill[] = [];
  autocomplete_school: School[][] = [];
  autocomplete_searchpeoples: User[] = [];
  autocomplete_education_major: Major[][] = [];
  userSkillsList = [];
  filterAttributes = {
    state_id: null,
    city_id: null,
    major_id: null,
    school_id: null,
    offset: 0,
    limit: peopleListLimit
  };
  isPeopleLoading = true;
  selectedAllFlag = false;
  mathFloor = Math.floor;
  filter_list: boolean;
  currentPageNumber = 1;
  paginationArr = [];
  preLoadDataObject = {};

  constructor(
    private autoCompleteService: AutoCompleteService,
    private alertsService: AlertsService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.initPeopleFilterForm();
    this.breakpoint = (window.innerWidth <= 500) ? 2 : 4;
  }

  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 500) ? 2 : 4;
  }

  toggleTabMenuOpen() {
    this.filter_list = !this.filter_list;
  }

  initPeopleFilterForm() {
    this.peopleForm = new FormGroup({
      'searchPeople': new FormControl(null),
      'state': new FormControl(null),
      'city': new FormControl(null),
      'skill': new FormControl(null),
      'education': new FormControl(null),
      'school': new FormControl(null),
      'major': new FormControl(null)
    });
    this.peopleForm.get('searchPeople').valueChanges.subscribe((searchPeople) => {
      searchPeople ? this.onSearchPeopleValueChanges(searchPeople) : this.autocomplete_searchpeoples = [];
    });
    this.peopleForm.get('state').valueChanges.subscribe((state) => {
      state ? this.onStateValueChanges(state) : this.autocomplete_states = [];
    });
    this.peopleForm.get('city').valueChanges.subscribe((city) => {
      city ? this.onCityValueChanges(city) : this.autocomplete_cities = [];
    });
    this.peopleForm.get('skill').valueChanges.subscribe(
      (skill) => {
        skill ? this.onSkillValueChanges(skill) : this.autocomplete_skills = [];
      }
    );
    this.peopleForm.get('school').valueChanges.subscribe((school) => {
      school ? this.onSchoolValueChanges(school) : this.autocomplete_school = [];
    });
    this.peopleForm.get('major').valueChanges.subscribe((major) => {
      major ? this.onMajorValueChanges(major) : this.autocomplete_education_major = [];
    });

  }

  onChangeCity(city: City) {
    this.filterAttributes['city_id'] = city.city_id;
  }

  onChangeState(state: State) {
    this.filterAttributes['state_id'] = state.state_id;
  }

  onChangeMajor(major: Major) {
    this.filterAttributes['major_id'] = major.major_id;
  }

  onChangeSchool(school: School) {
    this.filterAttributes['school_id'] = school.school_id;
  }
  onStateValueChanges(state: string) {
    this.autoCompleteService.autoComplete(state, 'states').subscribe(
      dataJson => {
        if (dataJson['success']) {
          this.autocomplete_states = dataJson['data'];
        }
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
        this.autocomplete_states = [];
      }
    );
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
  onMajorValueChanges(major: string) {
    this.autoCompleteService.autoComplete(major, 'majors').subscribe(
      dataJson => {
        if (dataJson['success']) {
          this.autocomplete_education_major = dataJson['data'];
        }
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
        this.autocomplete_education_major = [];
      }
    );
  }
  onSkillValueChanges(skill: string) {
    this.autoCompleteService.autoComplete(skill, 'skills').subscribe(
      dataJson => {
        if (dataJson['success']) {
          this.autocomplete_skills = dataJson['data'];
        }
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
        this.autocomplete_skills = [];
      }
    );
  }
  onSchoolValueChanges(school: string) {
    this.autoCompleteService.autoComplete(school, 'schools').subscribe(
      dataJson => {
        if (dataJson['success']) {
          this.autocomplete_school = dataJson['data'];
        }
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
        this.autocomplete_school = [];
      }
    );
  }
  onSearchPeopleValueChanges(searchPeople: string) {
    if (!searchPeople.includes('@')) {
      this.autoCompleteService.autoComplete(searchPeople, 'users').subscribe(
        dataJson => {
          if (dataJson['success']) {
            this.autocomplete_searchpeoples = dataJson['data'];
          }
        },
        error => {
          this.alertsService.show(error.message, AlertType.error);
          this.autocomplete_searchpeoples = [];
        }
      );
    } else {
      this.autocomplete_searchpeoples = [];
    }
  }

  addSkills(skillItem: Skill) {
    this.peopleForm.patchValue({ skill: '' });
    if (this.userSkillsList.findIndex(skill => skillItem.skill_id === skill.skill_id) === -1) {
      this.userSkillsList.push(skillItem);
    }
  }

  removeUserSkillsData(index: number) {
    this.userSkillsList.splice(index, 1);
  }

  generateQueryString(): string {
    let queryString;
    queryString = this.peopleForm.value.state ? `${queryString ? queryString + '&' : ''}state=${this.filterAttributes.state_id}` : queryString;
    queryString = this.peopleForm.value.city ? `${queryString ? queryString + '&' : ''}city=${this.filterAttributes.city_id}` : queryString;
    queryString = this.peopleForm.value.education ? `${queryString ? queryString + '&' : ''}education=${parseInt(this.peopleForm.value.education, 10) + 1}` : queryString;
    queryString = this.peopleForm.value.major ? `${queryString ? queryString + '&' : ''}major=${this.filterAttributes.major_id}` : queryString;
    queryString = queryString ? `${queryString}&offset=${this.filterAttributes.offset}` : `offset=${this.filterAttributes.offset}`;
    queryString = queryString ? `${queryString}&limit=${this.filterAttributes.limit}` : `offset=${this.filterAttributes.limit}`;
    this.userSkillsList.forEach(skill => {
      queryString = queryString ? queryString + `&skills=${skill.skill_id}` : `skills=${skill.skill_id}`;
    });
    queryString = this.peopleForm.value.searchPeople ? `${queryString ? queryString + '&' : ''}position=${this.peopleForm.value.searchPeople}` : queryString;
    return queryString;
  }

  setPaginationValues(dataJson) {
    let max;
    let min;
    if (this.currentPageNumber >= 5) {
      max = Math.ceil(dataJson.data.count / peopleListLimit) <= 6 ? Math.ceil(dataJson.data.count / peopleListLimit) + this.currentPageNumber - 1 : this.currentPageNumber + 6;
      min = max > 10 ? max - 9 : 1;
    } else {
      max = Math.ceil((dataJson.data.count + this.filterAttributes.offset) / peopleListLimit) < 10 ? Math.ceil((dataJson.data.count + this.filterAttributes.offset) / peopleListLimit) : 10;
      min = 1;
    }

    this.paginationArr = Array(max - min + 1).fill(0).map((x, i) => i + min);
  }

  clearFilter() {
    const setSearchPeopleValue = this.peopleForm.value.searchPeople;
    this.peopleForm.reset();
    this.userSkillsList = [];
    this.preLoadDataObject = {};
    this.peopleForm.patchValue({ 'searchPeople': setSearchPeopleValue });
    this.toggleTabMenuOpen();
  }

  selectAll(isChecked) {
    this.selectedAllFlag = isChecked;
  }

  onSearchUser(event) {
    this.filterAttributes.offset = 0;
    this.preLoadDataObject = {};
    // this.getUsersData();
    event.stopPropagation();
  }

  applyFilter() {
    this.filterAttributes.offset = 0;
    this.toggleTabMenuOpen();
    this.preLoadDataObject = {};
  }


}
