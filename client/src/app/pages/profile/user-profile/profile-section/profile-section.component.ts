import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';

import {
  UserGeneralInfo,
  UserEducationItem,
  UserExperienceItem,
  UserSkillItem,
  UserInterestItem,
  UserProjectItem,
  UserPublicationItem,
  UserExternalResourcesItem,
  Skill,
  Interest,
  UserObject,
  UserEducationItemData,
  UserExperienceItemData,
  UserProjectItemData,
  UserPublicationItemData,
  School,
  Major,
  Level,
  Levels,
  Company,
  Industry,
  ExternalResources,
  UserExternalResourcesItemData,
  ITEMS_LIMIT,
  SkillLevelDescription
} from 'src/app/models';
import {
  HelperService,
  AutoCompleteService,
  AlertsService,
  AlertType,
  UserService,
  UserStateService,
  ProfileStateService,
  UserProfileStateService
} from 'src/app/services';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import {MatDatepicker} from '@angular/material/datepicker';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { SkillDescriptionPopupComponent } from 'src/app/components/skill-description-popup/skill-description-popup.component';

export interface DialogData {
  category: 'About Me' | 'Education' | 'Work Experience' | 'Project' | 'Publication' | 'External Resources' ;
  data: any;
  editIndex: number;
}

export interface EditSkillItem {
  index: number;
  skillItem: UserSkillItem;
}

@Component({
  selector: 'profile-section',
  templateUrl: './profile-section.component.html',
  styleUrls: ['./profile-section.component.scss']
})
export class ProfileSectionComponent implements OnInit {

  userId: number;
  userGeneralInfo: UserGeneralInfo;
  educationList: UserEducationItem[];
  experienceList: UserExperienceItem[];
  userSkillsList: UserSkillItem[];
  userInterestsList: UserInterestItem[];
  userProjectsList: UserProjectItem[];
  userPublicationsList: UserPublicationItem[];
  SkillLevelDescription = SkillLevelDescription;
  externalResourcesList: UserExternalResourcesItem[];
  editMode: boolean;
  skillLevelDescription = SkillLevelDescription;
  autocomplete_skills: Skill[] = [];
  autocomplete_interests: Interest[] = [];

  prevent_skills_autocomplete: boolean;
  prevent_interets_autocomplete: boolean;

  skillsSearchForm: FormGroup;
  interestsSearchForm: FormGroup;

  temp_skill: EditSkillItem;

  displayItemsLimit = 7;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private helperService: HelperService,
    private autoCompleteService: AutoCompleteService,
    private alertsService: AlertsService,
    private userService: UserService,
    private userStateService: UserStateService,
    private profileStateService: ProfileStateService,
    private userProfileStateService: UserProfileStateService,
    public dialog: MatDialog
  ) {
    if (router.url.includes('user')) {
      this.userId = parseInt(router.url.split('/')[2], 10);
    }
    this.parseRouterUrl(router.url);
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.parseRouterUrl(val.url);
      }
    });
  }

  ngOnInit() {
    this.initialize();
  }

  parseRouterUrl(url: string) {
    if (url.includes('edit')) {
      this.editMode = true;
      if (url.includes('profile')) {
        this.initSkillsSearchForm();
        this.initInterestsSearchForm();
      }
    } else {
      this.editMode = false;
      if (url.includes('profile')) {
        this.initSkillsSearchForm();
      }
    }
  }

  initialize() {
    this.getGeneralInfo();
    this.getEducationList();
    this.getExperienceList();
    this.getUserSkillsList();
    this.getUserInterestsList();
    this.getUserProjectsList();
    this.getUserPublicationsList();
    this.getExternalResourceList();
  }

  getGeneralInfo() {
    if (this.userId) {
      this.userService.getGeneralInfo(this.userId).subscribe(
        dataJson => {
          this.userGeneralInfo = dataJson['data'];
          this.userProfileStateService.setUser(this.userGeneralInfo);
        },
        error => {
          this.alertsService.show(error.message, AlertType.error);
        }
      );
    } else {
      this.userStateService.getUser
      .subscribe(user => {
        if (user) {
          this.userGeneralInfo = user;
        }
      }, error => {
        this.alertsService.show(error.message, AlertType.error);
      });
    }
  }

  getEducationList() {
    if (this.userId) {
      this.userService.getEducationInfo(this.userId).subscribe(
        dataJson => {
          this.educationList = dataJson['data'];
          this.userProfileStateService.setEducations(this.educationList);
        },
        error => {
          this.alertsService.show(error.message, AlertType.error);
        }
      );
    } else {
      this.profileStateService.getEducations
      .subscribe(educationList => {
        if (educationList) {
          this.educationList = educationList;
        }
      }, error => {
        this.alertsService.show(error.message, AlertType.error);
      });
    }
  }

  getExperienceList() {
    if (this.userId) {
      this.userService.getExperienceInfo(this.userId).subscribe(
        dataJson => {
          this.experienceList = dataJson['data'];
          this.userProfileStateService.setExperiences(this.experienceList);
          this.experienceList.forEach((experience, arrIndex) => {
            if (experience.skills_trained && experience.skills_trained.length > 0) {
              this.getSkillsTrained(arrIndex);
            }
            if (experience.add_industries && experience.add_industries.length > 0) {
              this.getAdditionalIndustries(arrIndex);
            }
          });
        },
        error => {
          this.alertsService.show(error.message, AlertType.error);
        }
      );
    } else {
      this.profileStateService.getExperiences
      .subscribe(experienceList => {
        if (experienceList) {
          this.experienceList = experienceList;
        }
      }, error => {
        this.alertsService.show(error.message, AlertType.error);
      });
    }
  }

  getSkillsTrained(arrIndex: number) {
    this.userService.getSkillsTrained(this.experienceList[arrIndex].work_hist_id).subscribe(
      dataJson => {
        this.experienceList[arrIndex].skills_trained = dataJson.data;
        this.userProfileStateService.setExperiences(this.experienceList);
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

  getAdditionalIndustries(arrIndex: number) {
    this.userService.getAdditionalIndustries(this.experienceList[arrIndex].work_hist_id).subscribe(
      dataJson => {
        this.experienceList[arrIndex].add_industries = dataJson.data;
        this.userProfileStateService.setExperiences(this.experienceList);
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

  getUserSkillsList() {
    if (this.userId) {
      this.getUserSkillsListByOffset(ITEMS_LIMIT, 0);
    } else {
      this.profileStateService.getSkills
      .subscribe(userSkillsList => {
        if (userSkillsList) {
          this.userSkillsList = userSkillsList;
        }
      }, error => {
        this.alertsService.show(error.message, AlertType.error);
      });
    }
  }

  getUserSkillsListByOffset(limit: number, offset: number) {
    if (this.userId) {
      this.userService.getSkillsInfo(limit, offset, this.userId).subscribe(
        dataJson => {
          if (offset === 0) {
            this.userSkillsList = dataJson['data'];
          } else {
            this.userSkillsList = this.userSkillsList.slice().concat(dataJson['data']);
          }
          if (dataJson['data'].length === limit) {
            this.getUserSkillsListByOffset(limit, offset + limit);
          } else {
            this.userProfileStateService.setSkills(this.userSkillsList);
          }
        },
        error => {
          this.alertsService.show(error.message, AlertType.error);
        }
      );
    } else {
      this.userService.getSkillsInfo(limit, offset).subscribe(
        dataJson => {
          if (offset === 0) {
            this.userSkillsList = dataJson['data'];
          } else {
            this.userSkillsList = this.userSkillsList.slice().concat(dataJson['data']);
          }
          if (dataJson['data'].length === limit) {
            this.getUserSkillsListByOffset(limit, offset + limit);
          } else {
            this.profileStateService.setSkills(this.userSkillsList);
          }
        },
        error => {
          this.alertsService.show(error.message, AlertType.error);
        }
      );
    }
  }

  getUserInterestsList() {
    if (this.userId) {
      this.getUserInterestsListByOffset(ITEMS_LIMIT, 0);
    } else {
      this.profileStateService.getInterests
      .subscribe(interestsList => {
        if (interestsList) {
          this.userInterestsList = interestsList;
        }
      }, error => {
        this.alertsService.show(error.message, AlertType.error);
      });
    }
  }

  getUserInterestsListByOffset(limit: number, offset: number) {
    if (this.userId) {
      this.userService.getUserInterestsInfo(limit, offset, this.userId).subscribe(
        dataJson => {
          if (offset === 0) {
            this.userInterestsList = dataJson['data'];
          } else {
            this.userInterestsList = this.userInterestsList.slice().concat(dataJson['data']);
          }
          if (dataJson['data'].length === limit) {
            this.getUserInterestsListByOffset(limit, offset + limit);
          } else {
            this.userProfileStateService.setInterests(this.userInterestsList);
          }
        },
        error => {
          this.alertsService.show(error.message, AlertType.error);
        }
      );
    }
  }

  getUserProjectsList() {
    if (this.userId) {
      this.userService.getProjectsInfo(this.userId).subscribe(
        dataJson => {
          this.userProjectsList = dataJson['data']['data'];
          this.userProfileStateService.setProjects(this.userProjectsList);
        },
        error => {
          this.alertsService.show(error.message, AlertType.error);
        }
      );
    } else {
      this.profileStateService.getProjects
      .subscribe(projectsList => {
        if (projectsList) {
          this.userProjectsList = projectsList;
        }
      }, error => {
        this.alertsService.show(error.message, AlertType.error);
      });
    }
  }

  getUserPublicationsList() {
    if (this.userId) {
      this.userService.getPublicationsInfo(this.userId).subscribe(
        dataJson => {
          this.userPublicationsList = dataJson['data'];
          this.userProfileStateService.setPublications(this.userPublicationsList);
        },
        error => {
          this.alertsService.show(error.message, AlertType.error);
        }
      );
    } else {
      this.profileStateService.getPublications
      .subscribe(publicationsList => {
        if (publicationsList) {
          this.userPublicationsList = publicationsList;
        }
      }, error => {
        this.alertsService.show(error.message, AlertType.error);
      });
    }
  }

  getExternalResourceList() {
    if (this.userId) {
      this.userService.getExternalResourcesInfo(this.userId).subscribe(
        dataJson => {
          this.externalResourcesList = dataJson['data'];
          this.userProfileStateService.setExternalResources(this.externalResourcesList);
        },
        error => {
          this.alertsService.show(error.message, AlertType.error);
        }
      );
    } else {
      this.profileStateService.getExternalResources
      .subscribe(externalResourcesList => {
        if (externalResourcesList) {
          this.externalResourcesList = externalResourcesList;
        }
      }, error => {
        this.alertsService.show(error.message, AlertType.error);
      });
    }
  }

  onClickEdit() {
    this.router.navigate(['/my-profile', 'edit'], { relativeTo: this.route });
  }

  openSkillDescriptionDialog() {
    const dialogRef = this.dialog.open(SkillDescriptionPopupComponent, {
      data: { skillDesc : SkillLevelDescription},
      width:  '100vw',
      maxWidth: '880px',
      minWidth: '280px',
      panelClass: ['edit-dialog-container']
    });
  }
  openDialog(category: string, data: any, arrIndex: number = -1) {
    // tslint:disable-next-line: no-use-before-declare
    const dialgoRef = this.dialog.open(ProfileDialogContentComponent, {
      data: {
        category: category,
        data: data,
        editIndex: arrIndex
      },
      width: '100vw',
      maxWidth: '880px',
      minWidth: '280px',
      panelClass: ['edit-dialog-container']
    });
    dialgoRef.afterClosed().subscribe(result => {
      if (result) {
        switch (category) {
          case 'About Me':
            this.userGeneralInfo = result;
            this.userStateService.setUser(this.userGeneralInfo);
            break;
          case 'Education':
            this.educationList = result;
            this.profileStateService.setEducations(this.educationList);
            break;
          case 'Work Experience':
            this.experienceList = result;
            this.profileStateService.setExperiences(this.experienceList);
            this.getUserSkillsListByOffset(ITEMS_LIMIT, 0);
            break;
          case 'Project':
            this.userProjectsList = result;
            this.profileStateService.setProjects(this.userProjectsList);
            break;
          case 'Publication':
            this.userPublicationsList = result;
            this.profileStateService.setPublications(this.userPublicationsList);
            break;
          case 'External Resources':
            this.externalResourcesList = result;
            this.profileStateService.setExternalResources(this.externalResourcesList);
            break;
          default:
            break;
        }
      }
    });
  }

  deleteEducationData(arrIndex: number) {
    this.userService.deleteEducationInfoById(this.educationList[arrIndex].education_id).subscribe(
      dataJson => {
        this.educationList.splice(arrIndex, 1);
        this.profileStateService.setEducations(this.educationList);
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

  deleteExperienceData(arrIndex: number) {
    this.userService.deleteExperienceInfoById(this.experienceList[arrIndex].work_hist_id).subscribe(
      dataJson => {
        this.experienceList.splice(arrIndex, 1);
        this.profileStateService.setExperiences(this.experienceList);
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

  deletePublicationData(arrIndex: number) {
    this.userService.deletePublicationsInfoById(this.userPublicationsList[arrIndex].publication_id).subscribe(
      dataJson => {
        this.userPublicationsList.splice(arrIndex, 1);
        this.profileStateService.setPublications(this.userPublicationsList);
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

  deleteProjectData(arrIndex: number) {
    this.userService.deleteProjectInfoById(this.userProjectsList[arrIndex].project_id).subscribe(
      dataJson => {
        this.userProjectsList.splice(arrIndex, 1);
        this.profileStateService.setProjects(this.userProjectsList);
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

  initSkillsSearchForm() {
    this.autocomplete_skills = [];
    this.prevent_skills_autocomplete = false;

    this.temp_skill = null;

    this.skillsSearchForm = new FormGroup({
      skills: new FormControl('')
    });

    this.skillsSearchForm.get('skills').valueChanges.subscribe(
      (skill) => {
        if (skill && this.helperService.checkSpacesString(skill)) {
          if (this.editMode) {
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
            this.autocomplete_skills = this.userSkillsList.filter(value => value.skill.toLocaleLowerCase().includes(skill));
          }
        } else {
          this.autocomplete_skills = [];
        }
      }
    );
  }

  /**
   * Select skillItem from autocomplete list.
   * edit mode
   *  - if new skill, add it to skills list
   * @param skillItem
   */
  addSkills(skillItem: Skill) {
    if (this.editMode) {
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
      this.skillsSearchForm.get('skills').setValue('');
      this.prevent_skills_autocomplete = true;
    } else {
      const filterList = this.userSkillsList.filter(value => value.skill_id === skillItem.skill_id);
      this.temp_skill = {
        index: this.userSkillsList.indexOf(filterList[0]),
        skillItem: filterList[0]
      };
      this.skillsSearchForm.get('skills').setValue('');
    }
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
  updateUserSkillsData(arrIndex: number, userSkillItem: UserSkillItem) {
    this.userService.patchSkillInfoById(userSkillItem.skill_id, userSkillItem).subscribe(
      dataJson => {
        const temp_skill = this.temp_skill;
        this.userSkillsList[arrIndex] = dataJson['data'];
        this.profileStateService.setSkills(this.userSkillsList);
        if (temp_skill) {
          this.temp_skill = {
            index: temp_skill.index,
            skillItem: dataJson['data']
          };
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
        this.profileStateService.setSkills(this.userSkillsList);
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
        this.profileStateService.setSkills(this.userSkillsList);
        this.temp_skill = null;
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

  initInterestsSearchForm() {
    this.autocomplete_interests = [];
    this.prevent_interets_autocomplete = false;

    this.interestsSearchForm = new FormGroup({
      interests: new FormControl('')
    });

    this.interestsSearchForm.get('interests').valueChanges.subscribe(
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

  addInterests(interestItem: Interest) {
    const interestItemData = {
      interest_id: interestItem.interest_id,
      interest: interestItem.interest
    };
    if (this.userInterestsList.filter(value => value.interest === interestItem.interest).length === 0) {
      this.addUserInteretsData(interestItemData);
    }
    this.interestsSearchForm.get('interests').setValue('');
    this.prevent_interets_autocomplete = true;
  }

  addUserInteretsData(userInterestItem: UserInterestItem) {
    this.userService.postUserInterestsInfo(userInterestItem).subscribe(
      dataJson => {
        this.userInterestsList.push(dataJson['data']);
        this.profileStateService.setInterests(this.userInterestsList);
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }
  removeUserInteretsData(index: number, userInterestItem: UserInterestItem) {
    if (this.editMode) {
      this.userService.deleteUserInterestsInfoById(userInterestItem.interest_id).subscribe(
        dataJson => {
          this.userInterestsList.splice(index, 1);
          this.profileStateService.setInterests(this.userInterestsList);
        },
        error => {
          this.alertsService.show(error.message, AlertType.error);
        }
      );
    }
  }

}

@Component({
  selector: 'profile-dialog',
  templateUrl: './profile-dialog.component.html',
  styleUrls: ['./profile-dialog.component.scss'],
})

export class ProfileDialogContentComponent {

  aboutMeForm: FormGroup;
  educationForm: FormGroup;
  experienceForm: FormGroup;
  projectForm: FormGroup;
  publicationForm: FormGroup;
  externalResourcesForm: FormGroup;

  request_general: any;
  request_education: UserEducationItemData;
  request_experience: UserExperienceItemData;
  request_project: UserProjectItemData;
  request_publication: UserPublicationItemData;
  externalResourcesDataList: UserExternalResourcesItemData[];

  autocomplete_universities: School[];
  autocomplete_majors: Major[];
  autocomplete_focus_majors: Major[];

  autocomplete_companies: Company[] = [];
  autocomplete_skills_trained: Skill[][] = [];
  autocomplete_additional_industries: Industry[] = [];

  skillLevelDescription = SkillLevelDescription;
  temp_university: School;
  temp_major: Major;
  temp_focus_major: Major;
  temp_company: Company;

  skills_trained: Skill[];
  additional_industries: Industry[];

  degrees: Level[] = Levels;
  externalResources = ExternalResources;

  minDate: Date;
  maxDate = new Date();

  items_count: number;

  constructor(
    public dialogRef: MatDialogRef<ProfileDialogContentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private helperService: HelperService,
    private autoCompleteService: AutoCompleteService,
    private alertsService: AlertsService,
    private userService: UserService,
    private userStateService: UserStateService
  ) {
    switch (data.category) {
      case 'About Me':
        this.initAboutMeForm();
        break;
      case 'Education':
        this.initEduactionForm();
        break;
      case 'Work Experience':
        this.initExperienceForm();
        break;
      case 'Project':
        this.initProjectForm();
        break;
      case 'Publication':
        this.initPublicationForm();
        break;
      case 'External Resources':
        this.initExternalResourcesForm();
        break;
      default:
        break;

    }
  }
  initSkillDesc() {
    this.skillLevelDescription = SkillLevelDescription;
  }

  initAboutMeForm() {
    const data = this.data.data;
    if (data) {
      this.request_general = {
        user_intro: data.user_intro
      };
    }
    this.aboutMeForm = new FormGroup({
      aboutMe: new FormControl(data.user_intro ? data.user_intro : '')
    });

    this.aboutMeForm.get('aboutMe').valueChanges.subscribe((about) => {
      this.request_general.user_intro = about ? this.helperService.checkSpacesString(about) : null;
    });
  }
  updateGeneralInfo() {
    this.userService.updateGeneralInfo(this.request_general).subscribe(
      dataJson => {
        this.data.data = dataJson['data'];
        this.dialogRef.close(this.data.data);
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

  initEduactionForm() {
    this.autocomplete_universities = [];
    this.autocomplete_majors = [];
    this.autocomplete_focus_majors = [];
    this.temp_university = null;
    this.temp_major = null;
    this.temp_focus_major = null;

    const educationData: UserEducationItem = this.data.editIndex !== -1 ? this.data.data[this.data.editIndex] : null;

    this.request_education = {
      school_id: educationData ? educationData.school_id : null,
      major_id: educationData ? educationData.major_id : null,
      focus_major: educationData ? educationData.focus_major : null,
      start_date: educationData ? educationData.start_date : null,
      graduation_date: educationData ? educationData.graduation_date : null,
      gpa: educationData ? educationData.gpa : null,
      edu_desc: educationData ? educationData.edu_desc : null,
      user_specified_school_name: educationData ? educationData.user_specified_school_name : null,
      level_id: educationData ? educationData.level_id : null,
      focus_major_name: educationData ? educationData.focus_major_name : null
    };

    this.educationForm = new FormGroup({
      university: new FormControl(educationData ? (educationData.school_id ? educationData.school_name : educationData.user_specified_school_name) : '', [Validators.required]),
      degree: new FormControl(educationData ? educationData.education_level : '', [Validators.required]),
      major: new FormControl(educationData ? educationData.major_name : ''),
      focus_major: new FormControl(educationData ? educationData.focus_major_name : ''),
      start_date: new FormControl(educationData && educationData.start_date ? this.helperService.convertToFormattedString(educationData.start_date, 'YYYY') : '', [Validators.required]),
      graduation_date: new FormControl(educationData && educationData.graduation_date ? this.helperService.convertToFormattedString(educationData.graduation_date, 'YYYY') : '', [Validators.required]),
      gpa: new FormControl(educationData ? educationData.gpa : ''),
      description: new FormControl(educationData ? educationData.edu_desc : '')
    });

    this.educationForm.get('university').valueChanges.subscribe((university) => {
      if (university && this.helperService.checkSpacesString(university)) {
        this.autoCompleteService.autoComplete(university, 'schools').subscribe(
          dataJson => {
            if (dataJson['success']) {
              this.autocomplete_universities = dataJson['data'];
              if (this.autocomplete_universities.length === 0) {
                this.onSelectSpecificUniversity(university);
              }
            }
          },
          error => {
            this.autocomplete_universities = [];
            this.alertsService.show(error.message, AlertType.error);
          }
        );
      } else {
        this.autocomplete_universities = [];
        this.onSelectSpecificUniversity(null);
      }
    });
    this.educationForm.get('degree').valueChanges.subscribe(
      (degree) => {
        const filter = this.degrees.filter(value => value.education_level === degree);
        if (filter.length > 0) {
          this.request_education.level_id = filter[0].level_id;
        }
      }
    );
    this.educationForm.get('start_date').valueChanges.subscribe(
      (start_date) => {
        this.request_education.start_date = start_date ? this.helperService.convertStringToFormattedDateString(start_date, 'YYYY', 'L') : null ;
      }
    );
    this.educationForm.get('graduation_date').valueChanges.subscribe(
      (graduation_date) => {
        this.request_education.graduation_date = graduation_date ? this.helperService.convertStringToFormattedDateString(graduation_date, 'YYYY', 'L') : null ;
      }
    );
    this.educationForm.get('major').valueChanges.subscribe(
      (major) => {
        if (major && this.helperService.checkSpacesString(major)) {
          this.onMajorValueChanges(major);
        } else {
          this.autocomplete_majors = [];
          this.clearMajor(false);
        }
      }
    );
    this.educationForm.get('focus_major').valueChanges.subscribe(
      (focus_major) => {
        if (focus_major && this.helperService.checkSpacesString(focus_major)) {
          this.onMajorValueChanges(focus_major, true);
        } else {
          this.autocomplete_focus_majors = [];
          this.clearMajor(true);
        }
      }
    );
    this.educationForm.get('description').valueChanges.subscribe(
      (description) => {
        this.request_education.edu_desc = description ? this.helperService.checkSpacesString(description) : null;
      }
    );
    this.educationForm.get('gpa').valueChanges.subscribe(
      (gpa) => {
        this.request_education.gpa = gpa && this.helperService.checkSpacesString(gpa) ? parseFloat(gpa) : null;
      }
    );
  }

  checkSchoolNameValidation(): boolean {
    const value = this.educationForm.get('university').value;
    return value && this.helperService.checkSpacesString(value) ? true : false;
  }

  onSelectSpecificUniversity(university: string) {
    this.request_education.user_specified_school_name = university;
    this.request_education.school_id = null;
  }
  onSelectUniversity(university: School) {
    this.request_education.school_id = university.school_id;
    this.request_education.user_specified_school_name = null;
    this.temp_university = university;
  }

  onBlurUniversity() {
    if (this.temp_university) {
      if (this.educationForm.get('university').value !== this.temp_university.school_name) {
        this.onSelectSpecificUniversity(this.educationForm.get('university').value);
        this.temp_university = null;
      }
    } else {
      this.onSelectSpecificUniversity(this.educationForm.get('university').value);
    }
  }

  onMajorValueChanges(major: string, isFocusMajor: boolean = false) {
    this.autoCompleteService.autoComplete(major, 'majors').subscribe(
      dataJson => {
        if (dataJson['success']) {
          if (isFocusMajor) {
            this.autocomplete_focus_majors = dataJson['data'];
            if (this.autocomplete_focus_majors.length === 0) {
              this.clearMajor(true);
            }
          } else {
            this.autocomplete_majors = dataJson['data'];
            if (this.autocomplete_majors.length === 0) {
              this.clearMajor(false);
            }
          }
        }
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
        if (isFocusMajor) {
          this.autocomplete_focus_majors = [];
          this.clearMajor(true);
        } else {
          this.autocomplete_majors = [];
          this.clearMajor(false);
        }
      }
    );
  }

  checkMajorValidation(isFocusMajor: boolean): boolean {
    if (isFocusMajor) {
      const value = this.educationForm.get('focus_major').value;
      if (value && this.helperService.checkSpacesString(value)) {
        if (this.temp_focus_major) {
          return (value === this.temp_focus_major.major_name) ? true : false;
        } else {
          if (this.data.editIndex === -1) {
            return false;
          } else {
            return value === this.data.data[this.data.editIndex].focus_major_name ? true : false;
          }
        }
      } else {
        return true;
      }
    } else {
      const value = this.educationForm.get('major').value;
      if (value && this.helperService.checkSpacesString(value)) {
        if (this.temp_major) {
          return value === this.temp_major.major_name ? true : false;
        } else {
          if (this.data.editIndex === -1) {
            return false;
          } else {
            return value === this.data.data[this.data.editIndex].major_name ? true : false;
          }
        }
      } else {
        return true;
      }
    }
  }

  onSelectMajor(major: Major, isFocusMajor: boolean = false) {
    if (isFocusMajor) {
      this.request_education.focus_major = major.major_id;
      this.temp_focus_major = major;
    } else {
      this.request_education.major_id = major.major_id;
      this.temp_major = major;
    }
  }
  onBlurMajor(isFocusMajor: boolean = false) {
    if (isFocusMajor) {
      if (this.temp_focus_major) {
        if (this.educationForm.get('focus_major').value !== this.temp_focus_major.major_name) {
          this.temp_focus_major = null;
          this.clearMajor(isFocusMajor);
        }
      } else {
        if (this.data.editIndex !== -1) {
          if (this.educationForm.get('focus_major').value !== this.data.data[this.data.editIndex].focus_major_name) {
            this.clearMajor(isFocusMajor);
          } else {
            this.request_education.focus_major = this.data.data[this.data.editIndex].focus_major;
          }
        } else {
          this.clearMajor(isFocusMajor);
        }
      }
    } else {
      if (this.temp_major) {
        if (this.educationForm.get('major').value !== this.temp_major.major_name) {
          this.temp_major = null;
          this.clearMajor(isFocusMajor);
        }
      } else {
        if (this.data.editIndex !== -1) {
          if (this.educationForm.get('major').value !== this.data.data[this.data.editIndex].major_name) {
            this.clearMajor(isFocusMajor);
          } else {
            this.request_education.major_id = this.data.data[this.data.editIndex].major_id;
          }
        } else {
          this.clearMajor(isFocusMajor);
        }
      }
    }
  }
  clearMajor(isFocusMajor: boolean = false) {
    if (isFocusMajor) {
      this.request_education.focus_major = null;
    } else {
      this.request_education.major_id = null;
    }
  }
  onEducationYearSelect(date: any, isStartDate: boolean = true, datePicker: MatDatepicker<any>) {
    if (isStartDate) {
      this.minDate = new Date(date);
    }
    datePicker.close();
    this.educationForm.get(isStartDate ? 'start_date' : 'graduation_date').setValue(this.helperService.convertToFormattedString(date, 'YYYY'));
  }
  addEducation() {
    if (this.educationForm.valid && this.checkMajorValidation(true) && this.checkMajorValidation(false) && this.checkSchoolNameValidation()) {
      this.userService.postEducationInfo(this.request_education).subscribe(
        dataJson => {
          this.data.data.push(dataJson['data']);
          this.dialogRef.close(this.data.data);
        },
        error => {
          this.alertsService.show(error.message, AlertType.error);
        }
      );
    }
  }

  updateEducation() {
    if (this.educationForm.valid && this.checkMajorValidation(true) && this.checkMajorValidation(false) && this.checkSchoolNameValidation()) {
      this.userService.patchEducationInfoById(this.request_education, this.data.data[this.data.editIndex].education_id).subscribe(
        dataJson => {
          this.data.data[this.data.editIndex] = dataJson['data'];
          this.dialogRef.close(this.data.data);
        },
        error => {
          this.alertsService.show(error.message, AlertType.error);
        }
      );
    }
  }


  initExperienceForm() {
    this.autocomplete_companies = [];
    this.autocomplete_skills_trained = [];
    this.autocomplete_additional_industries = [];

    const experienceData: UserExperienceItem = this.data.editIndex !== -1 ? this.data.data[this.data.editIndex] : null;

    this.skills_trained = experienceData && experienceData.skills_trained ? experienceData.skills_trained : [];
    this.additional_industries = experienceData && experienceData.add_industries ? experienceData.add_industries : [];

    this.request_experience = {
      company_id: experienceData ? experienceData.company_id : null,
      job: experienceData ? experienceData.job : null,
      start_date: experienceData ? experienceData.start_date : null,
      end_date: experienceData ? experienceData.end_date : null,
      job_desc: experienceData ? experienceData.job_desc : null,
      user_specified_company_name: experienceData ? experienceData.user_specified_company_name : null,
      skill_ids_trained: experienceData && experienceData.skills_trained && experienceData.skills_trained.length > 0 ? experienceData.skills_trained.map(x => x.skill_id) : null,
      add_industry_ids: experienceData && experienceData.add_industries && experienceData.add_industries.length > 0 ? experienceData.add_industries.map(x => x.industry_id) : null
    };

    this.experienceForm = new FormGroup({
      company_name: new FormControl(experienceData ? (experienceData.company_id ?  experienceData.company_name : experienceData.user_specified_company_name) : '', [Validators.required]),
      start_date: new FormControl(experienceData && experienceData.start_date ? this.helperService.convertToFormattedString(experienceData.start_date, 'MM/YYYY') : '', [Validators.required]),
      end_date: new FormControl(experienceData && experienceData.end_date ? this.helperService.convertToFormattedString(experienceData.end_date, 'MM/YYYY') : ''),
      job: new FormControl(experienceData ? experienceData.job : ''),
      description: new FormControl(experienceData ? experienceData.job_desc : ''),
      skills_trained: new FormControl(''),
      additional_industries: new FormControl('')
    });

    this.experienceForm.get('company_name').valueChanges.subscribe(
      (company_name) => {
        if (company_name && this.helperService.checkSpacesString(company_name)) {
          this.autoCompleteService.autoComplete(company_name, 'companies').subscribe(
            dataJson => {
              if (dataJson['success']) {
                this.autocomplete_companies = dataJson['data'];
                if (this.autocomplete_companies.length === 0) {
                  this.onSelectSpecificCompany(company_name);
                }
              }
            },
            error => {
              this.autocomplete_companies = [];
              this.alertsService.show(error.message, AlertType.error);
            }
          );
        } else {
          this.autocomplete_companies = [];
          this.onSelectSpecificCompany(null);
        }
      }
    );
    this.experienceForm.get('start_date').valueChanges.subscribe(
      (start_date) => {
        this.request_experience.start_date = start_date ? this.helperService.convertStringToFormattedDateString(start_date, 'MM/YYYY', 'L') : null;
      }
    );
    this.experienceForm.get('end_date').valueChanges.subscribe(
      (end_date) => {
        this.request_experience.end_date = end_date ? this.helperService.convertStringToFormattedDateString(end_date, 'MM/YYYY', 'L') : null;
      }
    );
    this.experienceForm.get('job').valueChanges.subscribe(
      (job) => {
        this.request_experience.job = job ? this.helperService.checkSpacesString(job) : null;
      }
    );
    this.experienceForm.get('description').valueChanges.subscribe(
      (description) => {
        this.request_experience.job_desc = description ? this.helperService.checkSpacesString(description) : null;
      }
    );

    this.experienceForm.get('skills_trained').valueChanges.subscribe(
      (skill) => {
        if (skill && this.helperService.checkSpacesString(skill)) {
          this.autoCompleteService.autoComplete(skill, 'skills').subscribe(
            dataJson => {
              if (dataJson['success']) {
                this.autocomplete_skills_trained = dataJson['data'];
              }
            },
            error => {
              this.autocomplete_skills_trained = [];
              this.alertsService.show(error.message, AlertType.error);
            }
          );
        } else {
          this.autocomplete_skills_trained = [];
        }
      }
    );
    this.experienceForm.get('additional_industries').valueChanges.subscribe(
      (industry) => {
        if (industry && this.helperService.checkSpacesString(industry)) {
          this.autoCompleteService.autoComplete(industry, 'industries').subscribe(
            dataJson => {
              if (dataJson['success']) {
                this.autocomplete_additional_industries = dataJson['data'];
              }
            },
            error => {
              this.autocomplete_additional_industries = [];
              this.alertsService.show(error.message, AlertType.error);
            }
          );
        } else {
          this.autocomplete_additional_industries = [];
        }
      }
    );
  }

  onSelectSpecificCompany(company: string) {
    this.request_experience.user_specified_company_name = company;
    this.request_experience.company_id = null;
  }
  onSelectCompany(company: Company) {
    this.request_experience.company_id = company.company_id;
    this.request_experience.user_specified_company_name = null;
    this.temp_company = company;
  }
  onBlurCompany() {
    if (this.temp_company) {
      if (this.experienceForm.get('company_name').value !== this.temp_company.company_name) {
        this.onSelectSpecificCompany(this.experienceForm.get('company_name').value);
        this.temp_company = null;
      }
    } else {
      this.onSelectSpecificCompany(this.experienceForm.get('company_name').value);
    }
  }
  checkCompanyNameValidation(): boolean {
    const value = this.experienceForm.get('company_name').value;
    return value && this.helperService.checkSpacesString(value) ? true : false;
  }
  onExperienceMonthSelect(date: any, isStartDate: boolean = true, datePicker: MatDatepicker<any>) {
    if (isStartDate) {
      this.minDate = new Date(date);
    }
    datePicker.close();
    this.experienceForm.get(isStartDate ? 'start_date' : 'end_date').setValue(this.helperService.convertToFormattedString(date, 'MM/YYYY'));
  }

  addSkillsTrained(skill: Skill) {
    if (skill) {
      if (this.skills_trained.filter(skill_trained => skill_trained.skill_id === skill.skill_id).length === 0) {
        this.skills_trained.push(skill);
        if (this.request_experience.skill_ids_trained) {
          this.request_experience.skill_ids_trained.push(skill.skill_id);
        } else {
          this.request_experience.skill_ids_trained = [skill.skill_id];
        }
      }
      this.experienceForm.get('skills_trained').setValue('');
    }
  }
  removeSkillsTrained(arrIndex: number, skill: Skill) {
    if (this.data.editIndex === -1) {
      this.removeSkillsTrainedData(arrIndex, skill);
    } else {
      if (this.data.data[this.data.editIndex].skills_trained.filter(skill_trained => skill_trained.skill_id === skill.skill_id).length > 0) {
        this.userService.deleteSkillTrainedById(this.data.data[this.data.editIndex].work_hist_id, skill.skill_id).subscribe(
          dataJson => {
            this.removeSkillsTrainedData(arrIndex, skill);
          },
          error => {
            this.alertsService.show(error.message, AlertType.error);
          }
        );
      } else {
        this.removeSkillsTrainedData(arrIndex, skill);
      }
    }
  }
  removeSkillsTrainedData(arrIndex: number, skill: Skill) {
    if (this.skills_trained[arrIndex].skill_id === skill.skill_id) {
      this.skills_trained.splice(arrIndex, 1);
      this.request_experience.skill_ids_trained.splice(arrIndex, 1);
      if (this.request_experience.skill_ids_trained.length === 0) {
        this.request_experience.skill_ids_trained = null;
      }
    }
  }
  addAdditionalIndustry(industry: Industry) {
    if (industry) {
      if (this.additional_industries.filter(additional_industry => additional_industry.industry_id === industry.industry_id).length === 0) {
        this.additional_industries.push(industry);
        if (this.request_experience.add_industry_ids) {
          this.request_experience.add_industry_ids.push(industry.industry_id);
        } else {
          this.request_experience.add_industry_ids = [industry.industry_id];
        }
      }
      this.experienceForm.get('additional_industries').setValue('');
    }
  }
  removeAdditionalIndustry(arrIndex: number, industry: Industry) {
    if (this.data.editIndex === -1) {
      this.removeAdditionalIndustryData(arrIndex, industry);
    } else {
      if (this.data.data[this.data.editIndex].add_industries.filter(add_industry => add_industry.industry_id === industry.industry_id).length > 0) {
        this.userService.DeleteAdditionalIndustryById(this.data.data[this.data.editIndex].work_hist_id, industry.industry_id).subscribe(
          dataJson => {
            this.removeAdditionalIndustryData(arrIndex, industry);
          },
          error => {
            this.alertsService.show(error.message, AlertType.error);
          }
        );
      } else {
        this.removeAdditionalIndustryData(arrIndex, industry);
      }
    }
  }
  removeAdditionalIndustryData(arrIndex: number, industry: Industry) {
    if (this.additional_industries[arrIndex].industry_id === industry.industry_id) {
      this.additional_industries.splice(arrIndex, 1);
      this.request_experience.add_industry_ids.splice(arrIndex, 1);
      if (this.request_experience.add_industry_ids.length === 0) {
        this.request_experience.add_industry_ids = null;
      }
    }
  }
  addExperience() {
    if (this.experienceForm.valid && this.checkCompanyNameValidation()) {
      this.userService.postExperienceInfo(this.request_experience).subscribe(
        dataJson => {
          this.data.data.push(dataJson['data']);
          const experience = this.data.data[this.data.data.length - 1];
          this.items_count = 0;
          if (experience.skills_trained && experience.skills_trained.length > 0) {
            this.getSkillsTrained(this.data.data.length - 1);
          } else {
            this.items_count++;
          }
          if (experience.add_industries && experience.add_industries.length > 0) {
            this.getAdditionalIndustries(this.data.data.length - 1);
          } else {
            this.items_count++;
          }
          if (this.items_count === 2) {
            this.dialogRef.close(this.data.data);
          }
        },
        error => {
          this.alertsService.show(error.message, AlertType.error);
        }
      );
    }
  }
  updateExperience() {
    if (this.experienceForm.valid && this.checkCompanyNameValidation()) {
      this.userService.patchExperienceInfoById(this.request_experience, this.data.data[this.data.editIndex].work_hist_id).subscribe(
        dataJson => {
          this.data.data[this.data.editIndex] = dataJson['data'];
          const experience = dataJson['data'];
          this.items_count = 0;
          if (experience.skills_trained && experience.skills_trained.length > 0) {
            this.getSkillsTrained(this.data.editIndex);
          } else {
            this.items_count++;
          }
          if (experience.add_industries && experience.add_industries.length > 0) {
            this.getAdditionalIndustries(this.data.editIndex);
          } else {
            this.items_count++;
          }
          if (this.items_count === 2) {
            this.dialogRef.close(this.data.data);
          }
        },
        error => {
          this.alertsService.show(error.message, AlertType.error);
        }
      );
    }
  }
  getSkillsTrained(arrIndex: number) {
    this.userService.getSkillsTrained(this.data.data[arrIndex].work_hist_id).subscribe(
      dataJson => {
        this.items_count++;
        this.data.data[arrIndex].skills_trained = dataJson.data;
        if (this.items_count === 2) {
          this.dialogRef.close(this.data.data);
        }
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }
  getAdditionalIndustries(arrIndex: number) {
    this.userService.getAdditionalIndustries(this.data.data[arrIndex].work_hist_id).subscribe(
      dataJson => {
        this.items_count++;
        this.data.data[arrIndex].add_industries = dataJson.data;
        if (this.items_count === 2) {
          this.dialogRef.close(this.data.data);
        }
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

  initProjectForm() {
    const projectData: UserProjectItem = this.data.editIndex !== -1 ? this.data.data[this.data.editIndex] : null;

    this.request_project = {
      project_name: projectData ? projectData.project_name : null,
      description: projectData ? projectData.description : null,
      date_finished: projectData ? projectData.date_finished : null,
      href: projectData ? projectData.href : null
    };

    this.projectForm = new FormGroup({
      project_name: new FormControl(projectData ? projectData.project_name : '', [Validators.required]),
      date_finished: new FormControl(projectData && projectData.date_finished ? this.helperService.convertToFormattedString(projectData.date_finished, 'L') : ''),
      description: new FormControl(projectData ? projectData.description : ''),
      href: new FormControl(projectData ? projectData.href : '')
    });

    this.projectForm.get('project_name').valueChanges.subscribe(
      (project_name) => {
        this.request_project.project_name = project_name ? this.helperService.checkSpacesString(project_name) : null;
      }
    );
    this.projectForm.get('description').valueChanges.subscribe(
      (description) => {
        this.request_project.description = description ? this.helperService.checkSpacesString(description) : null;
      }
    );
    this.projectForm.get('date_finished').valueChanges.subscribe(
      (date_finished) => {
        this.request_project.date_finished = date_finished ? date_finished : null;
      }
    );
    this.projectForm.get('href').valueChanges.subscribe(
      (href) => {
        this.request_project.href = href && this.helperService.checkSpacesString(href) && this.helperService.extractLinkString(href) ? this.helperService.extractLinkString(href) : null;
      }
    );
  }
  onChangeProjectFinishedDate(event: any) {
    if (event.value) {
      this.projectForm.get('date_finished').setValue(this.helperService.convertToFormattedString(event.value, 'L'));
    } else {
      this.projectForm.get('date_finished').setValue('');
    }
  }
  checkProjectNameValidation(): boolean {
    const value = this.projectForm.get('project_name').value;
    return value && this.helperService.checkSpacesString(value) ? true : false;
  }
  addProject() {
    if (this.projectForm.valid && this.checkProjectNameValidation()) {
      this.userService.postProjectInfo(this.request_project).subscribe(
        dataJson => {
          this.data.data.push(dataJson['data']);
          this.dialogRef.close(this.data.data);
        },
        error => {
          this.alertsService.show(error.message, AlertType.error);
        }
      );
    }
  }
  updateProject() {
    if (this.projectForm.valid && this.checkProjectNameValidation()) {
      this.userService.patchProjectInfoById(this.request_project, this.data.data[this.data.editIndex].project_id).subscribe(
        dataJson => {
          this.data.data[this.data.editIndex] = dataJson['data'];
          this.dialogRef.close(this.data.data);
        },
        error => {
          this.alertsService.show(error.message, AlertType.error);
        }
      );
    }
  }

  initPublicationForm() {
    const publicationData: UserPublicationItem = this.data.editIndex !== -1 ? this.data.data[this.data.editIndex] : null;

    this.request_publication = {
      publication_title: publicationData ? publicationData.publication_title : null,
      description: publicationData ? publicationData.description : null,
      date_published: publicationData ? publicationData.date_published : null,
      href: publicationData ? publicationData.href : null,
      publisher: publicationData ? publicationData.publisher : null
    };
    this.publicationForm = new FormGroup({
      publication_name: new FormControl(publicationData ? publicationData.publication_title : '', [Validators.required]),
      date_published: new FormControl(publicationData && publicationData.date_published ? this.helperService.convertToFormattedString(publicationData.date_published, 'L') : ''),
      description: new FormControl(publicationData ? publicationData.description : ''),
      href: new FormControl(publicationData ? publicationData.href : '')
    });
    this.publicationForm.get('publication_name').valueChanges.subscribe(
      (publication_title) => {
        this.request_publication.publication_title = publication_title ? this.helperService.checkSpacesString(publication_title) : null;
      }
    );
    this.publicationForm.get('description').valueChanges.subscribe(
      (description) => {
        this.request_publication.description = description ? this.helperService.checkSpacesString(description) : null;
      }
    );
    this.publicationForm.get('date_published').valueChanges.subscribe(
      (date_published) => {
        this.request_publication.date_published = date_published ? date_published : null;
      }
    );
    this.publicationForm.get('href').valueChanges.subscribe(
      (href) => {
        this.request_publication.href = href && this.helperService.checkSpacesString(href) && this.helperService.extractLinkString(href) ? this.helperService.extractLinkString(href) : null;
      }
    );
  }
  onChangeDatePublished(event: any) {
    if (event.value) {
      this.publicationForm.get('date_published').setValue(this.helperService.convertToFormattedString(event.value, 'L'));
    } else {
      this.publicationForm.get('date_published').setValue('');
    }
  }
  checkPublicationNameValidation(): boolean {
    const value = this.publicationForm.get('publication_name').value;
    return value && this.helperService.checkSpacesString(value) ? true : false;
  }
  addPublication() {
    if (this.publicationForm.valid && this.checkPublicationNameValidation()) {
      this.userService.postPublicationsInfo(this.request_publication).subscribe(
        dataJson => {
          this.data.data.push(dataJson['data']);
          this.dialogRef.close(this.data.data);
        },
        error => {
          this.alertsService.show(error.message, AlertType.error);
        }
      );
    }
  }
  updatePublication() {
    if (this.publicationForm.valid && this.checkPublicationNameValidation()) {
      this.userService.patchPublicationsInfoById(this.request_publication, this.data.data[this.data.editIndex].publication_id).subscribe(
        dataJson => {
          this.data.data[this.data.editIndex] = dataJson['data'];
          this.dialogRef.close(this.data.data);
        },
        error => {
          this.alertsService.show(error.message, AlertType.error);
        }
      );
    }
  }

  initExternalResourcesForm() {
    this.externalResourcesForm = new FormGroup({});
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
    this.updateExternalResourceFormGroup();
  }
  onExternalResourceValueChange(resource: string, arrIndex: number, link: string) {
    if (this.externalResourcesDataList[arrIndex].description === resource) {
      this.externalResourcesDataList[arrIndex].link = link && this.helperService.checkSpacesString(link) && this.helperService.extractLinkString(link) ? this.helperService.extractLinkString(link) : null;
    }
  }
  updateExternalResourceFormGroup() {
    const externalResourcesList = this.data.data;
    externalResourcesList.forEach((resource) => {
      this.externalResourcesForm.get(resource.description).setValue(resource.link);
    });
  }
  updateExternalResourceData() {
    let counts = 0;
    const newDataList = [];
    this.externalResourcesDataList.forEach((resource) => {
      const exteralResource = this.data.data.filter(value => value.description === resource.description);
      if (exteralResource.length > 0) {
        if (resource.link) {
          this.userService.patchExternalResourcesById(resource, exteralResource[0].resource_id).subscribe(
            dataJson => {
              counts++;
              if (counts === this.externalResourcesDataList.length) {
                this.getExternalResourceList();
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
                this.getExternalResourceList();
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
            this.getExternalResourceList();
          }
        }
      }
    });
    if (newDataList.length > 0) {
      this.userService.postExternalResourcesInfo(newDataList).subscribe(
        dataJson => {
          counts = counts + newDataList.length;
          if (counts === this.externalResourcesDataList.length) {
            this.getExternalResourceList();
          }
        },
        error => {
          this.alertsService.show(error.message, AlertType.error);
        }
      );
    }
  }
  getExternalResourceList() {
    this.userService.getExternalResourcesInfo().subscribe(
      dataJson => {
        this.dialogRef.close(dataJson['data']);
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
