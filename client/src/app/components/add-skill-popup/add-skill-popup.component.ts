import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { UserSkillItem, Skill, ITEMS_LIMIT } from 'src/app/models';
import { FormGroup, FormControl } from '@angular/forms';
import { UserService, AlertsService, AlertType, HelperService, AutoCompleteService, ProfileStateService } from 'src/app/services';

export interface EditSkillItem {
  index: number;
  skillItem: UserSkillItem;
}

@Component({
  selector: 'app-add-skill-popup',
  templateUrl: './add-skill-popup.component.html',
  styleUrls: ['./add-skill-popup.component.scss']
})
export class AddSkillPopupComponent  {
  userSkillsList: UserSkillItem[];
  autocomplete_skills: Skill[] = [];
   temp_skill: EditSkillItem;
   prevent_skills_autocomplete: boolean;
  skillsForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<AddSkillPopupComponent>, @Inject(MAT_DIALOG_DATA) public data,
  public dialog: MatDialog,
  private userService: UserService,
   private alertsService: AlertsService,
   private autoCompleteService: AutoCompleteService,
   private helperService: HelperService,
   private profileStateService: ProfileStateService ) {
    this.initSkillsForm();
    this.getUserSkillsList(true);
   }
  onClose(): void {
    this.dialogRef.close();
  }
  initSkillsForm() {
    this.autocomplete_skills = [];
    this.prevent_skills_autocomplete = true;
    this.userSkillsList = [];
    this.temp_skill = null;

    this.skillsForm = new FormGroup({
      skills: new FormControl(''),
    });

    this.skillsForm.get('skills').valueChanges.subscribe(
      (skill) => {
        if (skill && this.helperService.checkSpacesString(skill)) {
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
  getUserSkillsList(isUpdate: boolean) {
    this.getUserSkillsListByOffset(ITEMS_LIMIT, 0, isUpdate);
  }
  getUserSkillsListByOffset(limit: number, offset: number, isUpdate: boolean) {
    this.userService.getSkillsInfo(limit, offset).subscribe(
      dataJson => {
        if (offset === 0) {
          this.userSkillsList = dataJson['data'];
        } else {
          this.userSkillsList = this.userSkillsList.slice().concat(dataJson['data']);
        }
        if (dataJson['data'].length === limit) {
          this.getUserSkillsListByOffset(limit, offset + limit, isUpdate);
        } else {
          if (isUpdate) {
            this.profileStateService.setSkills(this.userSkillsList);
          }
        }
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }
  addSkills(skillItem: Skill) {
    const skillItemData = {
      skill_id: skillItem.skill_id,
      skill: skillItem.skill,
      skill_level: 1
    };
    const filterList = this.userSkillsList.filter(value => value.skill_id === skillItemData.skill_id);
    if (filterList.length === 0) {
      this.addUserSkillsData(skillItemData);
    } else {
      this.temp_skill = {
        index: this.userSkillsList.indexOf(filterList[0]),
        skillItem: filterList[0]
      };
    }
    this.skillsForm.get('skills').setValue('');
    this.prevent_skills_autocomplete = true;
  }
  addUserSkillsData(userSkillItem: UserSkillItem) {
    this.userService.postSkillInfo(userSkillItem).subscribe(
      dataJson => {
        this.userSkillsList.push(dataJson['data']);
        this.temp_skill = {
          index: this.userSkillsList.length - 1,
          skillItem: dataJson['data']
        };
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
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
        if (this.temp_skill) {
          this.temp_skill.skillItem = dataJson['data'];
        }
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
        this.temp_skill = null;
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }
  editSkillDone() {
    this.temp_skill = null;
  }
}
