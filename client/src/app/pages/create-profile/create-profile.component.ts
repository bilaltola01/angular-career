import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormArray} from '@angular/forms';
import { AutoCompleteService } from 'src/app/services/auto-complete.service';
import { UserService } from 'src/app/services/user.service';

export interface City {
  city: string;
  city_id: number;
}

export interface School {
  school_name: string;
  school_id: number;
}

export interface Major {
  major_id: number;
  major_name: string;
}

export interface Skill {
  skill_id: number;
  skill: string;
}

export interface Interest {
  interest_id: number;
  interest: string;
}

export interface GeneralInfoResponse {
  user_id: number;
  email: string;
  photo: string;
  first_name: string;
  last_name: string;
  birthdate: string;
  gender: string;
  phone_num: string;
  recruiter: number;
  applicant: number;
  city_id: number;
  country_id: number;
  state_id: number;
  site_admin: number;
  date_created: Date;
  verified: number;
  identity_valid: number;
  title: string;
}

export interface GeneralInfoRequest {
  photo: string;
  first_name: string;
  last_name: string;
  birthdate: string;
  gender: string;
  phone_num: string;
  recruiter: number;
  applicant: number;
  city_id: number;
  country_id: number;
  state_id: number;
  is_looking: number;
  title: string;
}

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

  statuses = [
    'Actively Looking For Job',
    'Exploring Opportunities'
  ];

  profile_status = this.statuses[0];

  selectedPageIndex = 1;

  generalInfoResponse: GeneralInfoResponse;
  generalInfoRequest: GeneralInfoRequest;

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
    this.generalInfoResponse = null;
    this.generalInfoRequest = null;
    this.getGeneralInfo();
  }

  goToCreatProfilePage() {
    this.selectedPageIndex = 1;
  }

  goToNextPage() {
    if (this.selectedPageIndex === 1) {
      this.updateGeneralInfo();
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
  }

  updateBasicInformationForm() {
    this.updateGeneralInfoRequest();
    this.basicInfoForm.controls.basicInfoGender.setValue(this.generalInfoResponse.gender);
  }

  updateGeneralInfoRequest() {
    this.generalInfoRequest = {
      photo: this.generalInfoResponse.photo,
      first_name: this.generalInfoResponse.first_name,
      last_name: this.generalInfoResponse.last_name,
      birthdate: this.generalInfoResponse.birthdate,
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
    this.addEducationFormGroup();
  }

  addEducationFormGroup() {
    this.autocomplete_universities = [];
    this.autocomplete_majors = [];

    const educationForm = new FormGroup({
      university: new FormControl(''),
      degree: new FormControl(''),
      course: new FormControl(''),
      completion: new FormControl(''),
      description: new FormControl('')
    });

    educationForm.controls.university.valueChanges.subscribe(
      (university) => {
        this.onUniversityValueChanges(university);
      }
    );

    educationForm.controls.course.valueChanges.subscribe(
      (major) => {
        this.onMajorValueChanges(major);
      }
    );

    this.educationFormArray.push(educationForm);
  }

  // Work Experience Form

  initWorkExperienceFormArray() {
    this.workExperienceFormArray = new FormArray([]);
    this.skills_trained = [];
    this.additional_exposure = [];
    this.addWorkExperienceForm();
  }

  addWorkExperienceForm() {
    this.autocomplete_skills = [];
    this.skills_trained.push([]);
    this.additional_exposure.push([]);

    const workExperienceForm = new FormGroup({
      company_name: new FormControl(''),
      years: new FormControl(''),
      designation: new FormControl(''),
      description: new FormControl(''),
      skills_trained: new FormControl(''),
      additional_exposure: new FormControl('')
    });

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

  onUniversityValueChanges(school: string) {
    this.autoCompleteService.autoComplete(school, 'schools').subscribe(
      dataJson => {
        if (dataJson['success']) {
          this.autocomplete_universities = dataJson['data'];
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

  //

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

    this.userService.updateGeneralInfo({userInfo: this.generalInfoRequest}).subscribe(
      dataJson => {
        this.generalInfoResponse = dataJson['data'];
        this.updateBasicInformationForm();
      },
      error => console.log(error)
    );
  }

}
