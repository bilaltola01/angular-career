import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { UserSkillItem, Skill, ITEMS_LIMIT } from 'src/app/models';
import { FormGroup, FormControl } from '@angular/forms';
import { UserService, AlertsService, AlertType, HelperService, AutoCompleteService, ProfileStateService, PositionService, ScoreService } from 'src/app/services';
import { SkillLevelDescription } from 'src/app/models';
import { SkillDescriptionPopupComponent } from '../skill-description-popup/skill-description-popup.component';


export interface EditSkillItem {
  index: number;
  skillItem: UserSkillItem;
}


@Component({
  selector: 'app-add-skill-popup',
  templateUrl: './add-skill-popup.component.html',
  styleUrls: ['./add-skill-popup.component.scss']
})
export class AddSkillPopupComponent {
  userSkillsList: UserSkillItem[];
  autocomplete_skills: Skill[] = [];

  prevent_skills_autocomplete: boolean;
  skillsForm: FormGroup;
  skillData: UserSkillItem;
  filteredSkill: UserSkillItem;
  allSkills = [];
  skillLevelDescription = SkillLevelDescription;
  skillUpdateCalllback;
  constructor(public dialogRef: MatDialogRef<AddSkillPopupComponent>, @Inject(MAT_DIALOG_DATA) public data,
    public dialog: MatDialog,
    private userService: UserService,
    private alertsService: AlertsService,
    private autoCompleteService: AutoCompleteService,
    private helperService: HelperService,
    private profileStateService: ProfileStateService, private scoreService: ScoreService,
    private positionService: PositionService) {
      this.getUserSkillsList(true);
      this.initSkillsForm();

  }

  onClose(): void {
    this.dialogRef.close();
  }
  initSkillsForm() {
    this.autocomplete_skills = [];
    this.prevent_skills_autocomplete = true;
    this.userSkillsList = [];
    this.skillData = Object.assign({}, this.data.skillData);
    this.skillUpdateCalllback = this.data.callback;
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

  updateSkillData() {
    const filterskill = this.userSkillsList.filter(value => value.skill_id === this.skillData.skill_id);
    if (filterskill.length === 1) {
      this.filteredSkill = {
        skill_id: this.skillData.skill_id,
        skill: this.skillData.skill,
        skill_level: filterskill[0].skill_level > this.skillData.skill_level ?  filterskill[0].skill_level : this.skillData.skill_level
    };
    this.allSkills.push(this.filteredSkill);
    }   else {
      this.allSkills.push(this.skillData);
    }
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
        this.updateSkillData();
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }
  addSkills(skillItem: Skill) {
    let skillItemData = {
      skill_id: skillItem.skill_id,
      skill: skillItem.skill,
      skill_level: 1
    };
    const filterList = this.userSkillsList.filter(value => value.skill_id === skillItemData.skill_id);
    if (filterList.length === 0) {
      const filterData = this.allSkills.filter(value => value.skill_id === skillItemData.skill_id);
      if (filterData.length === 0) {
        this.allSkills.push(skillItemData);
      }
    } else {
      skillItemData = {
        skill_id: skillItem.skill_id,
        skill: skillItem.skill,
        skill_level: filterList[0].skill_level
      };
      const filterData = this.allSkills.filter(value => value.skill_id === skillItemData.skill_id);
      if (filterData.length === 0) {
        this.allSkills.push(skillItemData);
      }
    }
    this.skillsForm.get('skills').setValue('');
    this.prevent_skills_autocomplete = true;

  }

  updateSkills() {
    for (const i of this.allSkills) {
      this.addUserSkillsData(i);
    }
    this.dialogRef.close();
  }
  addUserSkillsData(userSkillItem: UserSkillItem) {
    this.userService.postSkillInfo(userSkillItem).subscribe(
      dataJson => {
        this.userSkillsList.push(dataJson['data']);
        this.skillUpdateCalllback();

      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

  onLevelChanged(level: number, index: number) {
    this.allSkills[index]['skill_level'] = level;
  }
  removeUserSkillsData(index: number, userSkillItem: UserSkillItem) {
    this.allSkills.splice(index, 1);

  }
  openSkillDescriptionDialog() {
    const dialogRef = this.dialog.open(SkillDescriptionPopupComponent, {
      data: { skill : SkillLevelDescription},
      width:  '100vw',
      maxWidth: '880px',
      minWidth: '280px',
      panelClass: ['edit-dialog-container']
    });
  }
}
