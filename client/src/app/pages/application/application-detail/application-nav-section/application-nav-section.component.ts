import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ApplicationNavMenus } from 'src/app/models';

@Component({
  selector: 'app-application-nav-section',
  templateUrl: './application-nav-section.component.html',
  styleUrls: ['./application-nav-section.component.scss']
})
export class ApplicationNavSectionComponent implements OnInit {
  applicationNavMenu: any[];
  applicationNavIndex: number;
  editMode: boolean;
  userId: number;
  applicationId;
  edit = false;
  filter_list: boolean;
  @Output() selectedNavItem = new EventEmitter();

  constructor(private router: Router,
    private route: ActivatedRoute) {
    this.applicationId = this.route.snapshot.paramMap.get('application_id');
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
    }
  }
  onSelectNavItem(id: string) {
    this.selectedNavItem.emit(id);
  }
  onSelectNavMenu(navIndex: number) {
    this.edit = true;
    if (!this.editMode) {
      if (navIndex === 0) {
         this.router.navigate([`application-cover-letter`], {relativeTo: this.route});
         this.filter_list = false;
      } else if (navIndex === 1) {
        // this.router.navigate(['profile-information'], { relativeTo: this.route });
        this.filter_list = false;
      } else if (navIndex === 2) {
        this.router.navigate([`application-template-information`], {relativeTo: this.route});
        this.filter_list = false;
      } else if (navIndex === 3) {
        this.router.navigate(['application-references'], { relativeTo: this.route });
        this.filter_list = false;
      }
    }
  }

}
