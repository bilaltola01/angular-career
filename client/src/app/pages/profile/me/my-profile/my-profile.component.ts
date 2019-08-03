import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { AlertsService, AlertType } from 'src/app/services/alerts.service';
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
    this.getGeneralInfo();
    this.getEducationList();
    this.getExperienceList();
    this.getUserSkillsList();
    this.getUserInterestsList();
    this.getUserProjectsList();
    this.getUserPublicationsList();
    this.getExternalResourceList();
    this.editMode = false;
    this.isProfileLoading = true;
    this.counts = 0;
    this.headerFormValid = false;
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

  onChangeProfileStatus(generalInfoData: UserObject) {
    this.generalInfoData.is_looking = generalInfoData.is_looking;
    this.onClickUpdate();
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
    this.userService.getGeneralInfo().subscribe(
      dataJson => {
        this.userGeneralInfo = dataJson['data'];
        this.navMenu[0].items[0].visible = this.userGeneralInfo.user_intro ?  true : false;
        this.counts++;
        this.generateGeneralInfoData();
        this.checkProfileLoading();
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }
  getEducationList() {
    this.userService.getEducationInfo().subscribe(
      dataJson => {
        this.educationList = dataJson['data'];
        this.navMenu[0].items[1].visible = this.educationList && this.educationList.length > 0 ?  true : false;
        this.counts++;
        this.checkProfileLoading();
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
        this.educationList = [];
      }
    );
  }
  getExperienceList() {
    this.userService.getExperienceInfo().subscribe(
      dataJson => {
        this.experienceList = dataJson['data'];
        this.navMenu[0].items[2].visible = this.experienceList && this.experienceList.length > 0 ? true : false;
        this.counts++;
        this.checkProfileLoading();
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
        this.experienceList = [];
      }
    );
  }
  getSkillsTrained(arrIndex: number) {
    this.userService.getSkillsTrained(this.experienceList[arrIndex].work_hist_id).subscribe(
      dataJson => {
        this.experienceList[arrIndex].skills_trained = dataJson.data;
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
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }
  getUserPublicationsList() {
    this.userService.getPublicationsInfo().subscribe(
      dataJson => {
        this.userPublicationsList = dataJson['data'];
        this.navMenu[0].items[3].visible  = this.userPublicationsList && this.userPublicationsList.length > 0 ? true : false;
        this.counts++;
        this.checkProfileLoading();
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
        this.userPublicationsList = [];
      }
    );
  }
  getUserProjectsList() {
    this.userService.getProjectsInfo().subscribe(
      dataJson => {
        this.userProjectsList = dataJson['data']['data'];
        this.navMenu[0].items[4].visible = this.userProjectsList && this.userProjectsList.length > 0 ? true : false;
        this.counts++;
        this.checkProfileLoading();
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
        this.userProjectsList = [];
      }
    );
  }
  getUserSkillsList() {
    this.getUserSkillsListByOffset(ITEMS_LIMIT, 0);
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
          this.navMenu[0].items[5].visible = this.userSkillsList && this.userSkillsList.length > 0 ? true : false;
          this.counts++;
          this.checkProfileLoading();
        }
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
        this.userSkillsList = [];
      }
    );
  }
  getUserInterestsList() {
    this.getUserInterestsListByOffset(ITEMS_LIMIT, 0);
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
          this.navMenu[0].items[6].visible = this.userInterestsList && this.userInterestsList.length > 0 ? true : false;
          this.counts++;
          this.checkProfileLoading();
        }
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
        this.userInterestsList = [];
      }
    );
  }
  getExternalResourceList() {
    this.userService.getExternalResourcesInfo().subscribe(
      dataJson => {
        this.externalResourcesList = dataJson['data'];
        this.navMenu[0].items[7].visible = this.externalResourcesList && this.externalResourcesList.length > 0 ? true : false;
        this.counts++;
        this.checkProfileLoading();
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
        this.externalResourcesList = [];
      }
    );
  }

}
