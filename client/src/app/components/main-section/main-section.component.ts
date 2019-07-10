import { Component, OnInit, Input, Inject } from '@angular/core';
import {
  UserGeneralInfo,
  UserEducationItem,
  UserExperienceItem,
  UserSkillItem,
  UserInterestItem,
  UserProjectItem,
  UserPublicationItem,
  UserExternalResourcesItem,
  Skill,
  Interest
} from 'src/app/models';
import {
  HelperService,
  AutoCompleteService,
  AlertsService,
  AlertType,
  UserService
} from 'src/app/services';
import { FormGroup, FormControl } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';

export interface DialogData {
  category: 'About Me' | 'Education' | 'Experience';
}

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
  @Input() editMode: boolean;

  autocomplete_skills: Skill[] = [];
  autocomplete_interests: Interest[] = [];

  prevent_skills_autocomplete: boolean;
  prevent_interets_autocomplete: boolean;

  skillsSearchForm: FormGroup;
  interestsSearchForm: FormGroup;

  constructor(
    private helperService: HelperService,
    private autoCompleteService: AutoCompleteService,
    private alertsService: AlertsService,
    private userService: UserService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.initSkillsSearchForm();
    this.initInterestsSearchForm();
  }

  openDialog(category: string, data: any) {
    const dialgoRef = this.dialog.open(ProfileDialogContentComponent, {
      data: {
        category: category,
        data: data
      }
    });
    dialgoRef.afterClosed().subscribe(result => {
      console.log('Dialog result: $(result)');
    });
  }

  initSkillsSearchForm() {
    this.autocomplete_skills = [];
    this.prevent_skills_autocomplete = false;

    this.skillsSearchForm = new FormGroup({
      skills: new FormControl('')
    });

    this.skillsSearchForm.get('skills').valueChanges.subscribe(
      (skill) => {
        if (skill) {
          if (!this.prevent_skills_autocomplete) {
            this.autoCompleteService.autoComplete(skill, 'skills').subscribe(
              dataJson => {
                if (dataJson['success']) {
                  this.autocomplete_skills = dataJson['data'];
                }
              },
              error => {
                this.alertsService.show(error.message, AlertType.error);
                this.autocomplete_skills = [];
              }
            );
          } else {
            this.autocomplete_skills = [];
            this.prevent_skills_autocomplete = false;
          }
        } else {
          this.autocomplete_skills = [];
        }
      }
    );
  }

  addSkills(skillItem: Skill) {
    const skillItemData = {
      skill_id: skillItem.skill_id,
      skill: skillItem.skill,
      skill_level: 1
    };
    if (this.userSkillsList.filter(value => value.skill_id === skillItemData.skill_id).length === 0) {
      this.addUserSkillsData(skillItemData);
    }
    this.skillsSearchForm.get('skills').setValue('');
    this.prevent_skills_autocomplete = true;
  }
  onLevelChanged(level: number, index: number) {
    const skillItemData = {
      skill_id: this.userSkillsList[index].skill_id,
      skill: this.userSkillsList[index].skill,
      skill_level: level
    };
    this.updateUserSkillsData(index, skillItemData);
  }
  updateUserSkillsData(arrIndex: number, userSkillItem: UserSkillItem) {
    this.userService.patchSkillInfoById(userSkillItem.skill_id, userSkillItem).subscribe(
      dataJson => {
        this.userSkillsList[arrIndex] = dataJson['data'];
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }
  addUserSkillsData(userSkillItem: UserSkillItem) {
    this.userService.postSkillInfo(userSkillItem).subscribe(
      dataJson => {
        this.userSkillsList.push(dataJson['data']);
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }
  removeUserSkillsData(index: number, userSkillItem: UserSkillItem) {
    this.userService.deleteSkillInfoById(userSkillItem.skill_id).subscribe(
      dataJson => {
        this.userSkillsList.splice(index, 1);
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

  initInterestsSearchForm() {
    this.autocomplete_interests = [];
    this.prevent_interets_autocomplete = false;

    this.interestsSearchForm = new FormGroup({
      interests: new FormControl('')
    });

    this.interestsSearchForm.get('interests').valueChanges.subscribe(
      (interest) => {
        if (interest) {
          if (!this.prevent_interets_autocomplete) {
            this.autoCompleteService.autoComplete(interest, 'interests').subscribe(
              dataJson => {
                if (dataJson['success']) {
                  this.autocomplete_interests = dataJson['data'];
                }
              },
              error => {
                this.alertsService.show(error.message, AlertType.error);
                this.autocomplete_interests = [];
              }
            );
          } else {
            this.autocomplete_interests = [];
            this.prevent_interets_autocomplete = false;
          }
        } else {
          this.autocomplete_interests = [];
        }
      }
    );
  }

  addInterests(interestItem: Interest) {
    const interestItemData = {
      interest_id: interestItem.interest_id,
      interest: interestItem.interest
    };
    if (this.userInterestsList.filter(value => value.interest === interestItem.interest).length === 0) {
      this.addUserInteretsData(interestItemData);
    }
    this.interestsSearchForm.get('interests').setValue('');
    this.prevent_interets_autocomplete = true;
  }

  addUserInteretsData(userInterestItem: UserInterestItem) {
    this.userService.postUserInterestsInfo(userInterestItem).subscribe(
      dataJson => {
        this.userInterestsList.push(dataJson['data']);
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }
  removeUserInteretsData(index: number, userInterestItem: UserInterestItem) {
    this.userService.deleteUserInterestsInfoById(userInterestItem.interest_id).subscribe(
      dataJson => {
        this.userInterestsList.splice(index, 1);
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

}

@Component({
  selector: 'dialog-content',
  templateUrl: './dialog-content.component.html',
  styleUrls: ['./dialog-content.component.scss']
})

export class ProfileDialogContentComponent {
  constructor(
    public dialogRef: MatDialogRef<ProfileDialogContentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    console.log(data);
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
