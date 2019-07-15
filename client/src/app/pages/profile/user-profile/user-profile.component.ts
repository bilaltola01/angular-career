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
  isEditProfile: boolean;
  counts: number;

  navMenu: any[];
  isNavMenuOpened: boolean;

  userGeneralInfo: UserGeneralInfo;
  generalInfoData: UserObject;
  educationList: UserEducationItem[];
  experienceList: UserExperienceItem[];
  userSkillsList: UserSkillItem[];
  userInterestsList: UserInterestItem[];
  userProjectsList: UserProjectItem[];
  userPublicationsList: UserPublicationItem[];
  externalResourcesList: UserExternalResourcesItem[];

  legendElementYPosition: number;

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

  @HostListener('window:scroll', ['$event'])
  onWindowsScroll() {
    const legendYPosition = document.getElementById('legend').offsetTop;
    if (!this.legendElementYPosition) {
      this.legendElementYPosition = legendYPosition;
    } else {
      if (legendYPosition !== 0 && this.legendElementYPosition !== legendYPosition) {
        this.legendElementYPosition = legendYPosition;
      }
    }

    const scrollPosition = document.documentElement.scrollTop || document.body.scrollTop;

    if (scrollPosition >= this.legendElementYPosition) {
      if (!document.getElementById('legend').classList.contains('legend-fixed')) {
        document.getElementById('legend').classList.add('legend-fixed');
      }
      document.getElementById('nav-section').style.top = `${scrollPosition + 60}px`;
    } else {
      if (document.getElementById('legend').classList.contains('legend-fixed')) {
        document.getElementById('legend').classList.remove('legend-fixed');
      }
      document.getElementById('nav-section').style.top = `${this.legendElementYPosition + 60}px`;
    }
  }

  ngOnInit() {
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
    this.isEditProfile = false;
    this.isProfileLoading = true;
    this.counts = 0;
  }

  onClickTogggle() {
    this.isNavMenuOpened = !this.isNavMenuOpened;
  }

  onClickEdit() {
    this.isEditProfile = true;
  }

  onChangedGeneralInfoData(generalInfoData: UserObject) {
    this.generalInfoData = generalInfoData;
  }

  onClickUpdate() {
    this.userService.updateGeneralInfo(this.generalInfoData).subscribe(
      dataJson => {
        this.userGeneralInfo = dataJson['data'];
        this.isEditProfile = false;
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

  getGeneralInfo() {
    this.userService.getGeneralInfo().subscribe(
      dataJson => {
        this.userGeneralInfo = dataJson['data'];
        this.navMenu[0].items[0].visible = this.userGeneralInfo.user_intro ?  true : false;
        this.counts++;
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
