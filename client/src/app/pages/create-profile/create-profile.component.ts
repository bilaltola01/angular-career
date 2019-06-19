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
  UserSkillItem,
  UserInterestItem,
  UserProjectItem,
  UserProjectItemData,
  UserPublicationItem,
  UserPublicationItemData,
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
    'Exploring Opportunities',
    'Actively Looking For Job'
  ];

  profile_status = this.statuses[0];

  selectedPageIndex = 0;

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
        // this.updateEducationData();
        break;
      case 4:
        // this.updateExperienceData();
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
      case 9:
        this.updateGeneralInfo();
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
    this.updateAboutMeForm();
    this.setProfileStatus(this.generalInfoResponse.is_looking);
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
      is_looking: this.generalInfoResponse.is_looking,
      title: this.generalInfoResponse.title,
      user_intro: this.generalInfoResponse.user_intro
    };
  }



  // About Me Form
  initAboutMeForm() {
    this.aboutMeForm = new FormGroup({
      aboutMe: new FormControl('')
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
      error => {
        console.log(error);
        this.educationList = [];
        this.updateEducationForm();
      }
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
      error => {
        console.log(error);
        this.experienceList = [];
        this.updateWorkExperienceForm();
      }
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
