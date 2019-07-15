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

  onWindowsScroll() {
    if (!document.getElementById('nav-section').classList.contains('nav-hidden')) {
      if (!this.containerScrollPosition) {
        this.containerScrollPosition = 0;
      }
      const scrollHeight = document.getElementById('nav-section').offsetHeight - document.body.scrollHeight + 130;
      const scrollPosition = document.getElementById('sidenav-content').scrollTop;

      if (scrollPosition - this.containerScrollPosition > scrollHeight) {
        document.getElementById('sidenav-content').scrollTop = this.containerScrollPosition + scrollHeight;
      } else if (scrollPosition - this.containerScrollPosition < 0) {
        document.getElementById('sidenav-content').scrollTop = this.containerScrollPosition;
      }
    } else {
      this.containerScrollPosition = document.getElementById('sidenav-content').scrollTop;
      document.getElementById('nav-section').style.top = `${this.containerScrollPosition + 130}px`;
    }
  }

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
    window.addEventListener('scroll', this.onWindowsScroll, true);
  }
  ngOnDestory() {
    window.removeEventListener('scroll', this.onWindowsScroll, true);
  }

  onClickTogggle() {
    this.isNavMenuOpened = !this.isNavMenuOpened;
  }

  onClickEdit() {
    this.editMode = true;
    this.isNavMenuOpened = true;
  }

  onSelectNavMenu(navIndex: number) {
    this.selectedNavMenuIndex = navIndex;
  }

  onChangedGeneralInfoData(generalInfoData: UserObject) {
    this.generalInfoData = generalInfoData;
  }

  onClickUpdate() {
    this.userService.updateGeneralInfo(this.generalInfoData).subscribe(
      dataJson => {
        this.userGeneralInfo = dataJson['data'];
        this.editMode = false;
        this.isNavMenuOpened = false;
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
