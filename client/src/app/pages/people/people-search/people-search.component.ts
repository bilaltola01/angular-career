import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  AlertsService, AlertType,
  AutoCompleteService,
  UserService,
  HelperService,
  UserStateService
} from '../../../services';

import {
  State,
  City,
  Skill,
  EducationLevel,
  School,
  Major,
  User,
  peopleListLimit,
  UserGeneralInfo,
  UserSkillItem,
  UserEducationItem,
  ITEMS_LIMIT
} from 'src/app/models';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { trigger, style, animate, transition, query, stagger } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { uniqBy, orderBy } from 'lodash';

export interface PeopleData {
  general_info: UserGeneralInfo;
  contact_status: string;
}

export enum ContactStatus {
  none = 'none',
  pending = 'pending',
  added = 'added'
}

@Component({
  selector: 'app-people-search',
  templateUrl: './people-search.component.html',
  styleUrls: ['./people-search.component.scss'],
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({ transform: 'translateY(-100%)', opacity: 0 }),
          animate('250ms', style({ transform: 'translateY(0)', opacity: 1 }))
        ]),
        transition(':leave', [
          style({ transform: 'translateY(0)', opacity: 1 }),
          animate('250ms', style({ transform: 'translateY(-100%)', opacity: 0 }))
        ])
      ]
    ),
    trigger('listStaggerAnimation', [
      transition('* <=> *', [
        query(
          ':enter', [ style({ opacity: 0, transform: 'translateY(-15px)' }),
            stagger(
              '50ms',
              animate(
                '350ms ease-out',
                style({ opacity: 1, transform: 'translateY(0px)' })
              )
            )],
          { optional: true }
        ),
        query(':leave', animate('50ms', style({ opacity: 0 })), {
          optional: true
        })
      ])
    ])
  ],
})
export class PeopleSearchComponent implements OnInit {
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
  isPeopleLoading = false;
  selectedAllFlag = false;
  mathFloor = Math.floor;
  showFilterListFlag = true;
  currentPageNumber = 1;
  paginationArr = [];
  preLoadDataObject = {};

  userList: PeopleData[];

  displayItemsLimit = 7;
  current_user: UserGeneralInfo;
  searchPlaceholderCopy = 'Search people by name or email.';
  emptyResultsCopy = 'Use the search and filter to find peers.';

  constructor(
    private autoCompleteService: AutoCompleteService,
    private alertsService: AlertsService,
    private userService: UserService,
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
    this.initPeopleFilterForm(); // TODO: Add the query params here
    this.isHandset$.subscribe(handsetFlag => {
      if (handsetFlag) {
        this.searchPlaceholderCopy = 'Search by name or email.';
      } else {
        this.searchPlaceholderCopy = 'Search people by name or email.';
      }
    });

    // Initial search
    this.applyFilter();
  }

  toggleTabMenuOpen() {
    this.isHandset$.subscribe(handsetFlag => {
      if (handsetFlag) {
        this.showFilterListFlag = !this.showFilterListFlag;
      } else {
        this.showFilterListFlag = true;
      }
    });
  }

  getCurrentUser() {
    this.userStateService.getUser
      .subscribe(user => {
        this.current_user = user;
      }, error => {
        this.alertsService.show(error.message, AlertType.error);
      });
  }

  initPeopleFilterForm() {
    const querySearchedName = this.route.snapshot.queryParamMap.get('name') || null;
    const querySearchedState = this.route.snapshot.queryParamMap.get('state') || null;
    const querySearchedCity = this.route.snapshot.queryParamMap.get('city') || null;
    const querySearchedSkill = this.route.snapshot.queryParamMap.get('skill') || null;
    const querySearchedEducation = this.route.snapshot.queryParamMap.get('education') || null;
    const querySearchedSchool = this.route.snapshot.queryParamMap.get('school') || null;
    const querySearchedMajor = this.route.snapshot.queryParamMap.get('major') || null;

    this.peopleForm = new FormGroup({
      'searchPeople': new FormControl(querySearchedName),
      'state': new FormControl(null),
      'city': new FormControl(null),
      'skill': new FormControl(null),
      'education': new FormControl(null),
      'school': new FormControl(null),
      'major': new FormControl(null)
    });


    this.peopleForm.get('searchPeople').valueChanges.subscribe((searchPeople) => {
      searchPeople && this.helperService.checkSpacesString(searchPeople) ? this.onSearchPeopleValueChanges(searchPeople) : this.autocomplete_searchpeoples = [];
    });
    this.peopleForm.get('state').valueChanges.subscribe((state) => {
      state && this.helperService.checkSpacesString(state) ? this.onStateValueChanges(state) : this.autocomplete_states = [];
    });
    this.peopleForm.get('city').valueChanges.subscribe((city) => {
      city && this.helperService.checkSpacesString(city) ? this.onCityValueChanges(city) : this.autocomplete_cities = [];
    });
    this.peopleForm.get('skill').valueChanges.subscribe(
      (skill) => {
        skill && this.helperService.checkSpacesString(skill) ? this.onSkillValueChanges(skill) : this.autocomplete_skills = [];
      }
    );
    this.peopleForm.get('school').valueChanges.subscribe((school) => {
      school && this.helperService.checkSpacesString(school) ? this.onSchoolValueChanges(school) : this.autocomplete_school = [];
    });
    this.peopleForm.get('major').valueChanges.subscribe((major) => {
      major && this.helperService.checkSpacesString(major) ? this.onMajorValueChanges(major) : this.autocomplete_education_major = [];
    });

    // TODO: Call onChangeCity somehow
    // this.peopleForm.patchValue({
    //   state: querySearchedState,
    //   city: querySearchedCity,
    //   education: querySearchedEducation,
    //   school: querySearchedSchool,
    //   major: querySearchedMajor,
    // });

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
    queryString = this.peopleForm.value.school ? `${queryString ? queryString + '&' : ''}school=${this.filterAttributes.school_id}` : queryString;
    queryString = this.peopleForm.value.major ? `${queryString ? queryString + '&' : ''}major=${this.filterAttributes.major_id}` : queryString;
    queryString = queryString ? `${queryString}&offset=${this.filterAttributes.offset}` : `offset=${this.filterAttributes.offset}`;
    queryString = queryString ? `${queryString}&limit=${this.filterAttributes.limit}` : `limit=${this.filterAttributes.limit}`;
    this.userSkillsList.forEach(skill => {
      queryString = queryString ? queryString + `&skills=${skill.skill_id}` : `skills=${skill.skill_id}`;
    });
    const people = this.peopleForm.value.searchPeople && this.helperService.checkSpacesString(this.peopleForm.value.searchPeople) ? this.peopleForm.value.searchPeople.replace('+', '%2B') : null;
    queryString = people ? `${queryString ? queryString + '&' : ''}name=${people}` : queryString;

    // TODO: Skill
    // const querySearchedSkill = this.route.snapshot.queryParamMap.get('skill') || null;
    const paramsInQuery = {
      'name': people,
      'state': this.peopleForm.value.state,
      'city': this.peopleForm.value.city,
      'education': this.peopleForm.value.education,
      'major': this.peopleForm.value.major,
      'school': this.peopleForm.value.school,
    };

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: paramsInQuery,
      queryParamsHandling: 'merge',
    });

    return queryString;
  }

  getUsersData() {
    if (this.preLoadDataObject[this.currentPageNumber]) {
      this.userList = this.preLoadDataObject[this.currentPageNumber].data;
      this.setPaginationValues(this.preLoadDataObject[this.currentPageNumber]);
      if (this.currentPageNumber < this.paginationArr[this.paginationArr.length - 1]) {
        this.preLoadNextPage(this.currentPageNumber + 1);
      }
    } else {
      this.isPeopleLoading = true;
      const queryString = this.generateQueryString();
      this.userService.getUsers(queryString).subscribe(
        dataJson => {
          this.isPeopleLoading = false;
          if (dataJson['success'] && dataJson.data.data) {
            this.userList = [];
            dataJson.data.data.forEach((data) => {
              const peopleData: PeopleData = {
                general_info: data,
                contact_status: null
              };
              this.userList.push(peopleData);
            });
            const prelaodData = {
              data: this.userList,
              count: dataJson.data.count
            };
            this.setPaginationValues(prelaodData);
            this.preLoadDataObject[this.currentPageNumber] = prelaodData;
            this.getUsersInfo(this.currentPageNumber);
            if (this.currentPageNumber < this.paginationArr[this.paginationArr.length - 1]) {
              this.preLoadNextPage(this.currentPageNumber + 1);
            }
          }
        },
        error => {
          this.isPeopleLoading = false;
          this.alertsService.show(error.message, AlertType.error);
          this.userList = [];
        }
      );
    }
  }

  getUsersInfo(pageNo: number) {
    this.preLoadDataObject[pageNo].data.forEach((data, arrIndex) => {
      this.checkContactStatus(arrIndex, pageNo); // TODO: Should be in the combined get request.
    });
  }

  checkContactStatus(arrIndex: number, pageNo: number) {
    if (this.current_user.user_id !== this.preLoadDataObject[pageNo].data[arrIndex].general_info.user_id) {
      this.userService.getUserContactById(this.preLoadDataObject[pageNo].data[arrIndex].general_info.user_id).subscribe(
        dataJson => {
          if (dataJson['data']) {
            this.preLoadDataObject[pageNo].data[arrIndex].contact_status = ContactStatus.added;
            if (pageNo === this.currentPageNumber) {
              this.userList[arrIndex].contact_status = this.preLoadDataObject[pageNo].data[arrIndex].contact_status;
            }
          }
        },
        error => {
          if (error.message === 'No user contact found with given parameters.') {
            this.checkOutgoingRequest(arrIndex, pageNo);
          } else {
            this.alertsService.show(error.message, AlertType.error);
          }
        }
      );
    }
  }

  checkOutgoingRequest(arrIndex: number, pageNo: number) {
    this.userService.getOutgoingContactRequestById(this.preLoadDataObject[pageNo].data[arrIndex].general_info.user_id).subscribe(
      dataJson => {
        if (dataJson['data']) {
          this.preLoadDataObject[pageNo].data[arrIndex].contact_status = ContactStatus.pending;
          if (pageNo === this.currentPageNumber) {
            this.userList[arrIndex].contact_status = this.preLoadDataObject[pageNo].data[arrIndex].contact_status;
          }
        }
      },
      error => {
        if (error.message === 'No outgoing request found.') {
          this.preLoadDataObject[pageNo].data[arrIndex].contact_status = ContactStatus.none;
          if (pageNo === this.currentPageNumber) {
            this.userList[arrIndex].contact_status = this.preLoadDataObject[pageNo].data[arrIndex].contact_status;
          }
        } else {
          this.alertsService.show(error.message, AlertType.error);
        }
      }
    );
  }

  setPaginationValues(data) {
    let max;
    let min;
    if (this.currentPageNumber >= 5) {
      max = Math.ceil(data.count / peopleListLimit) <= 6 ? Math.ceil(data.count / peopleListLimit) + this.currentPageNumber - 1 : this.currentPageNumber + 6;
      min = max > 10 ? max - 9 : 1;
    } else {
      max = Math.ceil((data.count + this.filterAttributes.offset) / peopleListLimit) < 10 ? Math.ceil((data.count + this.filterAttributes.offset) / peopleListLimit) : 10;
      min = 1;
    }

    this.paginationArr = Array(max - min + 1).fill(0).map((x, i) => i + min);
  }

  pageClicked(pageNo) {
    document.getElementById('sidenav-content').scrollTo(0, 0);
    if (pageNo > 0 && pageNo <= this.paginationArr[this.paginationArr.length - 1]) {
      this.currentPageNumber = pageNo;
      this.filterAttributes.offset = ((this.currentPageNumber - 1) * peopleListLimit);
      this.getUsersData();
    }
  }

  preLoadNextPage(nextPageNumber) {
    if (!this.preLoadDataObject[nextPageNumber]) {
      const previousOffset = this.filterAttributes.offset;
      this.filterAttributes.offset = this.filterAttributes.offset + peopleListLimit;
      const queryString = this.generateQueryString();
      this.userService.getUsers(queryString).subscribe(
        dataJson => {
          if (dataJson['success'] && dataJson) {
            const userList = [];
            dataJson.data.data.forEach((data) => {
              const peopleData: PeopleData = {
                general_info: data,
                contact_status: null
              };
              userList.push(peopleData);
            });
            const prelaodData = {
              data: userList,
              count: dataJson.data.count
            };
            this.preLoadDataObject[nextPageNumber] = prelaodData;
            this.getUsersInfo(nextPageNumber);
          }
          this.filterAttributes.offset = previousOffset;
        },
        error => {
          this.userList = [];
        }
      );
    }
  }

  clearFilter() {
    const setSearchPeopleValue = this.peopleForm.value.searchPeople;
    this.peopleForm.reset();
    this.userSkillsList = [];
    this.preLoadDataObject = {};
    this.peopleForm.patchValue({ 'searchPeople': setSearchPeopleValue });
    this.toggleTabMenuOpen();
  }

  onSearchUser(event) {
    this.emptyResultsCopy = 'No search results found.';
    this.filterAttributes.offset = 0;
    this.currentPageNumber = 1;
    this.preLoadDataObject = {};
    this.getUsersData();
    event.stopPropagation();
  }

  applyFilter() {
    this.emptyResultsCopy = 'No search results found.';
    this.filterAttributes.offset = 0;
    this.currentPageNumber = 1;
    this.toggleTabMenuOpen();
    this.preLoadDataObject = {};
    this.getUsersData();
  }

  contactBtnTitle(contact_status: string): string {
    if (contact_status === 'none') {
      return 'Add Contact';
    } else if (contact_status === 'pending') {
      return 'Cancel Request';
    } else if (contact_status === 'added') {
      return 'In Contacts';
    } else {
      return 'Self';
    }
  }

  onClickContactBtn( contacteeUser ) {
    if ( contacteeUser.contact_status === ContactStatus.none) {
      // Send a Contact Request
      this.userService.postOutgoingContactRequest(contacteeUser.general_info.user_id).subscribe(
        dataJson => {
          if (dataJson['data']) {
            contacteeUser.contact_status = ContactStatus.pending;
            this.alertsService.show(`Contact request succesfully sent to ${contacteeUser.general_info.first_name} ${contacteeUser.general_info.last_name}.`, AlertType.success);
          }
        },
        error => {
          this.alertsService.show(error.message, AlertType.error);
        }
      );
    } else if ( contacteeUser.contact_status === ContactStatus.pending) {
      // Remove previously sent Contact Request
      this.userService.deleteOutgoingContactRequest(contacteeUser.general_info.user_id).subscribe(
        dataJson => {
          if (dataJson['data']) {
            contacteeUser.contact_status = ContactStatus.none;
            this.alertsService.show(`Contact request succesfully retracted from ${contacteeUser.general_info.first_name} ${contacteeUser.general_info.last_name}.`, AlertType.success);
          }
        },
        error => {
          this.alertsService.show(error.message, AlertType.error);
        }
      );
    } else {
      // No Action: Contact already In Contacts
      return;
    }
  }

}
