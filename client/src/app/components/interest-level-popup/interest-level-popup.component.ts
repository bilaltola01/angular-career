import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { DialogData } from '../../pages/application/applications.component';
import { ApplicationService } from 'src/app/services';
@Component({
  selector: 'app-interest-level-popup',
  templateUrl: './interest-level-popup.component.html',
  styleUrls: ['./interest-level-popup.component.scss']
})
export class InterestLevelPopupComponent {
  interestLevelData;


  constructor(private applicationService: ApplicationService,
    public dialogRef: MatDialogRef<InterestLevelPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.interestLevelData = data;
  }

  onNoClick(): void {
    this.dialogRef.close();

  }
  changeInterestLevel() {
    this.dialogRef.close();
    const interestLevelFindQuery = {
      'application_id': this.interestLevelData.data[0].application_id,
      'interest_level': 0
    };
    this.applicationService.patchInterestLevel(interestLevelFindQuery).subscribe(
      () => {
        this.setNewInterestLevel(this.interestLevelData);
      }
    );
  }
  setNewInterestLevel(levelData) {
    const interestLevelQuery = {
      'application_id': levelData.application_id,
      'interest_level': levelData.level
    };
    this.applicationService.patchInterestLevel(interestLevelQuery).subscribe(
      () => {
        this.applicationService.getApplicationFlag = true;
      });

  }
}
