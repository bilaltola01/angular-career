import { Component, OnInit } from '@angular/core';
import {
  UserService,
  AlertsService,
  AlertType,
  UserStateService,
  ProfileStateService
} from 'src/app/services';
import {
  NavMenus,
  UserGeneralInfo,
  UserEducationItem,
  UserExperienceItem,
  UserSkillItem,
  UserInterestItem,
  UserProjectItem,
  UserPublicationItem,
  UserExternalResourcesItem,
  UserObject,
  ITEMS_LIMIT
} from 'src/app/models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {

  isProfileLoading: boolean;
  editMode: boolean;
  counts: number;

  navMenu: any[];
  isNavMenuOpened: boolean;
  selectedNavMenuIndex: number;

  userGeneralInfo: UserGeneralInfo;
  generalInfoData: UserObject;
  educationList: UserEducationItem[];
  experienceList: UserExperienceItem[];
  userSkillsList: UserSkillItem[];
  userInterestsList: UserInterestItem[];
  userProjectsList: UserProjectItem[];
  userPublicationsList: UserPublicationItem[];
  externalResourcesList: UserExternalResourcesItem[];

  headerFormValid: Boolean;

  constructor(
    private userService: UserService,
    private alertsService: AlertsService,
    private userStateService: UserStateService,
    private profileStateService: ProfileStateService,
    private breakpointObserver: BreakpointObserver
  ) { }

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(['(max-width: 991px)'])
    .pipe(
      map(result => result.matches)
    );

  ngOnInit() {
    this.selectedNavMenuIndex = 0;
    this.isNavMenuOpened = false;
    this.navMenu = NavMenus.profile;
    this.editMode = false;
    this.isProfileLoading = true;
    this.counts = 0;
    this.headerFormValid = false;
    this.getGeneralInfo();
    this.getEducationList();
    this.getExperienceList();
    this.getUserSkillsList();
    this.getUserInterestsList();
    this.getUserProjectsList();
    this.getUserPublicationsList();
    this.getExternalResourceList();
  }

  onSelectNavItem(id: string) {
    let height = 130;
    if (document.getElementById('legend').clientHeight === 0) {
      height = 70;
    }
    document.getElementById('sidenav-content').scrollTop = document.getElementById(id).offsetTop - height;
    this.isNavMenuOpened = false;
  }

  onClickTogggle() {
    this.isNavMenuOpened = !this.isNavMenuOpened;
  }

  onClickEdit() {
    this.editMode = true;
  }

  onSelectNavMenu(navIndex: number) {
    this.selectedNavMenuIndex = navIndex;
  }

  onChangedGeneralInfoData($event: any) {
    this.generalInfoData.photo = $event.data.photo;
    this.generalInfoData.first_name = $event.data.first_name;
    this.generalInfoData.last_name = $event.data.last_name;
    this.generalInfoData.birthdate = $event.data.birthdate;
    this.generalInfoData.gender = $event.data.gender;
    this.generalInfoData.city_id = $event.data.city_id;
    this.generalInfoData.country_id = $event.data.country_id;
    this.generalInfoData.state_id = $event.data.state_id;
    this.generalInfoData.title = $event.data.title;
    this.generalInfoData.ethnicity = $event.data.ethnicity;
    this.headerFormValid = $event.valid;
  }

  onChangeUserIntro(user_intro: string) {
    this.userGeneralInfo.user_intro = user_intro;
    this.generalInfoData.user_intro = user_intro;
  }

  onChangeNavMenuVisibility($event: any) {
    this.navMenu[this.selectedNavMenuIndex].items[$event.navItemIndex].visible = $event.visible;
    if ($event.navItemIndex === 2 && $event.visible) {
      this.getUserSkillsList();
    }
  }

  onClickUpdate() {
    if (this.headerFormValid) {
      this.userService.updateGeneralInfo(this.generalInfoData).subscribe(
        dataJson => {
          this.userGeneralInfo = dataJson['data'];
          this.editMode = false;
          this.isNavMenuOpened = false;
          this.generateGeneralInfoData();
        },
        error => {
          this.alertsService.show(error.message, AlertType.error);
        }
      );
    }
  }

  checkProfileLoading() {
    if (this.counts === 8) {
      this.counts = 0;
      this.isProfileLoading = false;
    }
  }

  generateGeneralInfoData() {
    this.generalInfoData = {
      photo: this.userGeneralInfo.photo ? this.userGeneralInfo.photo : null,
      first_name: this.userGeneralInfo.first_name,
      last_name: this.userGeneralInfo.last_name,
      birthdate: this.userGeneralInfo.birthdate ? this.userGeneralInfo.birthdate : null,
      gender: this.userGeneralInfo.gender,
      phone_num: this.userGeneralInfo.phone_num,
      recruiter: this.userGeneralInfo.recruiter,
      applicant: this.userGeneralInfo.applicant,
      city_id: this.userGeneralInfo.city_id,
      country_id: this.userGeneralInfo.country_id,
      state_id: this.userGeneralInfo.state_id,
      is_looking: this.userGeneralInfo.is_looking,
      title: this.userGeneralInfo.title,
      user_intro: this.userGeneralInfo.user_intro,
      ethnicity: this.userGeneralInfo.ethnicity
    };
  }

  getGeneralInfo() {
    this.userStateService.getUser
    .subscribe(user => {
      if (user) {
        this.userGeneralInfo = user;
        this.checkGeneralInfo();
      } else {
        this.userService.getGeneralInfo().subscribe(
          dataJson => {
            this.userGeneralInfo = dataJson['data'];
            this.userStateService.setUser(this.userGeneralInfo);
            this.checkGeneralInfo();
          },
          error => {
            this.alertsService.show(error.message, AlertType.error);
          }
        );
      }
    }, error => {
      this.alertsService.show(error.message, AlertType.error);
    });
  }

  checkGeneralInfo() {
    this.navMenu[0].items[0].visible = this.userGeneralInfo.user_intro ?  true : false;
    this.counts++;
    this.generateGeneralInfoData();
    this.checkProfileLoading();
  }

  getEducationList() {
    this.profileStateService.getEducations
    .subscribe(educationList => {
      if (educationList) {
        this.educationList = educationList;
        this.checkEducationInfo();
      } else {
        this.userService.getEducationInfo().subscribe(
          dataJson => {
            this.educationList = dataJson['data'];
            this.profileStateService.setEducations(this.educationList);
            this.checkEducationInfo();
          },
          error => {
            this.alertsService.show(error.message, AlertType.error);
          }
        );
      }
    }, error => {
      this.alertsService.show(error.message, AlertType.error);
    });
  }

  checkEducationInfo() {
    this.navMenu[0].items[1].visible = this.educationList && this.educationList.length > 0 ?  true : false;
    this.counts++;
    this.checkProfileLoading();
  }

  getExperienceList() {
    this.profileStateService.getExperiences
    .subscribe(experienceList => {
      if (experienceList) {
        this.experienceList = experienceList;
        this.checkExperienceInfo();
      } else {
        this.userService.getExperienceInfo().subscribe(
          dataJson => {
            this.experienceList = dataJson['data'];
            this.profileStateService.setExperiences(this.experienceList);
            this.checkExperienceInfo();
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
      }
    }, error => {
      this.alertsService.show(error.message, AlertType.error);
    });
  }

  checkExperienceInfo() {
    this.navMenu[0].items[2].visible = this.experienceList && this.experienceList.length > 0 ? true : false;
    this.counts++;
    this.checkProfileLoading();
  }

  getSkillsTrained(arrIndex: number) {
    this.userService.getSkillsTrained(this.experienceList[arrIndex].work_hist_id).subscribe(
      dataJson => {
        this.experienceList[arrIndex].skills_trained = dataJson.data;
        this.profileStateService.setExperiences(this.experienceList);
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
        this.profileStateService.setExperiences(this.experienceList);
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

  getUserPublicationsList() {
    this.profileStateService.getPublications
    .subscribe(publicationsList => {
      if (publicationsList) {
        this.userPublicationsList = publicationsList;
        this.checkPublicationInfo();
      } else {
        this.userService.getPublicationsInfo().subscribe(
          dataJson => {
            this.userPublicationsList = dataJson['data'];
            this.profileStateService.setPublications(this.userPublicationsList);
            this.checkPublicationInfo();
          },
          error => {
            this.alertsService.show(error.message, AlertType.error);
          }
        );
      }
    }, error => {
      this.alertsService.show(error.message, AlertType.error);
    });
  }

  checkPublicationInfo() {
    this.navMenu[0].items[3].visible  = this.userPublicationsList && this.userPublicationsList.length > 0 ? true : false;
    this.counts++;
    this.checkProfileLoading();
  }

  getUserProjectsList() {
    this.profileStateService.getProjects
    .subscribe(projectsList => {
      if (projectsList) {
        this.userProjectsList = projectsList;
        this.checkProjectInfo();
      } else {
        this.userService.getProjectsInfo().subscribe(
          dataJson => {
            this.userProjectsList = dataJson['data']['data'];
            this.profileStateService.setProjects(this.userProjectsList);
            this.checkProjectInfo();
          },
          error => {
            this.alertsService.show(error.message, AlertType.error);
          }
        );
      }
    }, error => {
      this.alertsService.show(error.message, AlertType.error);
    });
  }

  checkProjectInfo() {
    this.navMenu[0].items[4].visible = this.userProjectsList && this.userProjectsList.length > 0 ? true : false;
    this.counts++;
    this.checkProfileLoading();
  }

  getUserSkillsList() {
    this.profileStateService.getSkills
    .subscribe(skillsList => {
      if (skillsList) {
        this.userSkillsList = skillsList;
        this.checkSkillsInfo();
      } else {
        this.getUserSkillsListByOffset(ITEMS_LIMIT, 0);
      }
    }, error => {
      this.alertsService.show(error.message, AlertType.error);
    });
  }

  getUserSkillsListByOffset(limit: number, offset: number) {
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
          this.checkSkillsInfo();
        }
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

  checkSkillsInfo() {
    this.navMenu[0].items[5].visible = this.userSkillsList && this.userSkillsList.length > 0 ? true : false;
    this.counts++;
    this.checkProfileLoading();
  }

  getUserInterestsList() {
    this.profileStateService.getInterests
    .subscribe(interestsList => {
      if (interestsList) {
        this.userInterestsList = interestsList;
        this.checkInterestsInfo();
      } else {
        this.getUserInterestsListByOffset(ITEMS_LIMIT, 0);
      }
    }, error => {
      this.alertsService.show(error.message, AlertType.error);
    });
  }

  getUserInterestsListByOffset(limit: number, offset: number) {
    this.userService.getUserInterestsInfo(limit, offset).subscribe(
      dataJson => {
        if (offset === 0) {
          this.userInterestsList = dataJson['data'];
        } else {
          this.userInterestsList = this.userInterestsList.slice().concat(dataJson['data']);
        }
        if (dataJson['data'].length === limit) {
          this.getUserInterestsListByOffset(limit, offset + limit);
        } else {
          this.profileStateService.setInterests(this.userInterestsList);
          this.checkInterestsInfo();
        }
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

  checkInterestsInfo() {
    this.navMenu[0].items[6].visible = this.userInterestsList && this.userInterestsList.length > 0 ? true : false;
    this.counts++;
    this.checkProfileLoading();
  }

  getExternalResourceList() {
    this.profileStateService.getExternalResources
    .subscribe(externalResourcesList => {
      if (externalResourcesList) {
        this.externalResourcesList = externalResourcesList;
        this.checkExternalResourceInfo();
      } else {
        this.userService.getExternalResourcesInfo().subscribe(
          dataJson => {
            this.externalResourcesList = dataJson['data'];
            this.profileStateService.setExternalResources(this.externalResourcesList);
            this.checkExternalResourceInfo();
          },
          error => {
            this.alertsService.show(error.message, AlertType.error);
          }
        );
      }
    }, error => {
      this.alertsService.show(error.message, AlertType.error);
    });
  }

  checkExternalResourceInfo() {
    this.navMenu[0].items[7].visible = this.externalResourcesList && this.externalResourcesList.length > 0 ? true : false;
    this.counts++;
    this.checkProfileLoading();
  }

}
