import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ApplicationNavMenus } from 'src/app/models';
import { UserGeneralInfo } from 'src/app/models';
import { AlertsService, AlertType, PositionService, MatchingService, UserStateService, UserService } from 'src/app/services';

@Component({
  selector: 'app-application-nav-section',
  templateUrl: './application-nav-section.component.html',
  styleUrls: ['./application-nav-section.component.scss']
})
export class ApplicationNavSectionComponent implements OnInit {
  applicationNavMenu: any[];
  applicationNavIndex: number;
  editMode: boolean;
  applicationId;
  edit = false;
  filter_list: boolean;
  positionId;
  generalInfo: UserGeneralInfo;
  @Output() selectedNavItem = new EventEmitter();

  constructor(private router: Router,
    private alertsService: AlertsService,
    private positionService: PositionService,
    private matchingService: MatchingService,
    private userStateService: UserStateService,
    private userService: UserService,
    private route: ActivatedRoute) {
    this.applicationId = this.route.snapshot.paramMap.get('application_id');
    this.positionId = this.route.snapshot.paramMap.get('position_id');
    this.applicationId = parseInt(this.applicationId, 10);
    this.applicationNavMenu = ApplicationNavMenus.application;
  }

  ngOnInit() {
    this.parseRouterUrl(this.router.url);
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.parseRouterUrl(val.url);
      }
    });
    this.getUserDetails();
  }
  getUserDetails() {
    this.userStateService.getUser
      .subscribe(user => {
        this.generalInfo = user;
        this.checkNavMenuItemsVisibility(user);
      }, error => {
        this.alertsService.show(error.message, AlertType.error);
      });
  }
  toggleTabOpen() {
    this.filter_list = !this.filter_list;
  }
  parseRouterUrl(url: string) {
    if (url.includes('application-cover-letter')) {
      this.applicationNavIndex = 0;
    } else if (url.includes('profile-information')) {
      this.applicationNavIndex = 1;
    } else if (url.includes('application-template-information')) {
      this.applicationNavIndex = 2;
    } else if (url.includes('application-references')) {
      this.applicationNavIndex = 3;
    } else if (url.includes('position-information')) {
      this.applicationNavIndex = 5;
    }
  }
  onSelectNavItem(id: string) {
    this.selectedNavItem.emit(id);
    this.filter_list = false;
  }
  onSelectNavMenu(navIndex: number) {
    this.edit = true;
    if (!this.editMode) {
      if (navIndex === 0) {
        this.router.navigate([`application-cover-letter`], { relativeTo: this.route });
      } else if (navIndex === 1) {
        this.router.navigate(['profile-information'], { relativeTo: this.route });
      } else if (navIndex === 2) {
        this.router.navigate([`application-template-information`], { relativeTo: this.route });
      } else if (navIndex === 3) {
        this.router.navigate(['application-references'], { relativeTo: this.route });
      } else if (navIndex === 5) {
        this.router.navigate(['position-information'], { relativeTo: this.route });
      }
    }
  }
  checkNavMenuItemsVisibility(user) {
    //  for Position Information
    let missingSkills;
    let matchedSkills;
    this.positionService.getPosition(this.positionId)
      .subscribe(positionInfo => {
        this.applicationNavMenu[5].items[0].visible = positionInfo.data.position ? true : false;
        //  For Position Information
        this.applicationNavMenu[1].items[1].visible =  true;
        //  For Profile Information
        this.applicationNavMenu[5].items[1].visible = !(positionInfo.data.minimum_skills == null) || positionInfo.data.true_fitscore_info.skills_weight > 0 || positionInfo.data.true_fitscore_info.education_weight > 0 || positionInfo.data.true_fitscore_info.experience_weight > 0 || positionInfo.data.true_fitscore_info.interests_weight > 0  ? true : false;
        this.applicationNavMenu[5].items[4].visible = positionInfo.data.position_desc ? true : false;
        this.applicationNavMenu[5].items[5].visible = ((positionInfo.data.preferred_education_levels && positionInfo.data.preferred_education_levels.length > 0) ||
          (positionInfo.data.preferred_majors && positionInfo.data.preferred_majors.length > 0) || (positionInfo.data.preferred_major_categories && positionInfo.data.preferred_major_categories.length > 0 )) ? true : false;
        this.applicationNavMenu[5].items[6].visible = positionInfo.data.preferred_experience && positionInfo.data.preferred_experience.length > 0 ? true : false;
        this.applicationNavMenu[5].items[7].visible = ((positionInfo.data.minimum_skills && positionInfo.data.minimum_skills.length > 0) || (positionInfo.data.preferred_skills && positionInfo.data.preferred_skills.length > 0)) ? true : false;
        this.applicationNavMenu[5].items[8].visible = positionInfo.data.preferred_interests && positionInfo.data.preferred_interests.length > 0 ? true : false;
      }, error => {
        this.alertsService.show(error.message, AlertType.error);
      });
    this.positionService.getRestrictedSchool(this.positionId).subscribe(
      dataJson => {
        const restrictedSchools = dataJson.data['data'];
        this.applicationNavMenu[5].items[9].visible = restrictedSchools && restrictedSchools.length > 0 ? true : false;
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
    this.matchingService.getMissingSkills(this.positionId).subscribe(
      dataJson => {
        matchedSkills = dataJson.data['skills'];
        this.applicationNavMenu[5].items[2].visible = matchedSkills.length > 0 ? true : this.applicationNavMenu[5].items[2].visible === true ? true : false;
        this.applicationNavMenu[1].items[2].visible = matchedSkills.length > 0 ? true : this.applicationNavMenu[1].items[2].visible === true ? true : false;
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
    this.matchingService['getMatchedSkills'](this.positionId).subscribe(
      dataJson => {
        missingSkills = dataJson.data['skills'];
        this.applicationNavMenu[5].items[2].visible = missingSkills && missingSkills.length > 0 ? true : this.applicationNavMenu[5].items[2].visible === true ? true : false;
        this.applicationNavMenu[1].items[2].visible = missingSkills && missingSkills.length > 0 ? true : this.applicationNavMenu[1].items[2].visible === true ? true : false;
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );

    this.matchingService.getinterests(this.positionId).subscribe(
      dataJson => {
        const matchedInterests = dataJson.data['interests'];
        this.applicationNavMenu[5].items[3].visible = matchedInterests && matchedInterests.length > 0 ? true : false;
        this.applicationNavMenu[1].items[3].visible = matchedInterests && matchedInterests.length > 0 ? true : false;
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
    //  for Profile Information
    this.applicationNavMenu[1].items[0].visible = user ? true : false;
    this.applicationNavMenu[1].items[4].visible = user.user_intro  ? true : false;
    // Education data
    this.userService.getEducationInfo(user.user_id).subscribe(
      educationList => {
        this.applicationNavMenu[1].items[5].visible = educationList['data'] && educationList['data'].length > 0 ? true : false;
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
    // Work-Experience data
    this.userService.getExperienceInfo(user.user_id).subscribe(
      experienceList => {
        this.applicationNavMenu[1].items[6].visible = experienceList['data'] && experienceList['data'].length > 0 ? true : false;
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
    //  Skill data
    this.userService.getUserSkills(user.user_id).subscribe(
      userSkillsList => {
        this.applicationNavMenu[1].items[7].visible = userSkillsList['data'] && userSkillsList['data'].length > 0 ? true : false;
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
    //  Interest Data
    this.userService.getUserInterestsList(user.user_id).subscribe(
      interestsList => {
        this.applicationNavMenu[1].items[8].visible = interestsList['data'] && interestsList['data'].length > 0 ? true : false;
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
    // Publication Data
    this.userService.getPublicationsInfo(user.user_id).subscribe(
      userPublicationsList => {
        this.applicationNavMenu[1].items[9].visible = userPublicationsList['data'] && userPublicationsList['data'].length > 0 ? true : false;
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
    // Project Data
    this.userService.getProjectsInfo(user.user_id).subscribe(
      userProjectsList => {
        this.applicationNavMenu[1].items[10].visible = userProjectsList['data'] && userProjectsList['data'].length > 0 ? true : false;
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }
}
