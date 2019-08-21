import { Component, OnInit } from '@angular/core';
import {
  UserService,
  AlertsService,
  AlertType,
  UserProfileStateService
} from 'src/app/services';
import {
  UserGeneralInfo,
  UserEducationItem,
  UserExperienceItem,
  UserSkillItem,
  UserInterestItem,
  UserProjectItem,
  UserPublicationItem,
  UserExternalResourcesItem,
  ITEMS_LIMIT
} from 'src/app/models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  userId: number;

  isProfileLoading: boolean;
  counts: number;
  currentPage: string;

  navMenu: any[];
  isNavMenuOpened: boolean;

  userGeneralInfo: UserGeneralInfo;
  generalInfoData: any;
  educationList: UserEducationItem[];
  experienceList: UserExperienceItem[];
  userSkillsList: UserSkillItem[];
  userInterestsList: UserInterestItem[];
  userProjectsList: UserProjectItem[];
  userPublicationsList: UserPublicationItem[];
  externalResourcesList: UserExternalResourcesItem[];

  constructor(
    private userService: UserService,
    private alertsService: AlertsService,
    private userProfileStateService: UserProfileStateService,
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.userId = parseInt(router.url.split('/')[2], 10);
    this.parseRouterUrl(router.url);
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.parseRouterUrl(val.url);
      }
    });
  }

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(['(max-width: 991px)'])
    .pipe(
      map(result => result.matches)
    );

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    this.isNavMenuOpened = false;
    this.isProfileLoading = true;
    this.getGeneralInfo();
    this.getEducationList();
    this.getExperienceList();
    this.getUserSkillsList();
    this.getUserInterestsList();
    this.getUserProjectsList();
    this.getUserPublicationsList();
    this.getExternalResourceList();
  }

  parseRouterUrl(url: string) {
    if (url.includes('profile')) {
      this.currentPage = 'profile';
    } else if (url.includes('contacts')) {
      if (url.includes('incoming-requests')) {
        this.currentPage = 'incoming-requests';
      } else {
        this.currentPage = 'contacts';
      }
    } else  if (url.includes('template')) {
      this.currentPage = 'template';
    }
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

  getGeneralInfo() {
    this.userService.getGeneralInfo(this.userId).subscribe(
      dataJson => {
        this.userGeneralInfo = dataJson['data'];
        if (this.isProfileLoading) {
          this.checkProfileLoading();
        }
        this.userProfileStateService.setUser(this.userGeneralInfo);
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

  getEducationList() {
    this.userService.getEducationInfo(this.userId).subscribe(
      dataJson => {
        this.educationList = dataJson['data'];
        if (this.isProfileLoading) {
          this.checkProfileLoading();
        }
        this.userProfileStateService.setEducations(this.educationList);
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

  getExperienceList() {
    this.userService.getExperienceInfo(this.userId).subscribe(
      dataJson => {
        this.experienceList = dataJson['data'];
        if (this.isProfileLoading) {
          this.checkProfileLoading();
        }
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

  getUserPublicationsList() {
    this.userService.getPublicationsInfo(this.userId).subscribe(
      dataJson => {
        this.userPublicationsList = dataJson['data'];
        if (this.isProfileLoading) {
          this.checkProfileLoading();
        }
        this.userProfileStateService.setPublications(this.userPublicationsList);
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

  getUserProjectsList() {
    this.userService.getProjectsInfo(this.userId).subscribe(
      dataJson => {
        this.userProjectsList = dataJson['data']['data'];
        if (this.isProfileLoading) {
          this.checkProfileLoading();
        }
        this.userProfileStateService.setProjects(this.userProjectsList);
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

  getUserSkillsList() {
    this.getUserSkillsListByOffset(ITEMS_LIMIT, 0);
  }

  getUserSkillsListByOffset(limit: number, offset: number) {
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
          if (this.isProfileLoading) {
            this.checkProfileLoading();
          }
          this.userProfileStateService.setSkills(this.userSkillsList);
        }
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

  getUserInterestsList() {
    this.getUserInterestsListByOffset(ITEMS_LIMIT, 0);
  }

  getUserInterestsListByOffset(limit: number, offset: number) {
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
          if (this.isProfileLoading) {
            this.checkProfileLoading();
          }
          this.userProfileStateService.setInterests(this.userInterestsList);
        }
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

  getExternalResourceList() {
    this.userService.getExternalResourcesInfo(this.userId).subscribe(
      dataJson => {
        this.externalResourcesList = dataJson['data'];
        if (this.isProfileLoading) {
          this.checkProfileLoading();
        }
        this.userProfileStateService.setExternalResources(this.externalResourcesList);
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

  checkProfileLoading() {
    if (this.userGeneralInfo && this.educationList && this.experienceList && this.userSkillsList && this.userInterestsList && this.userProjectsList && this.userPublicationsList && this.externalResourcesList) {
      this.isProfileLoading = false;
    }
  }

}
