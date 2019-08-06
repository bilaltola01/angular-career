import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { NavMenus } from 'src/app/models';
import { UserStateService, ProfileStateService, AlertsService, AlertType } from 'src/app/services';

@Component({
  selector: 'nav-section',
  templateUrl: './nav-section.component.html',
  styleUrls: ['./nav-section.component.scss']
})
export class NavSectionComponent implements OnInit {

  navMenu: any[] = NavMenus.profile;
  editMode: boolean;
  navIndex: number;

  @Input() isOpened: boolean;
  @Output() clickUpdate = new EventEmitter();
  @Output() selectedNavItem = new EventEmitter();
  @Input() headerFormValid: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userStateService: UserStateService,
    private profileStateService: ProfileStateService,
    private alertsService: AlertsService
  ) {
    this.parseRouterUrl(router.url);
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.parseRouterUrl(val.url);
      }
    });
  }

  ngOnInit() { }

  parseRouterUrl(url: string) {
    if (url.includes('edit')) {
      this.editMode = true;
    } else {
      this.editMode = false;
    }
    if (url.includes('profile')) {
      this.navIndex = 0;
      this.checkNavMenuItemsVisibility();
    } else if (url.includes('contacts')) {
      this.navIndex = 1;
    } else if (url.includes('template')) {
      this.navIndex = 2;
    }
  }

  onSelectNavItem(id: string) {
    this.selectedNavItem.emit(id);
  }

  onSelectNavMenu(navIndex: number) {
    if (!this.editMode) {
      if (navIndex === 0) {
        this.router.navigate(['/me/profile'], { relativeTo: this.route });
      } else if (navIndex === 1) {
        this.router.navigate(['/me/contacts'], { relativeTo: this.route });
      } else if (navIndex === 2) {
        this.router.navigate(['/me/template'], { relativeTo: this.route });
      }
    }
  }

  onClickUpdate() {
    this.clickUpdate.emit();
  }

  checkNavMenuItemsVisibility() {
    this.userStateService.getUser
    .subscribe(user => {
      if (user) {
        this.navMenu[0].items[0].visible = user.user_intro ?  true : false;
      }
    }, error => {
      this.alertsService.show(error.message, AlertType.error);
    });

    this.profileStateService.getEducations
    .subscribe(educationList => {
      if (educationList) {
        this.navMenu[0].items[1].visible = educationList && educationList.length > 0 ?  true : false;
      }
    }, error => {
      this.alertsService.show(error.message, AlertType.error);
    });

    this.profileStateService.getExperiences
    .subscribe(experienceList => {
      if (experienceList) {
        this.navMenu[0].items[2].visible = experienceList && experienceList.length > 0 ? true : false;
      }
    }, error => {
      this.alertsService.show(error.message, AlertType.error);
    });

    this.profileStateService.getPublications
    .subscribe(publicationsList => {
      if (publicationsList) {
        this.navMenu[0].items[3].visible  = publicationsList && publicationsList.length > 0 ? true : false;
      }
    }, error => {
      this.alertsService.show(error.message, AlertType.error);
    });

    this.profileStateService.getProjects
    .subscribe(projectsList => {
      if (projectsList) {
        this.navMenu[0].items[4].visible = projectsList && projectsList.length > 0 ? true : false;
      }
    }, error => {
      this.alertsService.show(error.message, AlertType.error);
    });

    this.profileStateService.getSkills
    .subscribe(skillsList => {
      if (skillsList) {
        this.navMenu[0].items[5].visible = skillsList && skillsList.length > 0 ? true : false;
      }
    }, error => {
      this.alertsService.show(error.message, AlertType.error);
    });

    this.profileStateService.getInterests
    .subscribe(interestsList => {
      if (interestsList) {
        this.navMenu[0].items[6].visible = interestsList && interestsList.length > 0 ? true : false;
      }
    }, error => {
      this.alertsService.show(error.message, AlertType.error);
    });

    this.profileStateService.getExternalResources
    .subscribe(externalResourcesList => {
      if (externalResourcesList) {
        this.navMenu[0].items[7].visible = externalResourcesList && externalResourcesList.length > 0 ? true : false;
      }
    }, error => {
      this.alertsService.show(error.message, AlertType.error);
    });
  }

}
