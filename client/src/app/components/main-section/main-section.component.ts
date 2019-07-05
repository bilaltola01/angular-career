import { Component, OnInit, Input } from '@angular/core';
import {
  UserGeneralInfo,
  UserEducationItem,
  UserExperienceItem,
  UserSkillItem,
  UserInterestItem,
  UserProjectItem,
  UserPublicationItem,
  UserExternalResourcesItem
} from 'src/app/models';
import moment from 'moment';

@Component({
  selector: 'main-section',
  templateUrl: './main-section.component.html',
  styleUrls: ['./main-section.component.scss']
})
export class MainSectionComponent implements OnInit {

  @Input() selectedNavMenu: string;
  @Input() userGeneralInfo: UserGeneralInfo;
  @Input() educationList: UserEducationItem[];
  @Input() experienceList: UserExperienceItem[];
  @Input() userSkillsList: UserSkillItem[];
  @Input() userInterestsList: UserInterestItem[];
  @Input() userProjectsList: UserProjectItem[];
  @Input() userPublicationsList: UserPublicationItem[];
  @Input() externalResourcesList: UserExternalResourcesItem[];

  constructor() { }

  ngOnInit() {
  }

  extractDate(date: string): string {
    return moment.utc(new Date(date)).format('ll');
  }
  extractYearAndMonth(date: string): string {
    return moment.utc(new Date(date)).format('MMM, YYYY');
  }
  extractYear(date: string): string {
    return moment.utc(new Date(date)).format('YYYY');
  }

  shortDescription(description: string): string {
    if (description && description.length > 150) {
      return description.slice(0, 150) + '...';
    } else {
      return description;
    }
  }

}
