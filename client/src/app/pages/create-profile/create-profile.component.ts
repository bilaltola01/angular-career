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
} from 'src/app/models';

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
  externalLinksForm: FormGroup;

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

  statuses = [
    'Exploring Opportunities',
    'Actively Looking For Job'
  ];

  profile_status = this.statuses[0];

  selectedPageIndex = 4;

  generalInfoResponse: UserGeneralInfo;
  generalInfoRequest: UserObject;
  educationList: UserEducationItem[];
  educationDataList: UserEducationItemData[];
  experienceList: UserExperienceItem[];
  experienceDataList: UserExperienceItemData[];
  userSkillsList: UserSkillItem[];
  userSkillsDataList: UserSkillItem[];
  userInterestsList: UserInterestItem[];
  userInterestsDataList: UserInterestItem[];
  userProjectsList: UserProjectItem[];
  userProjectsDataList: UserProjectItemData[];
  userPublicationsList: UserPublicationItem[];
  userPublicationsDataList: UserPublicationItemData[];

  constructor(private router: Router, private autoCompleteService: AutoCompleteService, private userService: UserService, private alertsService: AlertsService) { }

  ngOnInit() {
    this.initBasicInfoForm();
    this.initEducationFormArray();
    this.initAboutMeForm();
    this.initExperienceFormArray();
    this.initSkillsAndInterestsForm();
    this.initProjectsFormArray();
    this.initPublicationsFormArray();
    this.initExternalLinksForm();

    this.getGeneralInfo();
    this.getEducationList();
    this.getExperienceList();
    this.getUserSkillsList();
    this.getUserInterestsList();
    this.getUserProjectsList();
    this.getUserPublicationsList();
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
        this.updateUserSkillsData();
        this.updateUserInteretsData();
        break;
      case 6:
        this.updateUserProjectsData();
        break;
      case 7:
        this.updateUserPublicationsData();
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

  formattedDate(date: Date): string {
    return date.getFullYear() + '-' + (date.getMonth() + 1 < 10 ? '0' : '') + (date.getMonth() + 1) + '-' + (date.getDate() < 10 ? '0' : '') + date.getDate();
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
        this.generalInfoRequest.birthdate = new Date(date);
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
    this.basicInfoForm.controls.basicInfoBirth.setValue(this.generalInfoResponse.birthdate ? new Date(this.generalInfoResponse.birthdate) : '');
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
      start_date: education ? new Date(education.start_date) : null,
      graduation_date: education ? new Date(education.graduation_date) : null,
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
      start_date: new FormControl(education ? new Date(education.start_date).getFullYear() : '', [Validators.required]),
      graduation_date: new FormControl(education ? new Date(education.graduation_date).getFullYear() : '', [Validators.required]),
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
    this.educationFormArray.controls[index]['controls'][isStartDate ? 'start_date' : 'graduation_date'].setValue(dateValue.getFullYear());
    this.educationDataList[index][isStartDate ? 'start_date' : 'graduation_date'] = dateValue;
  }
  isExistStartDate(index: number): boolean {
    if (this.educationFormArray.controls[index]['controls']['start_date'].value) {
      return true;
    } else {
      return false;
    }
  }
  maxEduStartDate(): Date {
    return new Date();
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
    this.skills_trained.push(experience ? experience.skills_trained : []);
    this.additional_industries.push(experience ? experience.add_industries : []);

    const experienceData = {
      company_id: experience ? experience.company_id : null,
      job: experience ? experience.job : null,
      start_date: experience ? new Date(experience.start_date) : null,
      end_date: experience ? new Date(experience.end_date) : null,
      position_name: experience ? experience.position_name : null,
      exp_desc: experience ? experience.exp_desc : null,
      user_specified_company_name: experience ? experience.user_specified_company_name : null,
      skill_ids_trained: experience && experience.skills_trained.length > 0 ? experience.skills_trained.map(x => x.skill_id) : [],
      add_industry_ids: experience && experience.add_industries.length > 0 ? experience.add_industries.map(x => x.industry_id) : [],
    };

    this.experienceDataList.push(experienceData);

    const arrIndex = this.experienceDataList.length - 1;

    const workExperienceForm = new FormGroup({
      company_name: new FormControl(experience ? experience.company_name : '', [Validators.required]),
      start_date: new FormControl(experience ? new Date(experience.start_date).getFullYear() : '', [Validators.required]),
      end_date: new FormControl(experience ? new Date(experience.end_date).getFullYear() : ''),
      position_name: new FormControl(experience ? experience.position_name : '', [Validators.required]),
      description: new FormControl(experience ? experience.exp_desc : ''),
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
    workExperienceForm.controls.position_name.valueChanges.subscribe(
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
  onExperienceYearSelect(date: any, index: number, isStartDate: boolean = true, datePicker: MatDatepicker<any>) {
    const dateValue = new Date(date);
    datePicker.close();
    this.workExperienceFormArray.controls[index]['controls'][isStartDate ? 'start_date' : 'end_date'].setValue(dateValue.getFullYear());
    this.experienceDataList[index][isStartDate ? 'start_date' : 'end_date'] = dateValue;
  }
  isExperienceStartDate(index: number): boolean {
    if (this.workExperienceFormArray.controls[index]['controls']['start_date'].value) {
      return true;
    } else {
      return false;
    }
  }
  maxExperienceStartDate(): Date {
    return new Date();
  }
  minExperienceEndDate(index: number): Date {
    return this.experienceDataList[index].start_date;
  }

  onPositionValueChange(index: number, position_name: string) {
    this.experienceDataList[index].position_name = position_name;
  }

  onExpDescValueChange(index: number, exp_desc: string) {
    this.experienceDataList[index].exp_desc = exp_desc;
  }

  addSkillsTrained(index: number, skill: Skill) {
    if (skill) {
      if (this.skills_trained[index].filter(skill_trained => skill_trained.skill_id === skill.skill_id).length === 0) {
        this.skills_trained[index].push(skill);
        this.experienceDataList[index].skill_ids_trained.push(skill.skill_id);
      }
      this.workExperienceFormArray.controls[index]['controls']['skills_trained'].setValue('');
    }
  }

  addAdditionalIndustry(index: number, industry: Industry) {
    if (industry) {
      if (this.additional_industries[index].filter(additional_industry => additional_industry.industry_id === industry.industry_id).length === 0) {
        this.additional_industries[index].push(industry);
        this.experienceDataList[index].add_industry_ids.push(industry.industry_id);
      }
      this.workExperienceFormArray.controls[index]['controls']['additional_industries'].setValue('');
    }
  }




  // Skills And Interests Form
  initSkillsAndInterestsForm() {
    this.autocomplete_skills = [];
    this.autocomplete_interests = [];
    this.userSkillsList = [];
    this.userSkillsDataList = [];
    this.userInterestsList = [];
    this.userInterestsDataList = [];

    this.skillsAndInterestsForm = new FormGroup({
      skills: new FormControl(''),
      interests: new FormControl('')
    });

    this.skillsAndInterestsForm.controls.skills.valueChanges.subscribe(
      (skill) => {
        this.onSkillValueChanges(skill);
      }
    );

    this.skillsAndInterestsForm.controls.interests.valueChanges.subscribe(
      (skill) => {
        this.onInterestValueChanges(skill);
      }
    );
  }

  addSkills(skillItem: Skill) {
    const skillItemData = {
      skill_id: skillItem.skill_id,
      skill: skillItem.skill,
      skill_level: 4
    };
    if (skillItemData) {
      if (this.userSkillsDataList.filter(value => value.skill === skillItemData.skill).length < 1) {
        this.userSkillsDataList.push(skillItemData);
      }

      this.skillsAndInterestsForm.controls.skills.setValue('');
      this.autocomplete_skills = [];
    }
  }

  addInterests(interestItem: Interest) {
    const interestItemData = {
      interest_id: interestItem.interest_id,
      interest_name: interestItem.interest
    };
    if (interestItemData) {
      if (this.userInterestsDataList.filter(value => value.interest_name === interestItem.interest).length < 1) {
        this.userInterestsDataList.push(interestItemData);
      }
      this.skillsAndInterestsForm.controls.interests.setValue('');
      this.autocomplete_interests = [];
    }
  }


  // Projects Form

  initProjectsFormArray() {
    this.projectsFormArray = new FormArray([]);
    this.userProjectsList = [];
    this.userProjectsDataList = [];
  }
  addProjectsForm(project: UserProjectItem) {
    const projectItem = {
      project_name: project ? project.project_name : null,
      description: project ? project.description : null,
      date_finished: project ? new Date(project.date_finished) : new Date(),
      href: project ? project.href : null
    };
    this.userProjectsDataList.push(projectItem);

    const arrIndex = this.userProjectsDataList.length - 1;

    const projectsForm = new FormGroup({
      project_name: new FormControl(project ? project.project_name : ''),
      years: new FormControl(project ? this.formattedDate(new Date(project.date_finished)) : ''),
      description: new FormControl(project ? project.description : '')
    });
    projectsForm.controls.project_name.valueChanges.subscribe(
      (project_name) => {
        this.onProjectNameValueChange(arrIndex, project_name);
      }
    );
    projectsForm.controls.description.valueChanges.subscribe(
      (description) => {
        this.onProjectDescriptionValueChange(arrIndex, description);
      }
    );
    projectsForm.controls.years.valueChanges.subscribe(
      (date_finished) => {
        this.onProjectDateFinishedValueChange(arrIndex, date_finished);
      }
    );
    this.projectsFormArray.push(projectsForm);
  }
  updateProjectsForm() {
    this.userProjectsList.forEach(project => {
      this.addProjectsForm(project);
    });
  }
  onProjectNameValueChange(arrIndex: number, project_name: string) {
    this.userProjectsDataList[arrIndex].project_name = project_name;
  }
  onProjectDescriptionValueChange(arrIndex: number, description: string) {
    this.userProjectsDataList[arrIndex].description = description;
  }
  onProjectDateFinishedValueChange(arrIndex: number, date_finished: string) {
    this.userProjectsDataList[arrIndex].date_finished = new Date(date_finished);
  }
  onProjectHrefValueChange(arrIndex: number, href: string) {
    this.userProjectsDataList[arrIndex].href = href;
  }

  // Publications Form

  initPublicationsFormArray() {
    this.publicationsFormArray = new FormArray([]);
    this.userPublicationsList = [];
    this.userPublicationsDataList = [];
  }

  addPublicationsForm(publication: UserPublicationItem) {
    const publicationItem = {
      publication_title: publication ? publication.publication_title : null,
      description: publication ? publication.description : null,
      date_published: publication ? new Date(publication.date_published) : new Date(),
      href: publication ? publication.href : null,
      publisher: publication ? publication.publisher : null
    };
    this.userPublicationsDataList.push(publicationItem);

    const arrIndex = this.userPublicationsDataList.length - 1;

    const publicationsForm = new FormGroup({
      publication_name: new FormControl(publication ? publication.publication_title : ''),
      years: new FormControl(publication ? this.formattedDate(new Date(publication.date_published)) : ''),
      description: new FormControl(publication ? publication.description : '')
    });
    publicationsForm.controls.publication_name.valueChanges.subscribe(
      (publication_title) => {
        this.onPublicationNameValueChange(arrIndex, publication_title);
      }
    );
    publicationsForm.controls.description.valueChanges.subscribe(
      (description) => {
        this.onPublicationDescriptionValueChange(arrIndex, description);
      }
    );
    publicationsForm.controls.years.valueChanges.subscribe(
      (date_published) => {
        this.onPublicationDatePublishedValueChange(arrIndex, date_published);
      }
    );

    this.publicationsFormArray.push(publicationsForm);
  }
  updatePublicationsForm() {
    this.userPublicationsList.forEach(publication => {
      this.addPublicationsForm(publication);
    });
  }
  onPublicationNameValueChange(arrIndex: number, publication_title: string) {
    this.userPublicationsDataList[arrIndex].publication_title = publication_title;
  }
  onPublicationDescriptionValueChange(arrIndex: number, description: string) {
    this.userPublicationsDataList[arrIndex].description = description;
  }
  onPublicationDatePublishedValueChange(arrIndex: number, date_published: string) {
    this.userPublicationsDataList[arrIndex].date_published = new Date(date_published);
  }
  onPublicationHrefValueChange(arrIndex: number, href: string) {
    this.userPublicationsDataList[arrIndex].href = href;
  }
  onPublicationPublisherValueChange(arrIndex: number, publisher: string) {
    this.userPublicationsDataList[arrIndex].publisher = publisher;
  }

  // External Links Form

  initExternalLinksForm() {
    this.externalLinksForm = new FormGroup({
      twitter_link: new FormControl(''),
      facebook_link: new FormControl(''),
      google_link: new FormControl(''),
      linkedin_link: new FormControl('')
    });
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


  onSkillValueChanges(skill: string) {
    if (skill) {
      this.autoCompleteService.autoComplete(skill, 'skills').subscribe(
        dataJson => {
          if (dataJson['success']) {
            this.autocomplete_skills = dataJson['data'];
          }
        },
        error => {
          console.log(error);
        }
      );
    } else {
      this.autocomplete_skills = [];
    }
  }

  onInterestValueChanges(interest: string) {
    if (interest) {
      this.autoCompleteService.autoComplete(interest, 'interests').subscribe(
        dataJson => {
          if (dataJson['success']) {
            this.autocomplete_interests = dataJson['data'];
          }
        },
        error => {
          console.log(error);
        }
      );
    } else {
      this.autocomplete_interests = [];
    }
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
        this.educationList.splice(index, 1);
        this.removeExperienceFormGroup(index);
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }


  // User Skills Information
  getUserSkillsList() {
    this.userService.getSkillsInfo().subscribe(
      dataJson => {
        this.userSkillsList = dataJson['data'];
        this.userSkillsDataList = [];
        this.userSkillsList.forEach(skillItem => {
          this.userSkillsDataList.push(skillItem);
        });
        console.log('userSkills_List', this.userSkillsList);
      },
      error => {
        console.log(error);
        this.userSkillsList = [];
        this.userSkillsDataList = [];
      }
    );
  }
  updateUserSkillsData() {
    this.userSkillsDataList.forEach((skillData, index) => {
      if (index < this.userSkillsList.length) {
        if (skillData.skill_level !== this.userSkillsList[index].skill_level) {
          this.userService.patchSkillInfoById(skillData.skill_id, skillData).subscribe(
            dataJson => {
              console.log(dataJson['data']);
            },
            error => console.log(error)
          );
        }
      } else {
        this.userService.postSkillInfo(skillData).subscribe(
          dataJson => {
            console.log(dataJson['data']);
          },
          error => console.log(error)
        );
      }
    });
  }


  // User Interests Information
  getUserInterestsList() {
    this.userService.getUserInterestsInfo().subscribe(
      dataJson => {
        this.userInterestsList = dataJson['data'];
        this.userInterestsDataList = [];
        this.userInterestsList.forEach(interestItem => {
          this.userInterestsDataList.push(interestItem);
        });
        console.log('userSkills_List', this.userInterestsList);
      },
      error => {
        console.log(error);
        this.userInterestsList = [];
        this.userInterestsDataList = [];
      }
    );
  }
  updateUserInteretsData() {
    this.userInterestsDataList.forEach((interestData, index) => {
      if (index > this.userInterestsList.length - 1) {
        this.userService.postUserInterestsInfo(interestData).subscribe(
          dataJson => {
            console.log(dataJson['data']);
          },
          error => console.log(error)
        );
      }
    });
  }


  // User Projects information
  getUserProjectsList() {
    this.userService.getProjectsInfo().subscribe(
      dataJson => {
        this.userProjectsList = dataJson['data']['data'];
        this.updateProjectsForm();
        console.log('userProjects_List', this.userInterestsList);
      },
      error => {
        console.log(error);
        this.initProjectsFormArray();
      }
    );
  }
  updateUserProjectsData() {
    this.userProjectsDataList.forEach((project, index) => {
      if (index < this.userProjectsList.length) {
        this.userService.patchProjectInfoById(project, this.userProjectsList[index].project_id).subscribe(
          dataJson => {
            console.log(dataJson['data']);
          },
          error => console.log(error)
        );
      } else {
        this.userService.postProjectInfo(project).subscribe(
          dataJson => {
            console.log(dataJson['data']);
          },
          error => console.log(error)
        );
      }
    });
  }




  // User Publications Information
  getUserPublicationsList() {
    this.userService.getPublicationsInfo().subscribe(
      dataJson => {
        this.userPublicationsList = dataJson['data'];
        this.updatePublicationsForm();
        console.log('uesrPublications_list', this.userPublicationsList);
      },
      error => {
        console.log(error);
        this.initPublicationsFormArray();
      }
    );
  }
  updateUserPublicationsData() {
    this.userPublicationsDataList.forEach((publication, index) => {
      if (index < this.userPublicationsList.length) {
        this.userService.patchPublicationsInfoById(publication, this.userPublicationsList[index].publication_id).subscribe(
          dataJson => {
            console.log(dataJson['data']);
          },
          error => console.log(error)
        );
      } else {
        this.userService.postPublicationsInfo(publication).subscribe(
          dataJson => {
            console.log(dataJson['data']);
          },
          error => console.log(error)
        );
      }
    });
  }

}
