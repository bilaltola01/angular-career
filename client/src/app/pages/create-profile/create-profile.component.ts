import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormArray} from '@angular/forms';
import { AutoCompleteService } from 'src/app/services/auto-complete.service';
import { UserService } from 'src/app/services/user.service';
import {
  City, School, Major, Skill, Interest,
  UserGeneralInfo, UserObject,
  UserEducationItem, UserEducationItemData,
  UserExperienceItem, UserExperienceItemData,
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

  genders = [
    'Male',
    'Female'
  ];

  skills_trained: string[][];
  additional_exposure: string[][];
  skills: object[];
  interests: string[];

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
  autocomplete_locations: City[] = [];
  autocomplete_genders: string[] = [];
  autocomplete_universities = [];
  autocomplete_skills: Skill[] = [];
  autocomplete_interests: Interest[] = [];
  autocomplete_majors: Major[] = [];
  autocomplete_companies: any[] = [];

  statuses = [
    'Actively Looking For Job',
    'Exploring Opportunities'
  ];

  profile_status = this.statuses[0];

  selectedPageIndex = 4;

  generalInfoResponse: UserGeneralInfo;
  generalInfoRequest: UserObject;
  educationList: UserEducationItem[];
  educationDataList: UserEducationItemData[];
  experienceList: UserExperienceItem[];
  experienceDataList: UserExperienceItemData[];

  constructor(private router: Router, private autoCompleteService: AutoCompleteService, private userService: UserService) { }

  ngOnInit() {
    this.initBasicInfoForm();
    this.initEducationFormArray();
    this.initAboutMeForm();
    this.initWorkExperienceFormArray();
    this.initSkillsAndInterestsForm();
    this.initProjectsFormArray();
    this.initPublicationsFormArray();
    this.initExternalLinksForm();

    this.getGeneralInfo();
    this.getEducationList();
    this.getExperienceList();
  }

  goToCreatProfilePage() {
    this.selectedPageIndex = 1;
  }

  goToNextPage() {
    switch (this.selectedPageIndex) {
      case 1:
        this.updateGeneralInfo();
        break;
      case 3:
        // this.updateEducationData();
        break;
      case 4:
        // this.updateExperienceData();
        break;
      case 5:
        break;
      case 6:
        break;
      default:
        break;
    }

    if (this.selectedPageIndex < this.profileCreationPages.length - 1) {
      this.selectedPageIndex++;
    } else {
      this.selectedPageIndex = 0;
    }
  }

  goToPage(index: number) {
    if (this.selectedPageIndex > index) {
      this.selectedPageIndex = index;
    }
  }

  formattedDate(date: Date): string {
    return date.getFullYear() + '-' + (date.getMonth() + 1 < 10 ? '0' : '') + (date.getMonth() + 1) + '-' + (date.getDate() < 10 ? '0' : '') + date.getDate();
  }

  setProfileStatus(index: number) {
    this.profile_status = this.statuses[index];
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
    this.autocomplete_locations = [];
    this.autocomplete_genders = [];

    this.generalInfoResponse = null;
    this.generalInfoRequest = null;

    this.basicInfoForm = new FormGroup({
      basicInfoLocation: new FormControl(''),
      basicInfoBirth: new FormControl(''),
      basicInfoGender: new FormControl(''),
      basicInfoEthnicity: new FormControl('')
    });

    this.basicInfoForm.controls.basicInfoLocation.valueChanges.subscribe((location) => {
      this.onLoactionValueChanges(location);
    });
    this.basicInfoForm.controls.basicInfoGender.valueChanges.subscribe(
      (gender) => {
        this.onGenderValueChanges(gender);
      }
    );
    this.basicInfoForm.controls.basicInfoBirth.valueChanges.subscribe(
      (date) => {
        this.generalInfoRequest.birthdate = date;
      }
    );
  }

  updateBasicInformationForm() {
    this.updateGeneralInfoRequest();
    const birthdate = this.generalInfoResponse.birthdate ?  this.formattedDate(new Date(this.generalInfoResponse.birthdate)) : null;

    this.basicInfoForm.controls.basicInfoGender.setValue(this.generalInfoResponse.gender);
    this.basicInfoForm.controls.basicInfoBirth.setValue(birthdate);
    this.aboutMeForm.controls.aboutMe.setValue(this.generalInfoResponse.user_intro);
  }

  updateGeneralInfoRequest() {
    const birthdate = this.generalInfoResponse.birthdate ?  this.formattedDate(new Date(this.generalInfoResponse.birthdate)) : null;

    this.generalInfoRequest = {
      photo: this.generalInfoResponse.photo ? this.generalInfoResponse.photo : null,
      first_name: this.generalInfoResponse.first_name,
      last_name: this.generalInfoResponse.last_name,
      birthdate: birthdate,
      gender: this.generalInfoResponse.gender,
      phone_num: this.generalInfoResponse.phone_num,
      recruiter: this.generalInfoResponse.recruiter,
      applicant: this.generalInfoResponse.applicant,
      city_id: this.generalInfoResponse.city_id,
      country_id: this.generalInfoResponse.country_id,
      state_id: this.generalInfoResponse.state_id,
      is_looking: 0,
      title: this.generalInfoResponse.title
    };
  }




  // About Me Form
  initAboutMeForm() {
    this.aboutMeForm = new FormGroup({
      aboutMe: new FormControl('')
    });
  }




  // Education Form
  initEducationFormArray() {
    this.educationFormArray = new FormArray([]);
    this.educationList = [];
    this.educationDataList = [];
  }

  addEducationFormGroup(education: UserEducationItem) {
    this.autocomplete_universities = [];
    this.autocomplete_majors = [];

    const eduactionData = {
      school_id: education ? education.school_id : null,
      major_id: education ? education.major_id : null,
      focus_major: education ? education.focus_major : null,
      start_date: education ? education.start_date : null,
      graduation_date: education ? education.graduation_date : null,
      gpa: education ? education.gpa : null,
      edu_desc: education ? education.edu_desc : null,
      user_specified_school_name: education ? education.user_specified_school_name : null,
      level_id: education ? education.level_id : null,
      focus_major_name: education ? education.focus_major_name : null
    };

    const educationForm = new FormGroup({
      university: new FormControl(education ? education.school_name : ''),
      degree: new FormControl(''),
      course: new FormControl(education ? education.major_name : ''),
      completion: new FormControl(education ? education.graduation_date : ''),
      description: new FormControl(education ? education.edu_desc : '')
    });

    this.educationDataList.push(eduactionData);

    const arrIndex = this.educationDataList.length - 1;

    educationForm.controls.university.valueChanges.subscribe(
      (university) => {
        this.onUniversityValueChanges(university, arrIndex);
      }
    );
    educationForm.controls.course.valueChanges.subscribe(
      (major) => {
        this.onMajorValueChanges(major);
      }
    );
    educationForm.controls.completion.valueChanges.subscribe(
      (graduation_date) => {
        this.onGraduationDateValueChange(arrIndex, graduation_date);
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
    this.educationList.forEach((education) => {
      this.addEducationFormGroup(education);
    });
  }

  onSelectDegree(index: number, degree: string) {
  }

  onSelectSpecificUniversity(index: number, university: string) {
    this.educationDataList[index].user_specified_school_name = university;
    this.educationDataList[index].school_id = null;
  }

  onSelectUniversity(index: number, university: School) {
    this.educationDataList[index].school_id = university.school_id;
    this.educationDataList[index].user_specified_school_name = null;
  }

  onSelectMajor(index: number, major: Major) {
    this.educationDataList[index].major_id = major.major_id;
  }

  onGraduationDateValueChange(index: number, graduation_date: string) {
    this.educationDataList[index].graduation_date = graduation_date;
  }

  onDescriptionValueChange(index: number, description: string) {
    this.educationDataList[index].edu_desc = description;
  }




  // Work Experience Form
  initWorkExperienceFormArray() {
    this.experienceList = [];
    this.experienceDataList = [];
    this.workExperienceFormArray = new FormArray([]);
    this.skills_trained = [];
    this.additional_exposure = [];
  }

  addWorkExperienceForm(experience: UserExperienceItem) {
    this.autocomplete_companies = [];
    this.autocomplete_skills = [];
    this.skills_trained.push(experience ? experience.skills_trained : []);
    this.additional_exposure.push(experience ? experience.industry_names : []);

    const experienceData = {
      company_id: experience ? experience.company_id : null,
      job: experience ? experience.job : null,
      start_date: experience ? experience.start_date : null,
      end_date: experience ? experience.end_date : null,
      position_name: experience ? experience.position_name : null,
      exp_desc: experience ? experience.exp_desc : null,
      user_specified_company_name: experience ? experience.user_specified_company_name : null,
      skill_ids_trained: [],
      add_industry_ids: [],
    };

    this.experienceDataList.push(experienceData);

    const arrIndex = this.experienceDataList.length - 1;

    const workExperienceForm = new FormGroup({
      company_name: new FormControl(experience ? experience.company_name : ''),
      years: new FormControl(experience ? experience.end_date : ''),
      designation: new FormControl(experience ? experience.position_name : ''),
      description: new FormControl(experience ? experience.exp_desc : ''),
      skills_trained: new FormControl(''),
      additional_exposure: new FormControl('')
    });

    workExperienceForm.controls.company_name.valueChanges.subscribe(
      (company_name) => {
        this.onCompanyValueChanges(company_name, arrIndex);
      }
    );
    workExperienceForm.controls.designation.valueChanges.subscribe(
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
        this.onSkillValueChanges(skill);
      }
    );

    workExperienceForm.controls.additional_exposure.valueChanges.subscribe(
      (skill) => {
        this.onSkillValueChanges(skill);
      }
    );

    this.workExperienceFormArray.push(workExperienceForm);
  }

  updateWorkExperienceForm() {
    this.experienceList.forEach((experience) => {
      this.addWorkExperienceForm(experience);
    });
  }

  onPositionValueChange(index: number, position_name: string) {
    this.experienceDataList[index].position_name = position_name;
  }

  onExpDescValueChange(index: number, exp_desc: string) {
    this.experienceDataList[index].exp_desc = exp_desc;
  }

  onSelectSpecificCompnay(index: number, company: string) {
    this.experienceDataList[index].company_id = null;
    this.experienceDataList[index].user_specified_company_name = company;
  }

  addSkillsTrained(index: number, skill: string) {
    if (skill) {
      if (!this.skills_trained[index].includes(skill)) {
        this.skills_trained[index].push(skill);
      }
      this.workExperienceFormArray.controls[index]['controls']['skills_trained'].setValue('');
      this.autocomplete_skills = [];
    }
  }

  addAdditionalExposure(index: number, skill: string) {
    if (skill) {
      if (!this.additional_exposure[index].includes(skill)) {
        this.additional_exposure[index].push(skill);
      }
      this.workExperienceFormArray.controls[index]['controls']['additional_exposure'].setValue('');
      this.autocomplete_skills = [];
    }
  }

  // Skills And Interests Form

  initSkillsAndInterestsForm() {
    this.autocomplete_skills = [];
    this.autocomplete_interests = [];
    this.skills = [];
    this.interests = [];

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

  addSkills(skill: string) {
    if (skill) {
      const data = {
        skill: skill,
        proficieny: 4
      };

      this.skills.filter(value => value['skill'] === skill);

      if (this.skills.filter(value => value['skill'] === skill).length < 1) {
        this.skills.push(data);
      }

      this.skillsAndInterestsForm.controls.skills.setValue('');
      this.autocomplete_skills = [];
    }
  }

  addInterests(interest: string) {
    if (interest) {
      if (!this.interests.includes(interest)) {
        this.interests.push(interest);
      }
      this.skillsAndInterestsForm.controls.interests.setValue('');
      this.autocomplete_interests = [];
    }
  }


  // Projects Form

  initProjectsFormArray() {
    this.projectsFormArray = new FormArray([]);
    this.addProjectsForm();
  }

  addProjectsForm() {
    const projectsForm = new FormGroup({
      project_name: new FormControl(''),
      years: new FormControl(''),
      description: new FormControl('')
    });

    this.projectsFormArray.push(projectsForm);
  }

  // Publications Form

  initPublicationsFormArray() {
    this.publicationsFormArray = new FormArray([]);
    this.addPublicationsForm();
  }

  addPublicationsForm() {
    const publicationsForm = new FormGroup({
      publication_name: new FormControl(''),
      years: new FormControl(''),
      description: new FormControl('')
    });

    this.publicationsFormArray.push(publicationsForm);
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

  onLoactionValueChanges(location: string) {
    this.autoCompleteService.autoComplete(location, 'cities').subscribe(
      dataJson => {
        if (dataJson['success']) {
          this.autocomplete_locations = dataJson['data'];
        } else {
          this.autocomplete_locations = [];
        }
      },
      error => {
        console.log(error);
        this.autocomplete_locations = [];
      }
    );
  }

  onGenderValueChanges(gender: string) {
    const filterValue = gender.toLowerCase();
    this.autocomplete_genders =  this.genders.filter(value => value.toLowerCase().indexOf(filterValue) === 0);
  }

  onUniversityValueChanges(school: string, arrIndex: number) {
    this.autoCompleteService.autoComplete(school, 'schools').subscribe(
      dataJson => {
        if (dataJson['success']) {
          this.autocomplete_universities = dataJson['data'];
          if (this.autocomplete_universities.length === 0) {
            this.onSelectSpecificUniversity(arrIndex, school);
          }
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  onMajorValueChanges(major: string) {
    this.autoCompleteService.autoComplete(major, 'majors').subscribe(
      dataJson => {
        if (dataJson['success']) {
          this.autocomplete_majors = dataJson['data'];
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  onCompanyValueChanges(company: string, arrIndex: number) {
    this.autoCompleteService.autoComplete(company, 'companies').subscribe(
      dataJson => {
        if (dataJson['success']) {
          this.autocomplete_companies = dataJson['data'];
          if (this.autocomplete_companies.length === 0) {
            this.onSelectSpecificCompnay(arrIndex, company);
          }
        }
      },
      error => {
        console.log(error);
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
        this.generalInfoResponse = dataJson['data'];
        this.updateBasicInformationForm();
      },
      error => console.log(error)
    );
  }

  updateGeneralInfo() {
    this.generalInfoRequest.gender = this.basicInfoForm.controls.basicInfoGender.value;

    this.userService.updateGeneralInfo(this.generalInfoRequest).subscribe(
      dataJson => {
        this.generalInfoResponse = dataJson['data'];
        this.updateBasicInformationForm();
      },
      error => console.log(error)
    );
  }

  // Education Information

  getEducationList() {
    this.userService.getEducationInfo().subscribe(
      dataJson => {
        this.educationList = dataJson['data'];
        console.log(this.educationList);
        this.updateEducationForm();
      },
      error => console.log(error)
    );
  }

  updateEducationData() {
    this.educationDataList.forEach((education, index) => {
      if (index < this.educationList.length) {
        this.userService.patchEducationInfoById(education, this.educationList[index].education_id).subscribe(
          dataJson => {
            console.log(dataJson['data']);
          },
          error => console.log(error)
        );
      } else {
        this.userService.postEducationInfo(education).subscribe(
          dataJson => {
            console.log(dataJson['data']);
          },
          error => console.log(error)
        );
      }
    });
  }

  // Experience Information

  getExperienceList() {
    this.userService.getExperienceInfo().subscribe(
      dataJson => {
        this.experienceList = dataJson['data'];
        console.log('experience_List', this.experienceList);
        this.updateWorkExperienceForm();
      },
      error => console.log(error)
    );
  }

  updateExperienceData() {
    this.experienceDataList.forEach((experience, index) => {
      if (index < this.experienceList.length) {
        // this.userService.patchExperienceInfoById(experience, this.experienceList[index].experience_id)subscribe(
        //   dataJson => {
        //     console.log(dataJson['data']);
        //   },
        //   error => console.log(error)
        // );
      } else {
        this.userService.postExperienceInfo(experience).subscribe(
          dataJson => {
            console.log(dataJson['data']);
          },
          error => console.log(error)
        );
      }
    });
  }

}
