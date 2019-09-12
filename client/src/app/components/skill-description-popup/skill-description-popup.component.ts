import { Component, OnInit, Inject } from '@angular/core';
import { SkillLevelDescription } from 'src/app/models';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StyleGuideComponent } from 'src/app/pages/style-guide/style-guide.component';

@Component({
  selector: 'app-skill-description-popup',
  templateUrl: './skill-description-popup.component.html',
  styleUrls: ['./skill-description-popup.component.scss']
})
export class SkillDescriptionPopupComponent  {

  skillLevelDescription = SkillLevelDescription;

  constructor(public dialogRef: MatDialogRef<SkillDescriptionPopupComponent>, @Inject(MAT_DIALOG_DATA) public data,
  public dialog: MatDialog) {
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
