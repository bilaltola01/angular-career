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
  UserExternalResourcesItem
} from 'src/app/models';

@Component({
  selector: 'user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  isProfileLoading: boolean;
  isEditProfile: boolean;
  counts: number;

  navMenu = NavMenus.profile;

  userGeneralInfo: UserGeneralInfo;
  educationList: UserEducationItem[];
  experienceList: UserExperienceItem[];
  userSkillsList: UserSkillItem[];
  userInterestsList: UserInterestItem[];
  userProjectsList: UserProjectItem[];
  userPublicationsList: UserPublicationItem[];
  externalResourcesList: UserExternalResourcesItem[];

  constructor(private userService: UserService, private alertsService: AlertsService) { }

  ngOnInit() {
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

  onClickEditProfile() {
    this.isEditProfile = true;
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
        this.counts++;
        this.checkProfileLoading();
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
        this.experienceList = [];
      }
    );
  }
  getUserSkillsList() {
    this.userService.getSkillsInfo().subscribe(
      dataJson => {
        this.userSkillsList = dataJson['data'];
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
        this.counts++;
        this.checkProfileLoading();
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
        this.userInterestsList = [];
      }
    );
  }
  getUserProjectsList() {
    this.userService.getProjectsInfo().subscribe(
      dataJson => {
        this.userProjectsList = dataJson['data']['data'];
        this.counts++;
        this.checkProfileLoading();
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
        this.userProjectsList = [];
      }
    );
  }
  getUserPublicationsList() {
    this.userService.getPublicationsInfo().subscribe(
      dataJson => {
        this.userPublicationsList = dataJson['data'];
        this.counts++;
        this.checkProfileLoading();
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
        this.userPublicationsList = [];
      }
    );
  }
  getExternalResourceList() {
    this.userService.getExternalResourcesInfo().subscribe(
      dataJson => {
        this.externalResourcesList = dataJson['data'];
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
