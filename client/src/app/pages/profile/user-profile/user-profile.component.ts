import { Component, OnInit, HostListener } from '@angular/core';
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
  UserObject
} from 'src/app/models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

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

  containerScrollPosition: number;

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

  onChangedGeneralInfoData(generalInfoData: UserObject) {
    this.generalInfoData.first_name = generalInfoData.first_name;
    this.generalInfoData.last_name = generalInfoData.last_name;
    this.generalInfoData.birthdate = generalInfoData.birthdate;
    this.generalInfoData.gender = generalInfoData.gender;
    this.generalInfoData.city_id = generalInfoData.city_id;
    this.generalInfoData.country_id = generalInfoData.country_id;
    this.generalInfoData.state_id = generalInfoData.state_id;
    this.generalInfoData.title = generalInfoData.title;
    this.generalInfoData.ethnicity = generalInfoData.ethnicity;
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
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
        this.experienceList = [];
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
    this.userService.getSkillsInfo().subscribe(
      dataJson => {
        this.userSkillsList = dataJson['data'];
        this.navMenu[0].items[5].visible = this.userSkillsList && this.userSkillsList.length > 0 ? true : false;
        this.counts++;
        this.checkProfileLoading();
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
        this.userSkillsList = [];
      }
    );
  }
  getUserInterestsList() {
    this.userService.getUserInterestsInfo().subscribe(
      dataJson => {
        this.userInterestsList = dataJson['data'];
        this.navMenu[0].items[6].visible = this.userInterestsList && this.userInterestsList.length > 0 ? true : false;
        this.counts++;
        this.checkProfileLoading();
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
