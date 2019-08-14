import { Component, OnInit } from '@angular/core';
import {
  UserService,
  AlertsService,
  AlertType,
  UserStateService,
  ProfileStateService
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
  selector: 'my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {

  isProfileLoading: boolean;
  editMode: boolean;
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

  headerFormValid: Boolean;

  constructor(
    private userService: UserService,
    private alertsService: AlertsService,
    private userStateService: UserStateService,
    private profileStateService: ProfileStateService,
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private route: ActivatedRoute
  ) {
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
    this.counts = 0;
    this.isNavMenuOpened = false;
    this.isProfileLoading = true;
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

  parseRouterUrl(url: string) {
    if (url.includes('edit')) {
      this.editMode = true;
    } else {
      this.editMode = false;
    }
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

  onClickEdit() {
    if (this.currentPage === 'profile') {
      this.router.navigate(['/my-profile', 'edit'], { relativeTo: this.route });
    } else if (this.currentPage === 'template') {
      this.router.navigate(['/my-template', 'edit'], { relativeTo: this.route });
    }
  }

  navigateToContacts() {
    this.router.navigate(['/my-contacts'], { relativeTo: this.route });
  }

  navigateToIncomingRequests() {
    this.router.navigate(['/my-contacts', 'incoming-requests'], { relativeTo: this.route });
  }

  onChangedGeneralInfoData($event: any) {
    this.generalInfoData = {
      photo: $event.data.photo,
      first_name: $event.data.first_name,
      last_name: $event.data.last_name,
      birthdate: $event.data.birthdate,
      gender: $event.data.gender,
      city_id: $event.data.city_id,
      country_id: $event.data.country_id,
      state_id: $event.data.state_id,
      title: $event.data.title,
      ethnicity: $event.data.ethnicity
    };
    this.headerFormValid = $event.valid;
  }

  onClickUpdate() {
    if (this.currentPage === 'profile' && this.headerFormValid) {
      this.userService.updateGeneralInfo(this.generalInfoData).subscribe(
        dataJson => {
          this.userGeneralInfo = dataJson['data'];
          this.userStateService.setUser(this.userGeneralInfo);
          this.router.navigate(['/my-profile'], { relativeTo: this.route });
        },
        error => {
          this.alertsService.show(error.message, AlertType.error);
        }
      );
    } else if (this.currentPage === 'template') {
      this.router.navigate(['/my-template'], { relativeTo: this.route });
    }
  }

  checkProfileLoading() {
    if (this.counts === 8) {
      this.isProfileLoading = false;
    }
  }

  getGeneralInfo() {
    this.userStateService.getUser
    .subscribe(user => {
      if (user) {
        if (!this.userGeneralInfo) {
          this.checkGeneralInfo();
        }
        this.userGeneralInfo = user;
      } else {
        this.userService.getGeneralInfo().subscribe(
          dataJson => {
            this.checkGeneralInfo();
            this.userGeneralInfo = dataJson['data'];
            this.userStateService.setUser(this.userGeneralInfo);
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
    this.counts++;
    this.checkProfileLoading();
  }

  getEducationList() {
    this.profileStateService.getEducations
    .subscribe(educationList => {
      if (educationList) {
        if (!educationList) {
          this.checkEducationInfo();
        }
        this.educationList = educationList;
      } else {
        this.userService.getEducationInfo().subscribe(
          dataJson => {
            this.checkEducationInfo();
            this.educationList = dataJson['data'];
            this.profileStateService.setEducations(this.educationList);
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
    this.counts++;
    this.checkProfileLoading();
  }

  getExperienceList() {
    this.profileStateService.getExperiences
    .subscribe(experienceList => {
      if (experienceList) {
        if (!this.experienceList) {
          this.checkExperienceInfo();
        }
        this.experienceList = experienceList;
      } else {
        this.userService.getExperienceInfo().subscribe(
          dataJson => {
            this.checkExperienceInfo();
            this.experienceList = dataJson['data'];
            this.profileStateService.setExperiences(this.experienceList);
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
        if (!this.userProjectsList) {
          this.checkPublicationInfo();
        }
        this.userPublicationsList = publicationsList;
      } else {
        this.userService.getPublicationsInfo().subscribe(
          dataJson => {
            this.checkPublicationInfo();
            this.userPublicationsList = dataJson['data'];
            this.profileStateService.setPublications(this.userPublicationsList);
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
    this.counts++;
    this.checkProfileLoading();
  }

  getUserProjectsList() {
    this.profileStateService.getProjects
    .subscribe(projectsList => {
      if (projectsList) {
        if (!this.userProjectsList) {
          this.checkProjectInfo();
        }
        this.userProjectsList = projectsList;
      } else {
        this.userService.getProjectsInfo().subscribe(
          dataJson => {
            this.checkProjectInfo();
            this.userProjectsList = dataJson['data']['data'];
            this.profileStateService.setProjects(this.userProjectsList);
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
    this.counts++;
    this.checkProfileLoading();
  }

  getUserSkillsList() {
    this.profileStateService.getSkills
    .subscribe(skillsList => {
      if (skillsList) {
        if (!this.userSkillsList) {
          this.checkSkillsInfo();
        }
        this.userSkillsList = skillsList;
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
          this.checkSkillsInfo();
          this.profileStateService.setSkills(this.userSkillsList);
        }
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

  checkSkillsInfo() {
    this.counts++;
    this.checkProfileLoading();
  }

  getUserInterestsList() {
    this.profileStateService.getInterests
    .subscribe(interestsList => {
      if (interestsList) {
        if (!this.userInterestsList) {
          this.checkInterestsInfo();
        }
        this.userInterestsList = interestsList;
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
          this.checkInterestsInfo();
          this.profileStateService.setInterests(this.userInterestsList);
        }
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

  checkInterestsInfo() {
    this.counts++;
    this.checkProfileLoading();
  }

  getExternalResourceList() {
    this.profileStateService.getExternalResources
    .subscribe(externalResourcesList => {
      if (externalResourcesList) {
        if (!this.externalResourcesList) {
          this.checkExternalResourceInfo();
        }
        this.externalResourcesList = externalResourcesList;
      } else {
        this.userService.getExternalResourcesInfo().subscribe(
          dataJson => {
            this.checkExternalResourceInfo();
            this.externalResourcesList = dataJson['data'];
            this.profileStateService.setExternalResources(this.externalResourcesList);
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
    this.counts++;
    this.checkProfileLoading();
  }

}
