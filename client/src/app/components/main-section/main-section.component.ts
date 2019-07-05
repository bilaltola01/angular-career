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
import { HelperService } from 'src/app/services';

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

  constructor(private helperService: HelperService) { }

  ngOnInit() {
  }

}
