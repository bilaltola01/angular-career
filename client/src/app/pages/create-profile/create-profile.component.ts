import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import {MatDatepicker} from '@angular/material/datepicker';
import { AutoCompleteService } from 'src/app/services/auto-complete.service';
import { UserService } from 'src/app/services/user.service';
import { AlertsService, AlertType } from 'src/app/services/alerts.service';
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
  ExternalResources
} from 'src/app/models';
import moment from 'moment';

@Component({
  selector: 'app-create-profile',
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

  statuses = [
    'Exploring Opportunities',
    'Actively Looking For Job'
  ];

  externalResources = ExternalResources;

  profile_status = this.statuses[0];

  selectedPageIndex = 0;

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

  constructor(private router: Router, private autoCompleteService: AutoCompleteService, private userService: UserService, private alertsService: AlertsService) { }

  ngOnInit() {
    this.initBasicInfoForm();
    this.initEducationFormArray();
    this.initAboutMeForm();
    this.initExperienceFormArray();
    this.initSkillsAndInterestsForm();
    this.initProjectsFormArray();
    this.initPublicationsFormArray();
    this.initExternalResourcesForm();

    this.getGeneralInfo();
    this.getEducationList();
    this.getExperienceList();
    this.getUserSkillsList();
    this.getUserInterestsList();
    this.getUserProjectsList();
    this.getUserPublicationsList();
    this.getExternalResourceList();
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

    // if (this.selectedPageIndex < this.profileCreationPages.length - 1) {
    //   this.selectedPageIndex++;
    // } else {
    //   this.selectedPageIndex = 0;
    // }
  }

  goToPage(index: number) {
    this.selectedPageIndex = index;
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

  setProfileStatus(is_looking: number) {
    this.profile_status = this.statuses[is_looking];
    this.generalInfoRequest.is_looking = is_looking;
  }

  blurSkillSearchField(type: string, index: number) {
    switch (type) {
      case 'skill_trained':
        this.workExperienceFormArray.controls[index]['controls']['skills_trained'].setValue('');
        this.autocomplete_skills = [];
        break;
      case 'additional_exposure':
        this.workExperienceFormArray.controls[index]['controls']['additional_exposure'].setValue('');
        this.autocomplete_skills = [];
        break;
      case 'skills':
        this.skillsAndInterestsForm.controls.skills.setValue('');
        this.autocomplete_skills = [];
        break;
      case 'interests':
        this.skillsAndInterestsForm.controls.interests.setValue('');
        this.autocomplete_interests = [];
        break;
      default:
        break;
    }
  }




  // Basic Information Form
  initBasicInfoForm() {
    this.autocomplete_cities = [];
    this.autocomplete_states = [];

    this.generalInfoResponse = null;
    this.generalInfoRequest = null;

    this.basicInfoForm = new FormGroup({
      basicInfoCity: new FormControl('', [Validators.required]),
      basicInfoState: new FormControl('', [Validators.required]),
      basicInfoCountry: new FormControl('', [Validators.required]),
      basicInfoBirth: new FormControl(''),
      basicInfoGender: new FormControl('', [Validators.required]),
      basicInfoEthnicity: new FormControl('', [Validators.required])
    });

    this.basicInfoForm.controls.basicInfoCity.valueChanges.subscribe((city) => {
      city ? this.onCityValueChanges(city) : this.autocomplete_cities = [];
    });
    this.basicInfoForm.controls.basicInfoState.valueChanges.subscribe((state) => {
      state ? this.onStateValueChanges(state) : this.autocomplete_states = [];
    });
    this.basicInfoForm.controls.basicInfoCountry.valueChanges.subscribe(
      (country) => {
        this.onCountryValueChanges(country);
      }
    );
    this.basicInfoForm.controls.basicInfoGender.valueChanges.subscribe(
      (gender) => {
        this.onGenderValueChanges(gender);
      }
    );
    this.basicInfoForm.controls.basicInfoBirth.valueChanges.subscribe(
      (date) => {
        this.generalInfoRequest.birthdate = date ? date : null;
      }
    );
    this.basicInfoForm.controls.basicInfoEthnicity.valueChanges.subscribe(
      (ethnicity) => {
        this.onEthnicityValueChanges(ethnicity);
      }
    );
  }

  updateBasicInformationForm() {
    this.updateGeneralInfoRequest();
    this.basicInfoForm.controls.basicInfoCity.setValue(this.generalInfoResponse.city);
    this.basicInfoForm.controls.basicInfoState.setValue(this.generalInfoResponse.state);
    this.basicInfoForm.controls.basicInfoCountry.setValue(this.generalInfoResponse.country);
    this.basicInfoForm.controls.basicInfoGender.setValue(this.generalInfoResponse.gender);
    this.basicInfoForm.controls.basicInfoBirth.setValue(this.generalInfoResponse.birthdate ? this.extractDate(this.generalInfoResponse.birthdate) : '');
    this.basicInfoForm.controls.basicInfoEthnicity.setValue(this.generalInfoResponse.ethnicity);
    this.aboutMeForm.controls.aboutMe.setValue(this.generalInfoResponse.user_intro);
  }

  updateGeneralInfoRequest() {
    this.generalInfoRequest = {
      photo: this.generalInfoResponse.photo ? this.generalInfoResponse.photo : null,
      first_name: this.generalInfoResponse.first_name,
      last_name: this.generalInfoResponse.last_name,
      birthdate: this.generalInfoResponse.birthdate ? new Date(this.generalInfoResponse.birthdate) : null,
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
  onChangeBirthDate(date: any) {
    if (date.value) {
      const dateValue = new Date(date.value);
      this.basicInfoForm.controls.basicInfoBirth.setValue(moment(dateValue).format('MM/DD/YYYY'));
    } else {
      this.basicInfoForm.controls.basicInfoBirth.setValue('');
    }
  }
  onEthnicityValueChanges(ethnicity: string) {
    this.generalInfoRequest.ethnicity = ethnicity;
  }
  onGenderValueChanges(gender: string) {
    this.generalInfoRequest.gender = gender;
  }
  onCountryValueChanges(country: string) {
    this.generalInfoRequest.country_id = Countries.indexOf(country) + 1;
  }
  onSelectCity(city: City) {
    this.generalInfoRequest.city_id = city.city_id;
    this.temp_city = city;
  }
  onBlurCity() {
    if (this.temp_city) {
      if (this.basicInfoForm.controls.basicInfoCity.value !== this.getCityNameFromAutoComplete(this.temp_city.city)) {
        this.clearCity();
        this.temp_city = null;
      }
    } else {
      if (this.basicInfoForm.controls.basicInfoCity.value !== this.generalInfoResponse.city) {
        this.clearCity();
      }
    }
  }
  onCheckCityValidation(): boolean {
    let valid = false;
    if (this.temp_city) {
      valid = this.basicInfoForm.controls.basicInfoCity.value === this.getCityNameFromAutoComplete(this.temp_city.city);
    } else {
      valid = this.basicInfoForm.controls.basicInfoCity.value === this.generalInfoResponse.city;
    }
    return valid;
  }
  getCityNameFromAutoComplete(cityValue: string) {
    let city;
    if (cityValue.includes(', ')) {
      city = cityValue.split(', ')[0];
    }
    return city;
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
      if (this.basicInfoForm.controls.basicInfoState.value !== this.temp_state.state) {
        this.clearState();
        this.temp_state = null;
      }
    } else {
      if (this.basicInfoForm.controls.basicInfoState.value !== this.generalInfoResponse.state) {
        this.clearState();
      }
    }
  }
  onCheckStateValidation(): boolean {
    let valid = false;
    if (this.temp_state) {
      valid = this.basicInfoForm.controls.basicInfoState.value === this.temp_state.state;
    } else {
      valid = this.basicInfoForm.controls.basicInfoState.value === this.generalInfoResponse.state;
    }
    return valid;
  }
  clearState() {
    this.generalInfoRequest.state_id = null;
  }



  // About Me Form
  initAboutMeForm() {
    this.aboutMeForm = new FormGroup({
      aboutMe: new FormControl('', [Validators.required])
    });
  }
  updateAboutMeForm() {
    this.aboutMeForm.controls.aboutMe.setValue(this.generalInfoResponse.user_intro ? this.generalInfoResponse.user_intro : '');
    this.aboutMeForm.controls.aboutMe.valueChanges.subscribe(
      (aboutMe) => {
        this.onAboutMeValueChanges(aboutMe);
      }
    );
  }
  onAboutMeValueChanges(aboutMe: string) {
    this.generalInfoRequest.user_intro = aboutMe;
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
    this.prevent_skills_autocomplete = false;
    this.prevent_interets_autocomplete = false;
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
    if (this.educationFormArray.valid && this.checkAllMajorValidation()) {
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
      start_date: new FormControl(education && education.start_date ? this.extractYear(education.start_date) : '', [Validators.required]),
      graduation_date: new FormControl(education && education.graduation_date ? this.extractYear(education.graduation_date) : '', [Validators.required]),
      description: new FormControl(education ? education.edu_desc : '')
    });

    this.educationDataList.push(eduactionData);

    const arrIndex = this.educationDataList.length - 1;

    educationForm.controls.university.valueChanges.subscribe(
      (university) => {
        if (university) {
          this.onUniversityValueChanges(university, arrIndex);
        } else {
          this.autocomplete_universities[arrIndex] = [];
          this.onSelectSpecificUniversity(arrIndex, null);
        }
      }
    );
    educationForm.controls.degree.valueChanges.subscribe(
      (degree) => {
        this.onDegreeValueChanges(degree, arrIndex);
      }
    );
    educationForm.controls.start_date.valueChanges.subscribe(
      (start_date) => {
        this.educationDataList[arrIndex].start_date = start_date ? moment(start_date, 'YYYY') : null ;
      }
    );
    educationForm.controls.graduation_date.valueChanges.subscribe(
      (graduation_date) => {
        this.educationDataList[arrIndex].graduation_date = graduation_date ? moment(graduation_date, 'YYYY') : null ;
      }
    );
    educationForm.controls.major.valueChanges.subscribe(
      (major) => {
        major ? this.onMajorValueChanges(major, arrIndex) : this.autocomplete_majors[arrIndex] = [];
      }
    );
    educationForm.controls.focus_major.valueChanges.subscribe(
      (focus_major) => {
        focus_major ? this.onMajorValueChanges(focus_major, arrIndex, true) : this.autocomplete_focus_majors[arrIndex] = [];
      }
    );
    educationForm.controls.description.valueChanges.subscribe(
      (description) => {
        this.onDescriptionValueChange(arrIndex, description);
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
  onDegreeValueChanges(degree: string, index: number) {
    const filter = this.degrees.filter(value => value.education_level === degree);
    if (filter.length > 0) {
      this.educationDataList[index].level_id = filter[0].level_id;
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
      if (this.educationFormArray.controls[index]['controls'].university.value !== this.temp_university[index].school_name) {
        this.onSelectSpecificUniversity(index, this.educationFormArray.controls[index]['controls'].university.value);
        this.temp_university[index] = null;
      }
    } else {
      this.onSelectSpecificUniversity(index, this.educationFormArray.controls[index]['controls'].university.value);
    }
  }

  onSelectMajor(index: number, major: Major) {
    this.educationDataList[index].major_id = major.major_id;
    this.temp_major[index] = major;
  }
  onBlurMajor(index: number) {
    if (this.temp_major[index]) {
      if (this.educationFormArray.controls[index]['controls'].major.value !== this.temp_major[index].major_name) {
        this.temp_major[index] = null;
        this.clearMajor(index);
      }
    } else {
      if (!this.educationList[index] || (this.educationList[index] && this.educationFormArray.controls[index]['controls'].major.value !== this.educationList[index].major_name)) {
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
      if (this.temp_focus_major[arrIndex]) {
        return (this.educationFormArray.controls[arrIndex]['controls'].focus_major.value === this.temp_focus_major[arrIndex].major_name) ? true : false;
      } else {
        if (this.educationFormArray.controls[arrIndex]['controls'].focus_major.value) {
          return (this.educationList[arrIndex] && this.educationFormArray.controls[arrIndex]['controls'].focus_major.value === this.educationList[arrIndex].focus_major_name) ? true : false;
        } else {
          return true;
        }
      }
    } else {
      if (this.temp_major[arrIndex]) {
        return (this.educationFormArray.controls[arrIndex]['controls'].major.value === this.temp_major[arrIndex].major_name) ? true : false;
      } else {
        if (this.educationFormArray.controls[arrIndex]['controls'].major.value) {
          return (this.educationList[arrIndex] && this.educationFormArray.controls[arrIndex]['controls'].major.value === this.educationList[arrIndex].major_name) ? true : false;
        } else {
          return true;
        }
      }
    }
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
      if (this.educationFormArray.controls[index]['controls'].focus_major.value !== this.temp_focus_major[index].major_name) {
        this.temp_focus_major[index] = null;
        this.clearFocusMajor(index);
      }
    } else {
      if (!this.educationList[index] || (this.educationList[index] && this.educationFormArray.controls[index]['controls'].focus_major.value !== this.educationList[index].focus_major_name)) {
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
    this.educationFormArray.controls[index]['controls'][isStartDate ? 'start_date' : 'graduation_date'].setValue(moment(dateValue).format('YYYY'));
  }
  isExistStartDate(index: number): boolean {
    if (this.educationFormArray.controls[index]['controls']['start_date'].value) {
      return true;
    } else {
      return false;
    }
  }
  minEduGraduationDate(index: number): Date {
    return this.educationDataList[index].start_date;
  }
  onDescriptionValueChange(index: number, description: string) {
    this.educationDataList[index].edu_desc = description;
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

    const arrIndex = this.experienceDataList.length - 1;

    const workExperienceForm = new FormGroup({
      company_name: new FormControl(experience ? (experience.company_id ? experience.company_name : experience.user_specified_company_name) : '', [Validators.required]),
      start_date: new FormControl(experience && experience.start_date ? this.extractYearAndMonth(experience.start_date) : '', [Validators.required]),
      end_date: new FormControl(experience && experience.end_date ? this.extractYearAndMonth(experience.end_date) : ''),
      job: new FormControl(experience ? experience.job : '', [Validators.required]),
      description: new FormControl(experience ? experience.job_desc : ''),
      skills_trained: new FormControl(''),
      additional_industries: new FormControl('')
    });

    workExperienceForm.controls.company_name.valueChanges.subscribe(
      (company_name) => {
        if (company_name) {
          this.onCompanyValueChanges(company_name, arrIndex);
        } else {
          this.autocomplete_companies[arrIndex] = [];
          this.onSelectSpecificCompany(arrIndex, null);
        }
      }
    );
    workExperienceForm.controls.start_date.valueChanges.subscribe(
      (start_date) => {
        this.experienceDataList[arrIndex].start_date = start_date ? moment(start_date, 'MM/YYYY') : null ;
      }
    );
    workExperienceForm.controls.end_date.valueChanges.subscribe(
      (end_date) => {
        this.experienceDataList[arrIndex].end_date = end_date ? moment(end_date, 'MM/YYYY') : null ;
      }
    );
    workExperienceForm.controls.job.valueChanges.subscribe(
      (position) => {
        this.onPositionValueChange(arrIndex, position);
      }
    );
    workExperienceForm.controls.description.valueChanges.subscribe(
      (description) => {
        this.onExpDescValueChange(arrIndex, description);
      }
    );

    workExperienceForm.controls.skills_trained.valueChanges.subscribe(
      (skill) => {
        skill ? this.onSkillTrainedValueChanges(skill, arrIndex) : this.autocomplete_skills_trained[arrIndex] = [];
      }
    );
    workExperienceForm.controls.additional_industries.valueChanges.subscribe(
      (industry) => {
        industry ? this.onAdditionalIndustryValueChanges(industry, arrIndex) : this.autocomplete_additional_industries[arrIndex] = [];
      }
    );

    this.workExperienceFormArray.push(workExperienceForm);
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
      if (this.workExperienceFormArray.controls[index]['controls'].company_name.value !== this.temp_company[index].company_name) {
        this.onSelectSpecificCompany(index, this.workExperienceFormArray.controls[index]['controls'].company_name.value);
        this.temp_company[index] = null;
      }
    } else {
      this.onSelectSpecificCompany(index, this.workExperienceFormArray.controls[index]['controls'].company.value);
    }
  }
  onExperienceYearSelect(date: any, index: number, isStartDate: boolean = true) {
    // const dateValue = new Date(date);
    // this.workExperienceFormArray.controls[index]['controls'][isStartDate ? 'start_date' : 'end_date'].setValue(moment(dateValue).format('MM/YYYY'));
    // this.experienceDataList[index][isStartDate ? 'start_date' : 'end_date'] = dateValue;
  }
  onExperienceMonthSelect(date: any, index: number, isStartDate: boolean = true, datePicker: MatDatepicker<any>) {
    const dateValue = new Date(date);
    datePicker.close();
    this.workExperienceFormArray.controls[index]['controls'][isStartDate ? 'start_date' : 'end_date'].setValue(moment(dateValue).format('MM/YYYY'));
    // this.experienceDataList[index][isStartDate ? 'start_date' : 'end_date'] = dateValue;
  }
  isExperienceStartDate(index: number): boolean {
    if (this.workExperienceFormArray.controls[index]['controls']['start_date'].value) {
      return true;
    } else {
      return false;
    }
  }
  minExperienceEndDate(index: number): Date {
    return this.experienceDataList[index].start_date;
  }

  onPositionValueChange(index: number, job: string) {
    this.experienceDataList[index].job = job;
  }

  onExpDescValueChange(index: number, job_desc: string) {
    this.experienceDataList[index].job_desc = job_desc;
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
      this.workExperienceFormArray.controls[index]['controls']['skills_trained'].setValue('');
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
      this.workExperienceFormArray.controls[index]['controls']['additional_industries'].setValue('');
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




  // Skills And Interests Form
  initSkillsAndInterestsForm() {
    this.autocomplete_skills = [];
    this.autocomplete_interests = [];
    this.userSkillsList = [];
    this.userInterestsList = [];

    this.skillsAndInterestsForm = new FormGroup({
      skills: new FormControl(''),
      interests: new FormControl('')
    });

    this.skillsAndInterestsForm.controls.skills.valueChanges.subscribe(
      (skill) => {
        skill ? this.onSkillValueChanges(skill) : this.autocomplete_skills = [];
      }
    );

    this.skillsAndInterestsForm.controls.interests.valueChanges.subscribe(
      (interest) => {
        interest ? this.onInterestValueChanges(interest) : this.autocomplete_interests = [];
      }
    );
  }
  onSkillValueChanges(skill: string) {
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
  }
  onInterestValueChanges(interest: string) {
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
  }
  addSkills(skillItem: Skill) {
    const skillItemData = {
      skill_id: skillItem.skill_id,
      skill: skillItem.skill,
      skill_level: 1
    };
    if (this.userSkillsList.filter(value => value.skill_id === skillItemData.skill_id).length === 0) {
      this.addUserSkillsData(skillItemData);
    }
    this.skillsAndInterestsForm.controls.skills.setValue('');
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
  getUserSkillsList() {
    this.userService.getSkillsInfo().subscribe(
      dataJson => {
        console.log('userSkills_List', this.userSkillsList);
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
        console.log(dataJson['data']);
        this.userSkillsList[arrIndex] = dataJson['data'];
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }
  addUserSkillsData(userSkillItem: UserSkillItem) {
    this.userService.postSkillInfo(userSkillItem).subscribe(
      dataJson => {
        console.log(dataJson['data']);
        this.userSkillsList.push(dataJson['data']);
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }
  removeUserSkillsData(index: number, userSkillItem: UserSkillItem) {
    this.userService.deleteSkillInfoById(userSkillItem.skill_id).subscribe(
      dataJson => {
        console.log(dataJson['data']);
        this.userSkillsList.splice(index, 1);
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
    this.skillsAndInterestsForm.controls.interests.setValue('');
    this.prevent_interets_autocomplete = true;
  }
  getUserInterestsList() {
    this.userService.getUserInterestsInfo().subscribe(
      dataJson => {
        console.log('userInterests_List', this.userInterestsList);
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
        console.log(dataJson['data']);
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
        console.log(dataJson['data']);
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
      date_finished: new FormControl((project && project.date_finished) ? this.extractDate(project.date_finished) : ''),
      description: new FormControl(project ? project.description : ''),
      href: new FormControl(project ? project.href : '')
    });
    projectFormGroup.controls.project_name.valueChanges.subscribe(
      (project_name) => {
        this.onProjectNameValueChange(arrIndex, project_name);
      }
    );
    projectFormGroup.controls.description.valueChanges.subscribe(
      (description) => {
        this.onProjectDescriptionValueChange(arrIndex, description);
      }
    );
    projectFormGroup.controls.date_finished.valueChanges.subscribe(
      (date_finished) => {
        this.onProjectDateFinishedValueChange(arrIndex, date_finished);
      }
    );
    projectFormGroup.controls.href.valueChanges.subscribe(
      (href) => {
        this.onProjectHrefValueChange(arrIndex, href);
      }
    );
    this.projectsFormArray.push(projectFormGroup);
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
  onProjectNameValueChange(arrIndex: number, project_name: string) {
    this.userProjectsDataList[arrIndex].project_name = project_name;
  }
  onProjectDescriptionValueChange(arrIndex: number, description: string) {
    this.userProjectsDataList[arrIndex].description = description;
  }
  onProjectDateFinishedValueChange(arrIndex: number, date_finished: string) {
    this.userProjectsDataList[arrIndex].date_finished = date_finished ? date_finished : null;
  }
  onProjectHrefValueChange(arrIndex: number, href: string) {
    this.userProjectsDataList[arrIndex].href = href;
  }
  onChangeProjectFinishedDate(event: any, arrIndex: number) {
    if (event.value) {
      const dateValue = new Date(event.value);
      this.projectsFormArray.controls[arrIndex]['controls']['date_finished'].setValue(moment(dateValue).format('MM/DD/YYYY'));
    } else {
      this.projectsFormArray.controls[arrIndex]['controls']['date_finished'].setValue('');
    }
  }
  getUserProjectsList() {
    this.userService.getProjectsInfo().subscribe(
      dataJson => {
        this.userProjectsList = dataJson['data']['data'];
        this.updateProjectsFormArray();
        console.log('UserProjects_List', this.userProjectsList);
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
      let counts = 0;
      this.userProjectsDataList.forEach((project, index) => {
        if (index < this.userProjectsList.length) {
          this.userService.patchProjectInfoById(project, this.userProjectsList[index].project_id).subscribe(
            dataJson => {
              this.userProjectsList[index] = dataJson['data'];
              counts++;
              if (counts === this.userProjectsDataList.length) {
                this.selectedPageIndex++;
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
    }
  }
  deleteUserProjectData(arrIndex: number) {
    this.userService.deleteProjectInfoById(this.userProjectsList[arrIndex].project_id).subscribe(
      dataJson => {
        console.log('Delete Education_List', dataJson);
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
      date_published: new FormControl(publication && publication.date_published ? this.extractDate(publication.date_published) : ''),
      description: new FormControl(publication ? publication.description : ''),
      href: new FormControl(publication ? publication.href : '')
    });
    publicationFormGroup.controls.publication_name.valueChanges.subscribe(
      (publication_title) => {
        this.onPublicationNameValueChange(arrIndex, publication_title);
      }
    );
    publicationFormGroup.controls.description.valueChanges.subscribe(
      (description) => {
        this.onPublicationDescriptionValueChange(arrIndex, description);
      }
    );
    publicationFormGroup.controls.date_published.valueChanges.subscribe(
      (date_published) => {
        this.onPublicationDatePublishedValueChange(arrIndex, date_published);
      }
    );
    publicationFormGroup.controls.href.valueChanges.subscribe(
      (href) => {
        this.onPublicationHrefValueChange(arrIndex, href);
      }
    );
    this.publicationsFormArray.push(publicationFormGroup);
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
  onPublicationNameValueChange(arrIndex: number, publication_title: string) {
    this.userPublicationsDataList[arrIndex].publication_title = publication_title;
  }
  onPublicationDescriptionValueChange(arrIndex: number, description: string) {
    this.userPublicationsDataList[arrIndex].description = description;
  }
  onPublicationDatePublishedValueChange(arrIndex: number, date_published: string) {
    this.userPublicationsDataList[arrIndex].date_published = date_published ? date_published : null;
  }
  onPublicationHrefValueChange(arrIndex: number, href: string) {
    this.userPublicationsDataList[arrIndex].href = href;
  }
  onPublicationPublisherValueChange(arrIndex: number, publisher: string) {
    this.userPublicationsDataList[arrIndex].publisher = publisher;
  }
  onChangeDatePublished(event: any, arrIndex: number) {
    if (event.value) {
      const dateValue = new Date(event.value);
      this.publicationsFormArray.controls[arrIndex]['controls']['date_published'].setValue(moment(dateValue).format('MM/DD/YYYY'));
    } else {
      this.publicationsFormArray.controls[arrIndex]['controls']['date_published'].setValue('');
    }
  }
  getUserPublicationsList() {
    this.userService.getPublicationsInfo().subscribe(
      dataJson => {
        this.userPublicationsList = dataJson['data'];
        this.updatePublicationsFormArray();
        console.log('uesrPublications_list', this.userPublicationsList);
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
    }
  }
  deleteUserPublicationData(arrIndex: number) {
    this.userService.deletePublicationsInfoById(this.userPublicationsList[arrIndex].publication_id).subscribe(
      dataJson => {
        console.log('Delete Education_List', dataJson);
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
      this.externalResourcesForm.controls[resource].valueChanges.subscribe(
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
      this.externalResourcesDataList[arrIndex] .link = link ? link : null;
    }
  }
  updateExternalResourceFormGroup() {
    this.externalResourcesList.forEach((resource) => {
      this.externalResourcesForm.controls[resource.description].setValue(resource.link);
    });
  }

  getExternalResourceList() {
    this.userService.getExternalResourcesInfo().subscribe(
      dataJson => {
        this.externalResourcesList = dataJson['data'];
        this.updateExternalResourceFormGroup();
        console.log('ExternalResource_List', this.externalResourcesList);
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
          this.userService.patchExternalResourcesById(resource, exteralResource[0].resources_id).subscribe(
            dataJson => {
              console.log(dataJson['data']);
              temp.push(dataJson['data']);
              counts++;
              if (counts === this.externalResourcesDataList.length) {
                this.externalResourcesList = temp;
                this.selectedPageIndex++;
              }
            },
            error => {
              this.alertsService.show(error.message, AlertType.error);
            }
          );
        } else {
          this.userService.deleteExternalResourcesById(exteralResource[0].resources_id).subscribe(
            dataJson => {
              console.log(dataJson['data']);
              counts++;
              if (counts === this.externalResourcesDataList.length) {
                this.externalResourcesList = temp;
                this.selectedPageIndex++;
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
          }
        }
      }
    });
    if (newDataList.length > 0) {
      this.userService.postExternalResourcesInfo(newDataList).subscribe(
        dataJson => {
          console.log(dataJson['data']);
          temp.concat(dataJson['data']);
          counts = counts + newDataList.length;
          if (counts === this.externalResourcesDataList.length) {
            this.externalResourcesList = temp;
            this.selectedPageIndex++;
          }
        },
        error => {
          this.alertsService.show(error.message, AlertType.error);
        }
      );
    }
  }

  // Get AutoComplete lists

  onCityValueChanges(city: string) {
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
  }

  onStateValueChanges(state: string) {
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
  }

  onUniversityValueChanges(school: string, arrIndex: number) {
    this.autoCompleteService.autoComplete(school, 'schools').subscribe(
      dataJson => {
        if (dataJson['success']) {
          this.autocomplete_universities[arrIndex] = dataJson['data'];
          if (this.autocomplete_universities[arrIndex].length === 0) {
            this.onSelectSpecificUniversity(arrIndex, school);
          }
        }
      },
      error => {
        this.autocomplete_universities[arrIndex] = [];
        this.alertsService.show(error.message, AlertType.error);
      }
    );
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

  onCompanyValueChanges(company: string, arrIndex: number) {
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
        this.autocomplete_universities[arrIndex] = [];
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }
  onSkillTrainedValueChanges(skill: string, arrIndex: number) {
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
  }
  onAdditionalIndustryValueChanges(industry: string, arrIndex: number) {
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
  }


  // General Information

  getGeneralInfo() {
    this.userService.getGeneralInfo().subscribe(
      dataJson => {
        console.log('Gernal_Information', dataJson['data']);
        this.generalInfoResponse = dataJson['data'];
        this.updateBasicInformationForm();
        this.updateAboutMeForm();
        this.setProfileStatus(this.generalInfoResponse.is_looking);
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

  updateGeneralInfo() {
    if ((this.selectedPageIndex === 1 && this.basicInfoForm.valid && this.onCheckCityValidation() && this.onCheckStateValidation()) || (this.selectedPageIndex === 2 && this.aboutMeForm.valid)) {
      this.userService.updateGeneralInfo(this.generalInfoRequest).subscribe(
        dataJson => {
          this.generalInfoResponse = dataJson['data'];
          switch (this.selectedPageIndex) {
            case 1:
              this.updateBasicInformationForm();
              this.alertsService.show('General information has been updated Successfully!', AlertType.success);
              break;
            case 2:
              this.updateAboutMeForm();
              this.alertsService.show('Introduction information has been updated Successfully!', AlertType.success);
              break;
            default:
              break;
          }
          this.selectedPageIndex++;
        },
        error => {
          this.alertsService.show(error.message, AlertType.error);
        }
      );
    }
  }

  // Education Information

  getEducationList() {
    this.userService.getEducationInfo().subscribe(
      dataJson => {
        this.educationList = dataJson['data'];
        console.log('Education_List', this.educationList);
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
    }
  }

  deleteEducationData(index: number) {
    this.userService.deleteEducationInfoById(this.educationList[index].education_id).subscribe(
      dataJson => {
        console.log('Delete Education_List', dataJson);
        this.educationList.splice(index, 1);
        this.removeEducationFormGroup(index);
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

  /**
   *
   * Services for Work Experinece Information
   * getExperienceList()
   * updateExperienceData()
   * deleteExperienceData()
   *
   */
  getExperienceList() {
    this.userService.getExperienceInfo().subscribe(
      dataJson => {
        this.experienceList = dataJson['data'];
        console.log('Experience_List', this.experienceList);
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
    }
  }
  deleteExperienceData(index: number) {
    this.userService.deleteExperienceInfoById(this.experienceList[index].work_hist_id).subscribe(
      dataJson => {
        console.log('Delete Education_List', dataJson);
        this.experienceList.splice(index, 1);
        this.removeExperienceFormGroup(index);
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

}
