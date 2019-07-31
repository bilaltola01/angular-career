import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import {MatDatepicker} from '@angular/material/datepicker';
import {
  AutoCompleteService,
  UserService,
  AlertsService,
  AlertType,
  HelperService
} from 'src/app/services';

import {
  City, School, Major, Skill, Interest, Level, Company,
  UserGeneralInfo, UserObject,
  UserEducationItem, UserEducationItemData,
  UserExperienceItem, UserExperienceItemData,
  UserSkillItem,
  UserInterestItem,
  UserProjectItem,
  UserProjectItemData,
  UserPublicationItem,
  UserPublicationItemData,
  EthnicityTypes,
  Genders,
  State,
  Countries,
  Levels,
  Industry,
  UserExternalResourcesItem,
  UserExternalResourcesItemData,
  ExternalResources,
  ProfileStatuses,
  UserRoles
} from 'src/app/models';
import moment from 'moment';

export interface EditSkillItem {
  index: number;
  skillItem: UserSkillItem;
}

@Component({
  selector: 'create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.scss']
})
export class CreateProfileComponent implements OnInit {

  page_titles = [
    '',
    'Basic Info',
    'About Me',
    'Education',
    'Work Experience',
    'Skills & Interests',
    'Projects',
    'Publications',
    'External Links',
    ''
  ];

  profileCreationPages = [
    'choose-option',
    'profile-basic',
    'profile-about',
    'profile-education',
    'profile-work',
    'profile-skills',
    'profile-project',
    'profile-publication',
    'profile-links',
    'profile-status'
  ];

  isTabMenuOpen: boolean;

  progressWidth = [
    {
      label: 0,
      width: 0
    },
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
      label: 40,
      width: 400 / 9 - 100 / 18
    },
    {
      label: 50,
      width: 500 / 9 - 100 / 18
    },
    {
      label: 60,
      width: 600 / 9 - 100 / 18
    },
    {
      label: 70,
      width: 700 / 9 - 100 / 18
    },
    {
      label: 90,
      width: 800 / 9 - 100 / 18
    },
    {
      label: 100,
      width: 100
    }
  ];

  maxDate = new Date();

  // contants
  genders: string[] = Genders;
  ethnicityTypes: string[] = EthnicityTypes;
  countries: string[] = Countries.slice().sort();
  degrees: Level[] = Levels;

  skills_trained: Skill[][];
  additional_industries: Industry[][];

  // FormGroups
  basicInfoForm: FormGroup;
  educationFormArray: FormArray;
  aboutMeForm: FormGroup;
  workExperienceFormArray: FormArray;
  skillsAndInterestsForm: FormGroup;
  projectsFormArray: FormArray;
  publicationsFormArray: FormArray;
  externalResourcesForm: FormGroup;

  // autocomplete lists
  autocomplete_cities: City[] = [];
  temp_city: City;
  autocomplete_states: State[] = [];
  temp_state: State;
  autocomplete_universities: School[][] = [];
  autocomplete_majors: Major[][] = [];
  autocomplete_focus_majors: Major[][] = [];
  temp_university: School[] = [];
  temp_major: Major[] = [];
  temp_focus_major: Major[] = [];
  autocomplete_companies: Company[][] = [];
  temp_company: Company[] = [];
  autocomplete_skills_trained: Skill[][] = [];
  autocomplete_additional_industries: Industry[][] = [];
  autocomplete_skills: Skill[] = [];
  autocomplete_interests: Interest[] = [];
  prevent_skills_autocomplete: boolean;
  prevent_interets_autocomplete: boolean;

  temp_skill: EditSkillItem;

  statuses: string[] = ProfileStatuses;

  externalResources = ExternalResources;

  profile_status: number;
  selectedPageIndex: number;

  generalInfoResponse: UserGeneralInfo;
  generalInfoRequest: UserObject;
  educationList: UserEducationItem[];
  educationDataList: UserEducationItemData[];
  experienceList: UserExperienceItem[];
  experienceDataList: UserExperienceItemData[];
  userSkillsList: UserSkillItem[];
  userInterestsList: UserInterestItem[];
  userProjectsList: UserProjectItem[];
  userProjectsDataList: UserProjectItemData[];
  userPublicationsList: UserPublicationItem[];
  userPublicationsDataList: UserPublicationItemData[];
  externalResourcesList: UserExternalResourcesItem[];
  externalResourcesDataList: UserExternalResourcesItemData[];

  userRole: string;

  constructor(private route: ActivatedRoute, private router: Router, private autoCompleteService: AutoCompleteService, private userService: UserService, private alertsService: AlertsService, private helperService: HelperService) { }

  ngOnInit() {
    if (this.route.snapshot.queryParams.role) {
      // this.userRole = this.route.snapshot.queryParams.role;
      this.userRole = UserRoles[0];
    }
    this.isTabMenuOpen = false;
    /**
     * "Drop Resume Here" feature won't be available at launch.
     * if need to display this page, set selectedPageIndex to 0.
     */
    this.selectedPageIndex = 1;

    this.initBasicInfoForm();
    this.initAboutMeForm();
    this.initExternalResourcesForm();
    this.initProfileStatus();

    this.getGeneralInfo();
  }

  toggleTabMenuOpen() {
    this.isTabMenuOpen = !this.isTabMenuOpen;
  }

  goToCreatProfilePage() {
    this.selectedPageIndex = 1;
  }

  goToNextPage() {
    switch (this.selectedPageIndex) {
      case 1:
        this.updateGeneralInfo();
        break;
      case 2:
        this.updateGeneralInfo();
        break;
      case 3:
        this.updateEducationData();
        break;
      case 4:
        this.updateExperienceData();
        break;
      case 5:
        this.selectedPageIndex++;
        this.initializeFormsByPageIndex();
        break;
      case 6:
        this.updateUserProjectsData();
        break;
      case 7:
        this.updateUserPublicationsData();
        break;
      case 8:
        this.updateExternalResourceData();
        break;
      case 9:
        this.updateGeneralInfo();
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
      case 1:
        this.getGeneralInfo();
        break;
      case 2:
        this.getGeneralInfo();
        break;
      case 3:
        this.initEducationFormArray();
        this.getEducationList();
        break;
      case 4:
        this.initExperienceFormArray();
        this.getExperienceList();
        break;
      case 5:
        this.initSkillsAndInterestsForm();
        this.getUserSkillsList();
        this.getUserInterestsList();
        break;
      case 6:
        this.initProjectsFormArray();
        this.getUserProjectsList();
        break;
      case 7:
        this.initPublicationsFormArray();
        this.getUserPublicationsList();
        break;
      case 8:
        this.initExternalResourcesForm();
        this.getExternalResourceList();
        break;
      case 9:
        this.getGeneralInfo();
        break;
      default:
        break;
    }
  }


  /**
   * extractDate
   * @param date
   */
  extractDate(date: string): string {
    return `${date.slice(5, 7)}/${date.slice(8, 10)}/${date.slice(0, 4)}`;
  }

  /**
   *  Extract MM/YYYY string from Date type string
   */
  extractYearAndMonth(date: string): string {
    return `${date.slice(5, 7)}/${date.slice(0, 4)}`;
  }

  /**
   * Extract YYYY string from Date
   * @param date: string
   */
  extractYear(date: string): string {
    return date.slice(0, 4);
  }

  /**
   * General Information Form
   */
  initBasicInfoForm() {
    this.autocomplete_cities = [];
    this.autocomplete_states = [];

    this.generalInfoResponse = null;
    this.generalInfoRequest = null;

    this.basicInfoForm = new FormGroup({
      photo: new FormControl(''),
      basicInfoCity: new FormControl(''),
      basicInfoState: new FormControl(''),
      basicInfoCountry: new FormControl(''),
      basicInfoBirth: new FormControl(''),
      basicInfoTitle: new FormControl(''),
      basicInfoGender: new FormControl('', [Validators.required]),
      basicInfoEthnicity: new FormControl('', [Validators.required])
    });

    this.basicInfoForm.get('basicInfoCity').valueChanges.subscribe((city) => {
      if (city && this.helperService.checkSpacesString(city)) {
        this.autoCompleteService.autoComplete(city, 'cities').subscribe(
          dataJson => {
            if (dataJson['success']) {
              this.autocomplete_cities = dataJson['data'];
              if (this.autocomplete_cities.length === 0) {
                this.clearCity();
              }
            }
          },
          error => {
            this.alertsService.show(error.message, AlertType.error);
            this.autocomplete_cities = [];
            this.clearCity();
          }
        );
      } else {
        this.autocomplete_cities = [];
        this.generalInfoRequest.city_id = null;
      }
    });
    this.basicInfoForm.get('basicInfoState').valueChanges.subscribe((state) => {
      if (state && this.helperService.checkSpacesString(state)) {
        this.autoCompleteService.autoComplete(state, 'states').subscribe(
          dataJson => {
            if (dataJson['success']) {
              this.autocomplete_states = dataJson['data'];
              if (this.autocomplete_states.length === 0) {
                this.clearState();
              }
            }
          },
          error => {
            this.alertsService.show(error.message, AlertType.error);
            this.autocomplete_states = [];
            this.clearState();
          }
        );
      } else {
        this.autocomplete_states = [];
        this.generalInfoRequest.state_id = null;
      }
    });
    this.basicInfoForm.get('basicInfoCountry').valueChanges.subscribe(
      (country) => {
        if (country) {
          this.generalInfoRequest.country_id = Countries.indexOf(country) + 1;
        } else {
          this.generalInfoRequest.country_id = null;
        }
      }
    );
    this.basicInfoForm.get('basicInfoGender').valueChanges.subscribe(
      (gender) => {
        this.generalInfoRequest.gender = gender;
      }
    );
    this.basicInfoForm.get('basicInfoBirth').valueChanges.subscribe(
      (date) => {
        this.generalInfoRequest.birthdate = date ? this.helperService.checkSpacesString(date) : null;
      }
    );
    this.basicInfoForm.get('basicInfoTitle').valueChanges.subscribe(
      (title) => {
        this.generalInfoRequest.title = title ? this.helperService.checkSpacesString(title) : null;
      }
    );
    this.basicInfoForm.get('basicInfoEthnicity').valueChanges.subscribe(
      (ethnicity) => {
        this.generalInfoRequest.ethnicity = ethnicity;
      }
    );

    this.basicInfoForm.get('photo').valueChanges
      .subscribe((photoUrl: string) => {
        this.generalInfoRequest.photo = photoUrl ? photoUrl : null;
      });
  }

  updateBasicInformationForm() {
    this.updateGeneralInfoRequest();
    this.basicInfoForm.get('basicInfoCity').setValue(this.generalInfoResponse.city);
    this.basicInfoForm.get('basicInfoState').setValue(this.generalInfoResponse.state);
    this.basicInfoForm.get('basicInfoCountry').setValue(this.generalInfoResponse.country);
    this.basicInfoForm.get('basicInfoGender').setValue(this.generalInfoResponse.gender);
    this.basicInfoForm.get('basicInfoTitle').setValue(this.generalInfoResponse.title);
    this.basicInfoForm.get('basicInfoBirth').setValue(this.generalInfoResponse.birthdate ? this.helperService.convertToFormattedString(this.generalInfoResponse.birthdate, 'L') : '');
    this.basicInfoForm.get('basicInfoEthnicity').setValue(this.generalInfoResponse.ethnicity);
  }

  updateGeneralInfoRequest() {
    this.generalInfoRequest = {
      photo: this.generalInfoResponse.photo ? this.generalInfoResponse.photo : null,
      first_name: this.generalInfoResponse.first_name,
      last_name: this.generalInfoResponse.last_name,
      birthdate: this.generalInfoResponse.birthdate ? this.generalInfoResponse.birthdate : null,
      gender: this.generalInfoResponse.gender,
      phone_num: this.generalInfoResponse.phone_num,
      recruiter: this.generalInfoResponse.recruiter,
      applicant: this.generalInfoResponse.applicant,
      city_id: this.generalInfoResponse.city_id,
      country_id: this.generalInfoResponse.country_id,
      state_id: this.generalInfoResponse.state_id,
      is_looking: this.generalInfoResponse.is_looking,
      title: this.generalInfoResponse.title,
      user_intro: this.generalInfoResponse.user_intro,
      ethnicity: this.generalInfoResponse.ethnicity
    };
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
                this.basicInfoForm.patchValue({
                  photo: response.data
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

  onChangeBirthDate(date: any) {
    if (date.value) {
      this.basicInfoForm.get('basicInfoBirth').setValue(this.helperService.convertToFormattedString(date.value, 'L'));
    } else {
      this.basicInfoForm.get('basicInfoBirth').setValue('');
    }
  }

  onSelectCity(city: City) {
    this.generalInfoRequest.city_id = city.city_id;
    this.temp_city = city;
  }

  onBlurCity() {
    if (this.temp_city) {
      if (this.basicInfoForm.get('basicInfoCity').value !== this.helperService.cityNameFromAutoComplete(this.temp_city.city)) {
        this.clearCity();
        this.temp_city = null;
      }
    } else {
      if (this.basicInfoForm.get('basicInfoCity').value !== this.generalInfoResponse.city) {
        this.clearCity();
      }
    }
  }

  onCheckCityValidation(): boolean {
    const value = this.basicInfoForm.get('basicInfoCity').value;
    if (value && this.helperService.checkSpacesString(value)) {
      if (this.temp_city) {
        return value === this.helperService.cityNameFromAutoComplete(this.temp_city.city) ? true : false;
      } else {
        return value === this.generalInfoResponse.city ? true : false;
      }
    } else {
      return true;
    }
  }

  clearCity() {
    this.generalInfoRequest.city_id = null;
  }

  onSelectState(state: State) {
    this.generalInfoRequest.state_id = state.state_id;
    this.temp_state = state;
  }

  onBlurState() {
    if (this.temp_state) {
      if (this.basicInfoForm.get('basicInfoState').value !== this.temp_state.state) {
        this.clearState();
        this.temp_state = null;
      }
    } else {
      if (this.basicInfoForm.get('basicInfoState').value !== this.generalInfoResponse.state) {
        this.clearState();
      }
    }
  }

  onCheckStateValidation(): boolean {
    const value = this.basicInfoForm.get('basicInfoState').value;
    if (value && this.helperService.checkSpacesString(value)) {
      if (this.temp_state) {
        return value === this.temp_state.state ? true : false;
      } else {
        return value === this.generalInfoResponse.state ? true : false;
      }
    } else {
      return true;
    }
  }

  clearState() {
    this.generalInfoRequest.state_id = null;
  }

  getGeneralInfo() {
    this.userService.getGeneralInfo().subscribe(
      dataJson => {
        this.generalInfoResponse = dataJson['data'];
        this.updateBasicInformationForm();
        this.updateAboutMeForm();
        this.updateProfileStatus();
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

  updateGeneralInfo() {
    if ((this.selectedPageIndex === 1 && this.basicInfoForm.valid && this.onCheckCityValidation() && this.onCheckStateValidation()) ||
      (this.selectedPageIndex === 2 && this.aboutMeForm.valid) || this.selectedPageIndex === 9) {
      if (this.userRole) {
        this.generalInfoRequest[this.userRole] = 1;
      }

      this.userService.updateGeneralInfo(this.generalInfoRequest).subscribe(
        dataJson => {
          this.generalInfoResponse = dataJson['data'];
          this.updateBasicInformationForm();
          this.updateAboutMeForm();
          this.updateProfileStatus();
          if (this.selectedPageIndex !== 9) {
            this.selectedPageIndex++;
            if (this.selectedPageIndex === 3) {
              this.initializeFormsByPageIndex();
            }
          }
        },
        error => {
          this.alertsService.show(error.message, AlertType.error);
        }
      );
    }
  }

  // About Me Form
  initAboutMeForm() {
    this.aboutMeForm = new FormGroup({
      aboutMe: new FormControl('')
    });
  }

  updateAboutMeForm() {
    this.aboutMeForm.get('aboutMe').setValue(this.generalInfoResponse.user_intro ? this.generalInfoResponse.user_intro : '');
    this.aboutMeForm.get('aboutMe').valueChanges.subscribe(
      (aboutMe) => {
        this.generalInfoRequest.user_intro = aboutMe ? this.helperService.checkSpacesString(aboutMe) : null;
      }
    );
  }

  /**
   * Education Information Form
   *  Education FormGroup Array Initialization
   */
  initEducationFormArray() {
    this.educationFormArray = new FormArray([]);
    this.educationList = [];
    this.educationDataList = [];
    this.autocomplete_universities = [];
    this.autocomplete_majors = [];
    this.autocomplete_focus_majors = [];
  }

  onRemoveEducationData(index: number) {
    if (index > this.educationList.length - 1) {
      this.removeEducationFormGroup(index);
    } else {
      this.deleteEducationData(index);
    }
  }

  removeEducationFormGroup(index: number) {
    this.educationDataList.splice(index, 1);
    this.educationFormArray.removeAt(index);
    this.autocomplete_universities.splice(index, 1);
    this.autocomplete_majors.splice(index, 1);
    this.autocomplete_focus_majors.splice(index, 1);
  }

  onAddEducationData() {
    if (this.educationFormArray.valid && this.checkAllEducationInfoValidation()) {
      this.addEducationFormGroup(null);
    }
  }

  /**
   * Add Education FormGroup
   * @param education
   */
  addEducationFormGroup(education: UserEducationItem) {
    this.autocomplete_universities.push([]);
    this.autocomplete_majors.push([]);
    this.autocomplete_focus_majors.push([]);
    this.temp_university.push(null);
    this.temp_major.push(null);
    this.temp_focus_major.push(null);

    const eduactionData = {
      school_id: education ? education.school_id : null,
      major_id: education ? education.major_id : null,
      focus_major: education ? education.focus_major : null,
      start_date: education && education.start_date ? education.start_date : null,
      graduation_date: education && education.graduation_date ? education.graduation_date : null,
      gpa: education ? education.gpa : null,
      edu_desc: education ? education.edu_desc : null,
      user_specified_school_name: education ? education.user_specified_school_name : null,
      level_id: education ? education.level_id : null,
      focus_major_name: education ? education.focus_major_name : null
    };

    const educationForm = new FormGroup({
      university: new FormControl(education ? (education.school_id ? education.school_name : education.user_specified_school_name) : '', [Validators.required]),
      degree: new FormControl(education ? education.education_level : '', [Validators.required]),
      major: new FormControl(education ? education.major_name : ''),
      focus_major: new FormControl(education ? education.focus_major_name : ''),
      start_date: new FormControl(education && education.start_date ? this.helperService.convertToFormattedString(education.start_date, 'YYYY') : '', [Validators.required]),
      graduation_date: new FormControl(education && education.graduation_date ? this.helperService.convertToFormattedString(education.graduation_date, 'YYYY') : '', [Validators.required]),
      gpa: new FormControl(education ? education.gpa : ''),
      description: new FormControl(education ? education.edu_desc : '')
    });

    this.educationDataList.push(eduactionData);

    const arrIndex = this.educationDataList.length - 1;

    educationForm.get('university').valueChanges.subscribe(
      (university) => {
        if (university && this.helperService.checkSpacesString(university)) {
          this.autoCompleteService.autoComplete(university, 'schools').subscribe(
            dataJson => {
              if (dataJson['success']) {
                this.autocomplete_universities[arrIndex] = dataJson['data'];
                if (this.autocomplete_universities[arrIndex].length === 0) {
                  this.onSelectSpecificUniversity(arrIndex, university);
                }
              }
            },
            error => {
              this.autocomplete_universities[arrIndex] = [];
              this.alertsService.show(error.message, AlertType.error);
            }
          );
        } else {
          this.autocomplete_universities[arrIndex] = [];
          this.onSelectSpecificUniversity(arrIndex, null);
        }
      }
    );
    educationForm.get('degree').valueChanges.subscribe(
      (degree) => {
        const filter = this.degrees.filter(value => value.education_level === degree);
        if (filter.length > 0) {
          this.educationDataList[arrIndex].level_id = filter[0].level_id;
        }
      }
    );
    educationForm.get('start_date').valueChanges.subscribe(
      (start_date) => {
        this.educationDataList[arrIndex].start_date = start_date ? this.helperService.convertStringToFormattedDateString(start_date, 'YYYY', 'L') : null;
      }
    );
    educationForm.get('graduation_date').valueChanges.subscribe(
      (graduation_date) => {
        this.educationDataList[arrIndex].graduation_date = graduation_date ? this.helperService.convertStringToFormattedDateString(graduation_date, 'YYYY', 'L') : null;
      }
    );
    educationForm.get('major').valueChanges.subscribe(
      (major) => {
        if (major && this.helperService.checkSpacesString(major)) {
          this.onMajorValueChanges(major, arrIndex, false);
        } else {
          this.autocomplete_majors[arrIndex] = [];
          this.clearMajor(arrIndex);
        }
      }
    );
    educationForm.get('focus_major').valueChanges.subscribe(
      (focus_major) => {
        if (focus_major && this.helperService.checkSpacesString(focus_major)) {
          this.onMajorValueChanges(focus_major, arrIndex, true);
        } else {
          this.autocomplete_focus_majors[arrIndex] = [];
          this.clearFocusMajor(arrIndex);
        }
      }
    );
    educationForm.get('description').valueChanges.subscribe(
      (description) => {
        this.educationDataList[arrIndex].edu_desc = description ? this.helperService.checkSpacesString(description) : null;
      }
    );
    educationForm.get('gpa').valueChanges.subscribe(
      (gpa) => {
        this.educationDataList[arrIndex].gpa = gpa && this.helperService.checkSpacesString(gpa) ? parseFloat(gpa) : null;
      }
    );

    this.educationFormArray.push(educationForm);
  }

  updateEducationForm() {
    if (this.educationList.length === 0) {
      this.addEducationFormGroup(null);
    } else {
      this.educationList.forEach((education) => {
        this.addEducationFormGroup(education);
      });
    }
  }

  onSelectSpecificUniversity(index: number, university: string) {
    this.educationDataList[index].user_specified_school_name = university;
    this.educationDataList[index].school_id = null;
  }

  onSelectUniversity(index: number, university: School) {
    this.educationDataList[index].school_id = university.school_id;
    this.educationDataList[index].user_specified_school_name = null;
    this.temp_university[index] = university;
  }

  onBlurUniversity(index: number) {
    if (this.temp_university[index]) {
      if (this.educationFormArray.at(index).get('university').value !== this.temp_university[index].school_name) {
        this.onSelectSpecificUniversity(index, this.educationFormArray.at(index).get('university').value);
        this.temp_university[index] = null;
      }
    } else {
      this.onSelectSpecificUniversity(index, this.educationFormArray.at(index).get('university').value);
    }
  }

  onSelectMajor(index: number, major: Major) {
    this.educationDataList[index].major_id = major.major_id;
    this.temp_major[index] = major;
  }

  onBlurMajor(index: number) {
    if (this.temp_major[index]) {
      if (this.educationFormArray.at(index).get('major').value !== this.temp_major[index].major_name) {
        this.temp_major[index] = null;
        this.clearMajor(index);
      }
    } else {
      if (!this.educationList[index] || (this.educationList[index] && this.educationFormArray.at(index).get('major').value !== this.educationList[index].major_name)) {
        this.clearMajor(index);
      }
    }
  }

  /**
   *
   * Check Input of Major/Focus Major if these values selected from autocomplete list.
   * @param arrIndex - Index of FormGroup Array
   * @param isFocusMajor - Major or Focus Major
   *
   */
  checkMajorValidation(arrIndex: number, isFocusMajor: boolean): boolean {
    if (isFocusMajor) {
      const value = this.educationFormArray.at(arrIndex).get('focus_major').value;
      if (value && this.helperService.checkSpacesString(value)) {
        if (this.temp_focus_major[arrIndex]) {
          return value === this.temp_focus_major[arrIndex].major_name ? true : false;
        } else {
          return this.educationList[arrIndex] && value === this.educationList[arrIndex].focus_major_name ?  true : false;
        }
      } else {
        return true;
      }
    } else {
      const value = this.educationFormArray.at(arrIndex).get('major').value;
      if (value && this.helperService.checkSpacesString(value)) {
        if (this.temp_major[arrIndex]) {
          return value === this.temp_major[arrIndex].major_name ? true : false;
        } else {
          return this.educationList[arrIndex] && value === this.educationList[arrIndex].major_name ? true : false;
        }
      } else {
        return true;
      }
    }
  }

  checkSchoolNameValidation(arrIndex: number): boolean {
    const value = this.educationFormArray.at(arrIndex).get('university').value;
    return value && this.helperService.checkSpacesString(value) ? true : false;
  }
  checkAllEducationInfoValidation(): boolean {
    let valid = true;
    this.educationDataList.forEach((value, index) => {
      if (!this.checkMajorValidation(index, false) || !this.checkMajorValidation
      (index, true) || !this.checkSchoolNameValidation(index)) {
        valid = false;
      }
    });
    return valid;
  }

  checkAllMajorValidation(): boolean {
    let valid = true;
    this.educationDataList.forEach((value, index) => {
      if (!this.checkMajorValidation(index, false) || !this.checkMajorValidation
      (index, true)) {
        valid = false;
      }
    });
    return valid;
  }

  clearMajor(index: number) {
    this.educationDataList[index].major_id = null;
  }

  onSelectFocusMajor(index: number, major: Major) {
    this.educationDataList[index].focus_major = major.major_id;
    this.temp_focus_major[index] = major;
  }

  onBlurFocusMajor(index: number) {
    if (this.temp_focus_major[index]) {
      if (this.educationFormArray.at(index).get('focus_major').value !== this.temp_focus_major[index].major_name) {
        this.temp_focus_major[index] = null;
        this.clearFocusMajor(index);
      }
    } else {
      if (!this.educationList[index] || (this.educationList[index] && this.educationFormArray.at(index).get('focus_major').value !== this.educationList[index].focus_major_name)) {
        this.clearFocusMajor(index);
      }
    }
  }

  clearFocusMajor(index: number) {
    this.educationDataList[index].focus_major = null;
  }

  onEducationYearSelect(date: any, index: number, isStartDate: boolean = true, datePicker: MatDatepicker<any>) {
    const dateValue = new Date(date);
    datePicker.close();
    this.educationFormArray.at(index).get(isStartDate ? 'start_date' : 'graduation_date').setValue(moment(dateValue).format('YYYY'));
  }

  isExistStartDate(index: number): boolean {
    if (this.educationFormArray.at(index).get('start_date').value) {
      return true;
    } else {
      return false;
    }
  }

  minEduGraduationDate(index: number): Date {
    return this.educationDataList[index].start_date;
  }

  onMajorValueChanges(major: string, index: number, isFocusMajor: boolean = false) {
    this.autoCompleteService.autoComplete(major, 'majors').subscribe(
      dataJson => {
        if (dataJson['success']) {
          if (isFocusMajor) {
            this.autocomplete_focus_majors[index] = dataJson['data'];
            if (this.autocomplete_focus_majors[index].length === 0) {
              this.clearFocusMajor(index);
            }
          } else {
            this.autocomplete_majors[index] = dataJson['data'];
            if (this.autocomplete_majors[index].length === 0) {
              this.clearMajor(index);
            }
          }
        }
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
        if (isFocusMajor) {
          this.autocomplete_focus_majors[index] = [];
          this.clearFocusMajor(index);
        } else {
          this.autocomplete_majors[index] = [];
          this.clearMajor(index);
        }
      }
    );
  }

  getEducationList() {
    this.userService.getEducationInfo().subscribe(
      dataJson => {
        this.educationList = dataJson['data'];
        this.updateEducationForm();
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
        this.educationList = [];
        this.updateEducationForm();
      }
    );
  }

  updateEducationData() {
    if (this.educationDataList.length !== 0) {
      if (this.educationFormArray.valid && this.checkAllEducationInfoValidation()) {
        if (this.educationFormArray.valid) {
          let counts = 0;
          this.educationDataList.forEach((education, index) => {
            if (index < this.educationList.length) {
              this.userService.patchEducationInfoById(education, this.educationList[index].education_id).subscribe(
                dataJson => {
                  this.educationList[index] = dataJson['data'];
                  counts++;
                  if (counts === this.educationDataList.length) {
                    this.selectedPageIndex++;
                    this.initializeFormsByPageIndex();
                  }
                },
                error => {
                  this.alertsService.show(error.message, AlertType.error);
                }
              );
            } else {
              this.userService.postEducationInfo(education).subscribe(
                dataJson => {
                  this.educationList[index] = dataJson['data'];
                  counts++;
                  if (counts === this.educationDataList.length) {
                    this.selectedPageIndex++;
                    this.initializeFormsByPageIndex();
                  }
                },
                error => {
                  this.alertsService.show(error.message, AlertType.error);
                }
              );
            }
          });
        }
      }
    } else {
      this.selectedPageIndex++;
      this.initializeFormsByPageIndex();
    }
  }

  deleteEducationData(index: number) {
    this.userService.deleteEducationInfoById(this.educationList[index].education_id).subscribe(
      dataJson => {
        this.educationList.splice(index, 1);
        this.removeEducationFormGroup(index);
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

  /**
   * Work Experience Form
   *  Work Experience FormGroup Array Initialization
   */
  initExperienceFormArray() {
    this.workExperienceFormArray = new FormArray([]);
    this.experienceList = [];
    this.experienceDataList = [];
    this.autocomplete_companies = [];
    this.autocomplete_skills_trained = [];
    this.autocomplete_additional_industries = [];
    this.skills_trained = [];
    this.additional_industries = [];
  }

  onRemoveExperienceData(index: number) {
    if (index > this.experienceList.length - 1) {
      this.removeExperienceFormGroup(index);
    } else {
      this.deleteExperienceData(index);
    }
  }

  removeExperienceFormGroup(index: number) {
    this.experienceDataList.splice(index, 1);
    this.skills_trained.splice(index, 1);
    this.additional_industries.splice(index, 1);
    this.workExperienceFormArray.removeAt(index);
    this.autocomplete_companies.splice(index, 1);
    this.autocomplete_skills_trained.splice(index, 1);
    this.autocomplete_additional_industries.splice(index, 1);
  }

  onAddExperienceData() {
    if (this.workExperienceFormArray.valid) {
      this.addExperienceFormGroup(null);
    }
  }

  /**
   * Add Work Expereince FormGroup
   * @param experience
   */

  addExperienceFormGroup(experience: UserExperienceItem) {
    this.autocomplete_companies.push([]);
    this.autocomplete_skills_trained.push([]);
    this.autocomplete_additional_industries.push([]);
    this.skills_trained.push(experience && experience.skills_trained ? experience.skills_trained : []);
    this.additional_industries.push(experience && experience.add_industries ? experience.add_industries : []);

    const experienceData = {
      company_id: experience ? experience.company_id : null,
      job: experience ? experience.job : null,
      start_date: experience && experience.start_date ? experience.start_date : null,
      end_date: experience && experience.end_date ? experience.end_date : null,
      job_desc: experience ? experience.job_desc : null,
      user_specified_company_name: experience ? experience.user_specified_company_name : null,
      skill_ids_trained: (experience && experience.skills_trained && experience.skills_trained.length > 0) ? experience.skills_trained.map(x => x.skill_id) : null,
      add_industry_ids: (experience && experience.add_industries && experience.add_industries.length) > 0 ? experience.add_industries.map(x => x.industry_id) : null,
    };

    this.experienceDataList.push(experienceData);

    const arrIndex = this.experienceDataList.length - 1;

    const workExperienceForm = new FormGroup({
      company_name: new FormControl(experience ? (experience.company_id ? experience.company_name : experience.user_specified_company_name) : '', [Validators.required]),
      start_date: new FormControl(experience && experience.start_date ? this.helperService.convertToFormattedString(experience.start_date, 'MM/YYYY') : '', [Validators.required]),
      end_date: new FormControl(experience && experience.end_date ? this.helperService.convertToFormattedString(experience.end_date, 'MM/YYYY') : ''),
      job: new FormControl(experience ? experience.job : '', [Validators.required]),
      description: new FormControl(experience ? experience.job_desc : ''),
      skills_trained: new FormControl(''),
      additional_industries: new FormControl('')
    });

    workExperienceForm.get('company_name').valueChanges.subscribe(
      (company) => {
        if (company && this.helperService.checkSpacesString(company)) {
          this.autoCompleteService.autoComplete(company, 'companies').subscribe(
            dataJson => {
              if (dataJson['success']) {
                this.autocomplete_companies[arrIndex] = dataJson['data'];
                if (this.autocomplete_companies[arrIndex].length === 0) {
                  this.onSelectSpecificCompany(arrIndex, company);
                }
              }
            },
            error => {
              this.autocomplete_companies[arrIndex] = [];
              this.alertsService.show(error.message, AlertType.error);
            }
          );
        } else {
          this.autocomplete_companies[arrIndex] = [];
          this.onSelectSpecificCompany(arrIndex, null);
        }
      }
    );
    workExperienceForm.get('start_date').valueChanges.subscribe(
      (start_date) => {
        this.experienceDataList[arrIndex].start_date = start_date ? this.helperService.convertStringToFormattedDateString(start_date, 'MM/YYYY', 'L') : null ;
      }
    );
    workExperienceForm.get('end_date').valueChanges.subscribe(
      (end_date) => {
        this.experienceDataList[arrIndex].end_date = end_date ? this.helperService.convertStringToFormattedDateString(end_date, 'MM/YYYY', 'L') : null ;
      }
    );
    workExperienceForm.get('job').valueChanges.subscribe(
      (job) => {
        this.experienceDataList[arrIndex].job = job ? this.helperService.checkSpacesString(job) : null;
      }
    );
    workExperienceForm.get('description').valueChanges.subscribe(
      (description) => {
        this.experienceDataList[arrIndex].job_desc = description ? this.helperService.checkSpacesString(description) : null;
      }
    );

    workExperienceForm.get('skills_trained').valueChanges.subscribe(
      (skill) => {
        if (skill && this.helperService.checkSpacesString(skill)) {
          this.autoCompleteService.autoComplete(skill, 'skills').subscribe(
            dataJson => {
              if (dataJson['success']) {
                this.autocomplete_skills_trained[arrIndex] = dataJson['data'];
              }
            },
            error => {
              this.autocomplete_skills_trained[arrIndex] = [];
              this.alertsService.show(error.message, AlertType.error);
            }
          );
        } else {
          this.autocomplete_skills_trained[arrIndex] = [];
        }
      }
    );
    workExperienceForm.get('additional_industries').valueChanges.subscribe(
      (industry) => {
        if (industry && this.helperService.checkSpacesString(industry)) {
          this.autoCompleteService.autoComplete(industry, 'industries').subscribe(
            dataJson => {
              if (dataJson['success']) {
                this.autocomplete_additional_industries[arrIndex] = dataJson['data'];
              }
            },
            error => {
              this.autocomplete_additional_industries[arrIndex] = [];
              this.alertsService.show(error.message, AlertType.error);
            }
          );
        } else {
          this.autocomplete_additional_industries[arrIndex] = [];
        }
      }
    );

    this.workExperienceFormArray.push(workExperienceForm);
  }

  checkCompanyNameValidation(arrIndex: number): boolean {
    const value = this.workExperienceFormArray.at(arrIndex).get('company_name').value;
    return value && this.helperService.checkSpacesString(value) ? true : false;
  }

  checkAllWorkExperienceInfoValidation(): boolean {
    let valid = true;
    this.experienceDataList.forEach((val, index) => {
      if (!this.checkCompanyNameValidation(index)) {
        valid = false;
      }
    });
    return valid;
  }

  updateExperienceForm() {
    if (this.experienceList.length === 0) {
      this.addExperienceFormGroup(null);
    } else {
      this.experienceList.forEach((experience) => {
        this.addExperienceFormGroup(experience);
      });
    }
  }

  onSelectSpecificCompany(index: number, company: string) {
    this.experienceDataList[index].user_specified_company_name = company;
    this.experienceDataList[index].company_id = null;
  }

  onSelectCompany(index: number, company: Company) {
    this.experienceDataList[index].company_id = company.company_id;
    this.experienceDataList[index].user_specified_company_name = null;
    this.temp_company[index] = company;
  }

  onBlurCompany(index: number) {
    if (this.temp_company[index]) {
      if (this.workExperienceFormArray.at(index).get('company_name').value !== this.temp_company[index].company_name) {
        this.onSelectSpecificCompany(index, this.workExperienceFormArray.at(index).get('company_name').value);
        this.temp_company[index] = null;
      }
    } else {
      this.onSelectSpecificCompany(index, this.workExperienceFormArray.at(index).get('company').value);
    }
  }

  onExperienceMonthSelect(date: any, index: number, isStartDate: boolean = true, datePicker: MatDatepicker<any>) {
    datePicker.close();
    this.workExperienceFormArray.at(index).get(isStartDate ? 'start_date' : 'end_date').setValue(this.helperService.convertToFormattedString(date, 'MM/YYYY'));
  }

  isExperienceStartDate(index: number): boolean {
    if (this.workExperienceFormArray.at(index).get('start_date').value) {
      return true;
    } else {
      return false;
    }
  }

  minExperienceEndDate(index: number): Date {
    return this.experienceDataList[index].start_date;
  }

  addSkillsTrained(index: number, skill: Skill) {
    if (skill) {
      if (this.skills_trained[index].filter(skill_trained => skill_trained.skill_id === skill.skill_id).length === 0) {
        this.skills_trained[index].push(skill);
        if (this.experienceDataList[index].skill_ids_trained) {
          this.experienceDataList[index].skill_ids_trained.push(skill.skill_id);
        } else {
          this.experienceDataList[index].skill_ids_trained = [skill.skill_id];
        }
      }
      this.workExperienceFormArray.at(index).get('skills_trained').setValue('');
    }
  }

  onRemoveSkillsTrained(formArrIndex: number, arrIndex: number, skill: Skill) {
    if (formArrIndex < this.experienceList.length) {
      if (this.experienceList[formArrIndex].skills_trained.filter(skill_trained => skill_trained.skill_id === skill.skill_id).length > 0) {
        this.removeExperienceSkillTrainedData(formArrIndex, arrIndex, skill);
      } else {
        this.removeSkillsTrained(formArrIndex, arrIndex, skill);
      }
    } else {
      this.removeSkillsTrained(formArrIndex, arrIndex, skill);
    }
  }

  removeSkillsTrained(formArrIndex: number, arrIndex: number, skill: Skill) {
    if (this.skills_trained[formArrIndex][arrIndex].skill_id === skill.skill_id) {
      this.skills_trained[formArrIndex].splice(arrIndex, 1);
      this.experienceDataList[formArrIndex].skill_ids_trained.splice(arrIndex, 1);
      if (this.experienceDataList[formArrIndex].skill_ids_trained.length === 0) {
        this.experienceDataList[formArrIndex].skill_ids_trained = null;
      }
    }
  }

  removeExperienceSkillTrainedData(formArrIndex: number, arrIndex: number, skill: Skill) {
    this.userService.DeleteSkillTrainedById(this.experienceList[formArrIndex].work_hist_id, skill.skill_id).subscribe(
      dataJson => {
        console.log('Delete Education_List', dataJson);
        this.removeSkillsTrained(formArrIndex, arrIndex, skill);
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

  addAdditionalIndustry(index: number, industry: Industry) {
    if (industry) {
      if (this.additional_industries[index].filter(additional_industry => additional_industry.industry_id === industry.industry_id).length === 0) {
        this.additional_industries[index].push(industry);
        if (this.experienceDataList[index].add_industry_ids) {
          this.experienceDataList[index].add_industry_ids.push(industry.industry_id);
        } else {
          this.experienceDataList[index].add_industry_ids = [industry.industry_id];
        }
      }
      this.workExperienceFormArray.at(index).get('additional_industries').setValue('');
    }
  }

  onRemoveAdditionalIndustry(formArrIndex: number, arrIndex: number, industry: Industry) {
    if (formArrIndex < this.experienceList.length) {
      if (this.experienceList[formArrIndex].add_industries.filter(add_industry => add_industry.industry_id === industry.industry_id).length > 0) {
        this.removeAdditionalIndustryData(formArrIndex, arrIndex, industry);
      } else {
        this.removeAdditionalIndustry(formArrIndex, arrIndex, industry);
      }
    } else {
      this.removeAdditionalIndustry(formArrIndex, arrIndex, industry);
    }
  }

  removeAdditionalIndustry(formArrIndex: number, arrIndex: number, industry: Industry) {
    if (this.additional_industries[formArrIndex][arrIndex].industry_id === industry.industry_id) {
      this.additional_industries[formArrIndex].splice(arrIndex, 1);
      this.experienceDataList[formArrIndex].add_industry_ids.splice(arrIndex, 1);
      if (this.experienceDataList[formArrIndex].add_industry_ids.length === 0) {
        this.experienceDataList[formArrIndex].add_industry_ids = null;
      }
    }
  }

  removeAdditionalIndustryData(formArrIndex: number, arrIndex: number, industry: Industry) {
    this.userService.DeleteAdditionalIndustryById(this.experienceList[formArrIndex].work_hist_id, industry.industry_id).subscribe(
      dataJson => {
        console.log('Delete Education_List', dataJson);
        this.removeAdditionalIndustry(formArrIndex, arrIndex, industry);
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

  getExperienceList() {
    this.userService.getExperienceInfo().subscribe(
      dataJson => {
        this.experienceList = dataJson['data'];
        this.updateExperienceForm();
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
        this.experienceList = [];
        this.updateExperienceForm();
      }
    );
  }

  updateExperienceData() {
    if (this.experienceDataList.length !== 0) {
      if (this.workExperienceFormArray.valid && this.checkAllWorkExperienceInfoValidation()) {
        if (this.workExperienceFormArray.valid) {
          let counts = 0;
          this.experienceDataList.forEach((experience, index) => {
            if (index < this.experienceList.length) {
              this.userService.patchExperienceInfoById(experience, this.experienceList[index].work_hist_id).subscribe(
                dataJson => {
                  this.experienceList[index] = dataJson['data'];
                  counts++;
                  if (counts === this.experienceDataList.length) {
                    this.selectedPageIndex++;
                    this.initializeFormsByPageIndex();
                  }
                },
                error => {
                  this.alertsService.show(error.message, AlertType.error);
                }
              );
            } else {
              this.userService.postExperienceInfo(experience).subscribe(
                dataJson => {
                  this.experienceList[index] = dataJson['data'];
                  counts++;
                  if (counts === this.experienceDataList.length) {
                    this.selectedPageIndex++;
                    this.initializeFormsByPageIndex();
                  }
                },
                error => {
                  this.alertsService.show(error.message, AlertType.error);
                }
              );
            }
          });
        }
      }
    } else {
      this.selectedPageIndex++;
      this.initializeFormsByPageIndex();
    }
  }

  deleteExperienceData(index: number) {
    this.userService.deleteExperienceInfoById(this.experienceList[index].work_hist_id).subscribe(
      dataJson => {
        this.experienceList.splice(index, 1);
        this.removeExperienceFormGroup(index);
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }


  // Skills And Interests Form
  initSkillsAndInterestsForm() {
    this.autocomplete_skills = [];
    this.autocomplete_interests = [];
    this.prevent_skills_autocomplete = false;
    this.prevent_interets_autocomplete = false;
    this.userSkillsList = [];
    this.userInterestsList = [];
    this.temp_skill = null;

    this.skillsAndInterestsForm = new FormGroup({
      skills: new FormControl(''),
      interests: new FormControl('')
    });

    this.skillsAndInterestsForm.get('skills').valueChanges.subscribe(
      (skill) => {
        if (skill && this.helperService.checkSpacesString(skill)) {
          if (!this.prevent_skills_autocomplete) {
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
          } else {
            this.autocomplete_skills = [];
            this.prevent_skills_autocomplete = false;
          }
        } else {
          this.autocomplete_skills = [];
        }
      }
    );

    this.skillsAndInterestsForm.get('interests').valueChanges.subscribe(
      (interest) => {
        if (interest && this.helperService.checkSpacesString(interest)) {
          if (!this.prevent_interets_autocomplete) {
            this.autoCompleteService.autoComplete(interest, 'interests').subscribe(
              dataJson => {
                if (dataJson['success']) {
                  this.autocomplete_interests = dataJson['data'];
                }
              },
              error => {
                this.alertsService.show(error.message, AlertType.error);
                this.autocomplete_interests = [];
              }
            );
          } else {
            this.autocomplete_interests = [];
            this.prevent_interets_autocomplete = false;
          }
        } else {
          this.autocomplete_interests = [];
        }
      }
    );
  }

  addSkills(skillItem: Skill) {
    const skillItemData = {
      skill_id: skillItem.skill_id,
      skill: skillItem.skill,
      skill_level: 1
    };
    const filterList = this.userSkillsList.filter(value => value.skill_id === skillItemData.skill_id);
    if (filterList.length === 0) {
      this.addUserSkillsData(skillItemData);
    } else {
      this.temp_skill = {
        index: this.userSkillsList.indexOf(filterList[0]),
        skillItem: filterList[0]
      };
    }
    this.skillsAndInterestsForm.get('skills').setValue('');
    this.prevent_skills_autocomplete = true;
  }

  onLevelChanged(level: number, index: number) {
    const skillItemData = {
      skill_id: this.userSkillsList[index].skill_id,
      skill: this.userSkillsList[index].skill,
      skill_level: level
    };
    this.updateUserSkillsData(index, skillItemData);
  }

  editSkillDone() {
    this.temp_skill = null;
  }

  getUserSkillsList() {
    this.userService.getSkillsInfo().subscribe(
      dataJson => {
        this.userSkillsList = dataJson['data'];
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
        this.userSkillsList = [];
      }
    );
  }

  updateUserSkillsData(arrIndex: number, userSkillItem: UserSkillItem) {
    this.userService.patchSkillInfoById(userSkillItem.skill_id, userSkillItem).subscribe(
      dataJson => {
        this.userSkillsList[arrIndex] = dataJson['data'];
        if (this.temp_skill) {
          this.temp_skill.skillItem = dataJson['data'];
        }
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

  addUserSkillsData(userSkillItem: UserSkillItem) {
    this.userService.postSkillInfo(userSkillItem).subscribe(
      dataJson => {
        this.userSkillsList.push(dataJson['data']);
        this.temp_skill = {
          index: this.userSkillsList.length - 1,
          skillItem: dataJson['data']
        };
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

  removeUserSkillsData(index: number, userSkillItem: UserSkillItem) {
    this.userService.deleteSkillInfoById(userSkillItem.skill_id).subscribe(
      dataJson => {
        this.userSkillsList.splice(index, 1);
        this.temp_skill = null;
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

  addInterests(interestItem: Interest) {
    const interestItemData = {
      interest_id: interestItem.interest_id,
      interest: interestItem.interest
    };
    if (this.userInterestsList.filter(value => value.interest === interestItem.interest).length === 0) {
      this.addUserInteretsData(interestItemData);
    }
    this.skillsAndInterestsForm.get('interests').setValue('');
    this.prevent_interets_autocomplete = true;
  }

  getUserInterestsList() {
    this.userService.getUserInterestsInfo().subscribe(
      dataJson => {
        this.userInterestsList = dataJson['data'];
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
        this.userInterestsList = [];
      }
    );
  }

  addUserInteretsData(userInterestItem: UserInterestItem) {
    this.userService.postUserInterestsInfo(userInterestItem).subscribe(
      dataJson => {
        this.userInterestsList.push(dataJson['data']);
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

  removeUserInteretsData(index: number, userInterestItem: UserInterestItem) {
    this.userService.deleteUserInterestsInfoById(userInterestItem.interest_id).subscribe(
      dataJson => {
        this.userInterestsList.splice(index, 1);
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }


  /**
   *  Projects Information From
   *  Projects FormGroup Array Initialization
   */

  initProjectsFormArray() {
    this.projectsFormArray = new FormArray([]);
    this.userProjectsList = [];
    this.userProjectsDataList = [];
  }

  onRemoveProjectData(arrIndex: number) {
    if (arrIndex > this.userProjectsList.length - 1) {
      this.removeProjectFormGroup(arrIndex);
    } else {
      this.deleteUserProjectData(arrIndex);
    }
  }

  removeProjectFormGroup(arrIndex: number) {
    this.projectsFormArray.removeAt(arrIndex);
    this.userProjectsDataList.splice(arrIndex, 1);
  }

  onAddProjectData() {
    if (this.projectsFormArray.valid) {
      this.addProjectFormGroup(null);
    }
  }

  addProjectFormGroup(project: UserProjectItem) {
    const projectItem = {
      project_name: project ? project.project_name : null,
      description: project ? project.description : null,
      date_finished: (project && project.date_finished) ? project.date_finished : null,
      href: project ? project.href : null
    };
    this.userProjectsDataList.push(projectItem);

    const arrIndex = this.userProjectsDataList.length - 1;

    const projectFormGroup = new FormGroup({
      project_name: new FormControl(project ? project.project_name : '', [Validators.required]),
      date_finished: new FormControl((project && project.date_finished) ? this.helperService.convertToFormattedString(project.date_finished, 'L') : ''),
      description: new FormControl(project ? project.description : ''),
      href: new FormControl(project ? project.href : '')
    });
    projectFormGroup.get('project_name').valueChanges.subscribe(
      (project_name) => {
        this.userProjectsDataList[arrIndex].project_name = project_name ? this.helperService.checkSpacesString(project_name) : null;
      }
    );
    projectFormGroup.get('description').valueChanges.subscribe(
      (description) => {
        this.userProjectsDataList[arrIndex].description = description ? this.helperService.checkSpacesString(description) : null;
      }
    );
    projectFormGroup.get('date_finished').valueChanges.subscribe(
      (date_finished) => {
        this.userProjectsDataList[arrIndex].date_finished = date_finished ? this.helperService.checkSpacesString(date_finished) : null;
      }
    );
    projectFormGroup.get('href').valueChanges.subscribe(
      (href) => {
        this.userProjectsDataList[arrIndex].href = href ? this.helperService.checkSpacesString(href) : null;
      }
    );
    this.projectsFormArray.push(projectFormGroup);
  }

  checkProjectNameValidation(arrIndex: number): boolean {
    const value = this.projectsFormArray.at(arrIndex).get('project_name').value;
    return value && this.helperService.checkSpacesString(value) ? true : false;
  }
  checkAllProjectsInfoValidation(): boolean {
    let valid = true;
    this.userProjectsDataList.forEach((project, index) => {
      if (!this.checkProjectNameValidation(index)) {
        valid = false;
      }
    });
    return valid;
  }

  updateProjectsFormArray() {
    if (this.userProjectsList.length === 0) {
      this.addProjectFormGroup(null);
    } else {
      this.userProjectsList.forEach(project => {
        this.addProjectFormGroup(project);
      });
    }
  }

  onChangeProjectFinishedDate(event: any, arrIndex: number) {
    if (event.value) {
      this.projectsFormArray.at(arrIndex).get('date_finished').setValue(this.helperService.convertToFormattedString(event.value, 'L'));
    } else {
      this.projectsFormArray.at(arrIndex).get('date_finished').setValue('');
    }
  }

  getUserProjectsList() {
    this.userService.getProjectsInfo().subscribe(
      dataJson => {
        this.userProjectsList = dataJson['data']['data'];
        this.updateProjectsFormArray();
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
        this.userProjectsList = [];
        this.updateProjectsFormArray();
      }
    );
  }

  updateUserProjectsData() {
    if (this.userProjectsDataList.length !== 0) {
      if (this.projectsFormArray.valid && this.checkAllProjectsInfoValidation()) {
        let counts = 0;
        this.userProjectsDataList.forEach((project, index) => {
          if (index < this.userProjectsList.length) {
            this.userService.patchProjectInfoById(project, this.userProjectsList[index].project_id).subscribe(
              dataJson => {
                this.userProjectsList[index] = dataJson['data'];
                counts++;
                if (counts === this.userProjectsDataList.length) {
                  this.selectedPageIndex++;
                  this.initializeFormsByPageIndex();
                }
              },
              error => {
                this.alertsService.show(error.message, AlertType.error);
              }
            );
          } else {
            this.userService.postProjectInfo(project).subscribe(
              dataJson => {
                this.userProjectsList[index] = dataJson['data'];
                counts++;
                if (counts === this.userProjectsDataList.length) {
                  this.selectedPageIndex++;
                  this.initializeFormsByPageIndex();
                }
              },
              error => {
                this.alertsService.show(error.message, AlertType.error);
              }
            );
          }
        });
      }
    } else {
      this.selectedPageIndex++;
      this.initializeFormsByPageIndex();
    }
  }

  deleteUserProjectData(arrIndex: number) {
    this.userService.deleteProjectInfoById(this.userProjectsList[arrIndex].project_id).subscribe(
      dataJson => {
        this.userProjectsList.splice(arrIndex, 1);
        this.removeProjectFormGroup(arrIndex);
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }


  /**
   *  Publications Information Form
   *  Publicatinos FormGroup Initialilzation
   */
  initPublicationsFormArray() {
    this.publicationsFormArray = new FormArray([]);
    this.userPublicationsList = [];
    this.userPublicationsDataList = [];
  }

  onRemovePublicationData(arrIndex: number) {
    if (arrIndex > this.userPublicationsList.length - 1) {
      this.removePublicationFormGroup(arrIndex);
    } else {
      this.deleteUserPublicationData(arrIndex);
    }
  }

  removePublicationFormGroup(arrIndex: number) {
    this.publicationsFormArray.removeAt(arrIndex);
    this.userPublicationsDataList.splice(arrIndex, 1);
  }

  onAddPublicationData() {
    if (this.publicationsFormArray.valid) {
      this.addPublicationFormGroup(null);
    }
  }

  addPublicationFormGroup(publication: UserPublicationItem) {
    const publicationItem = {
      publication_title: publication ? publication.publication_title : null,
      description: publication ? publication.description : null,
      date_published: publication && publication.date_published ? publication.date_published : null,
      href: publication ? publication.href : null,
      publisher: publication ? publication.publisher : null
    };
    this.userPublicationsDataList.push(publicationItem);

    const arrIndex = this.userPublicationsDataList.length - 1;

    const publicationFormGroup = new FormGroup({
      publication_name: new FormControl(publication ? publication.publication_title : '', [Validators.required]),
      date_published: new FormControl(publication && publication.date_published ? this.helperService.convertToFormattedString(publication.date_published, 'L') : ''),
      description: new FormControl(publication ? publication.description : ''),
      href: new FormControl(publication ? publication.href : '')
    });
    publicationFormGroup.get('publication_name').valueChanges.subscribe(
      (publication_title) => {
        this.userPublicationsDataList[arrIndex].publication_title = publication_title ? this.helperService.checkSpacesString(publication_title) : null;
      }
    );
    publicationFormGroup.get('description').valueChanges.subscribe(
      (description) => {
        this.userPublicationsDataList[arrIndex].description = description ? this.helperService.checkSpacesString(description) : null;
      }
    );
    publicationFormGroup.get('date_published').valueChanges.subscribe(
      (date_published) => {
        this.userPublicationsDataList[arrIndex].date_published = date_published ? this.helperService.checkSpacesString(date_published) : null;
      }
    );
    publicationFormGroup.get('href').valueChanges.subscribe(
      (href) => {
        this.userPublicationsDataList[arrIndex].href = href ? this.helperService.checkSpacesString(href) : null;
      }
    );
    this.publicationsFormArray.push(publicationFormGroup);
  }

  checkPublicationNameValidation(arrIndex: number): boolean {
    const value = this.publicationsFormArray.at(arrIndex).get('publication_name').value;
    return value && this.helperService.checkSpacesString(value) ? true : false;
  }
  checkAllPublicationInfoValidation(): boolean {
    let valid = true;
    this.userPublicationsDataList.forEach((val, index) => {
      if (!this.checkPublicationNameValidation(index)) {
        valid = false;
      }
    });
    return valid;
  }

  updatePublicationsFormArray() {
    if (this.userPublicationsList.length === 0) {
      this.addPublicationFormGroup(null);
    } else {
      this.userPublicationsList.forEach(publication => {
        this.addPublicationFormGroup(publication);
      });
    }
  }

  onPublicationPublisherValueChange(arrIndex: number, publisher: string) {
    this.userPublicationsDataList[arrIndex].publisher = publisher ? publisher : null;
  }

  onChangeDatePublished(event: any, arrIndex: number) {
    if (event.value) {
      this.publicationsFormArray.at(arrIndex).get('date_published').setValue(this.helperService.convertToFormattedString(event.value, 'L'));
    } else {
      this.publicationsFormArray.at(arrIndex).get('date_published').setValue('');
    }
  }

  getUserPublicationsList() {
    this.userService.getPublicationsInfo().subscribe(
      dataJson => {
        this.userPublicationsList = dataJson['data'];
        this.updatePublicationsFormArray();
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
        this.userPublicationsList = [];
        this.updatePublicationsFormArray();
      }
    );
  }

  updateUserPublicationsData() {
    if (this.userPublicationsDataList.length !== 0) {
      let counts = 0;
      this.userPublicationsDataList.forEach((publication, index) => {
        if (index < this.userPublicationsList.length) {
          this.userService.patchPublicationsInfoById(publication, this.userPublicationsList[index].publication_id).subscribe(
            dataJson => {
              this.userPublicationsList[index] = dataJson['data'];
              counts++;
              if (counts === this.userPublicationsDataList.length) {
                this.selectedPageIndex++;
                this.initializeFormsByPageIndex();
              }
            },
            error => {
              this.alertsService.show(error.message, AlertType.error);
            }
          );
        } else {
          this.userService.postPublicationsInfo(publication).subscribe(
            dataJson => {
              this.userPublicationsList[index] = dataJson['data'];
              counts++;
              if (counts === this.userPublicationsDataList.length) {
                this.selectedPageIndex++;
                this.initializeFormsByPageIndex();
              }
            },
            error => {
              this.alertsService.show(error.message, AlertType.error);
            }
          );
        }
      });
    } else {
      this.selectedPageIndex++;
      this.initializeFormsByPageIndex();
    }
  }

  deleteUserPublicationData(arrIndex: number) {
    this.userService.deletePublicationsInfoById(this.userPublicationsList[arrIndex].publication_id).subscribe(
      dataJson => {
        this.userPublicationsList.splice(arrIndex, 1);
        this.removePublicationFormGroup(arrIndex);
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

  /**
   * External Resource Information Form
   */

  initExternalResourcesForm() {
    this.externalResourcesForm = new FormGroup({});
    this.externalResourcesList = [];
    this.externalResourcesDataList = [];

    this.externalResources.forEach((resource, index) => {
      this.externalResourcesForm.addControl(resource, new FormControl(''));
      this.externalResourcesForm.get(resource).valueChanges.subscribe(
        (link) => {
          this.onExternalResourceValueChange(resource, index, link);
        }
      );
      this.externalResourcesDataList.push({
        link: null,
        description: resource
      });
    });
  }

  onExternalResourceValueChange(resource: string, arrIndex: number, link: string) {
    if (this.externalResourcesDataList[arrIndex].description === resource) {
      this.externalResourcesDataList[arrIndex] .link = link ? this.helperService.checkSpacesString(link) : null;
    }
  }

  updateExternalResourceFormGroup() {
    this.externalResourcesList.forEach((resource) => {
      this.externalResourcesForm.get(resource.description).setValue(resource.link);
    });
  }

  getExternalResourceList() {
    this.userService.getExternalResourcesInfo().subscribe(
      dataJson => {
        this.externalResourcesList = dataJson['data'];
        this.updateExternalResourceFormGroup();
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
        this.externalResourcesList = [];
      }
    );
  }

  updateExternalResourceData() {
    let counts = 0;
    const temp = [];
    const newDataList = [];
    this.externalResourcesDataList.forEach((resource) => {
      const exteralResource = this.externalResourcesList.filter(value => value.description === resource.description);
      if (exteralResource.length > 0) {
        if (resource.link) {
          this.userService.patchExternalResourcesById(resource, exteralResource[0].resource_id).subscribe(
            dataJson => {
              temp.push(dataJson['data']);
              counts++;
              if (counts === this.externalResourcesDataList.length) {
                this.externalResourcesList = temp;
                this.selectedPageIndex++;
                this.initializeFormsByPageIndex();
              }
            },
            error => {
              this.alertsService.show(error.message, AlertType.error);
            }
          );
        } else {
          this.userService.deleteExternalResourcesById(exteralResource[0].resource_id).subscribe(
            dataJson => {
              counts++;
              if (counts === this.externalResourcesDataList.length) {
                this.externalResourcesList = temp;
                this.selectedPageIndex++;
                this.initializeFormsByPageIndex();
              }
            },
            error => {
              this.alertsService.show(error.message, AlertType.error);
            }
          );
        }
      } else {
        if (resource.link) {
          newDataList.push(resource);
        } else {
          counts++;
          if (counts === this.externalResourcesDataList.length) {
            this.externalResourcesList = temp;
            this.selectedPageIndex++;
            this.initializeFormsByPageIndex();
          }
        }
      }
    });
    if (newDataList.length > 0) {
      this.userService.postExternalResourcesInfo(newDataList).subscribe(
        dataJson => {
          temp.concat(dataJson['data']);
          counts = counts + newDataList.length;
          if (counts === this.externalResourcesDataList.length) {
            this.externalResourcesList = temp;
            this.selectedPageIndex++;
            this.initializeFormsByPageIndex();
          }
        },
        error => {
          this.alertsService.show(error.message, AlertType.error);
        }
      );
    }
  }


  /**
   * Profile Status Page
   */
  initProfileStatus() {
    this.profile_status = 0;
  }

  updateProfileStatus() {
    this.profile_status = this.generalInfoResponse.is_looking;
  }

  setProfileStatus(is_looking: number) {
    this.generalInfoRequest.is_looking = is_looking;
    this.updateGeneralInfo();
  }

}
