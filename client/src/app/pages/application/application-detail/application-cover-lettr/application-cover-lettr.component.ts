import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { ApplicationService } from '../../../../services/index';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-application-cover-lettr',
  templateUrl: './application-cover-lettr.component.html',
  styleUrls: ['./application-cover-lettr.component.scss']
})
export class ApplicationCoverLettrComponent implements OnInit {

  editMode = false;

   // FormGroup
   coverLetterForm: FormGroup;
   applicationId;
   applicationData = {} ;
   applicationCoverLetter;

   constructor(private applicationService: ApplicationService, private route: ActivatedRoute) {

   }
   ngOnInit() {
     this.applicationId = this.route.snapshot.paramMap.get('application_id');
     this.applicationId = parseInt(this.applicationId, 10);
     this.initCoverLetterForm();
     this.getApplicationData(this.applicationId);

   }

   initCoverLetterForm() {
     this.coverLetterForm = new FormGroup({
       'letter': new FormControl()
     });
     this.coverLetterForm.patchValue({
      'letter': this.applicationCoverLetter
     });
    }
    getApplicationData(applicationId) {
    this.applicationService.getApplication(applicationId).subscribe(
      dataJson => {
       this.applicationData = dataJson.data;
       this.applicationCoverLetter = dataJson.data['application_cover_letter'];
      }
    );
      }

updateCoverLetter(letter: string, application_id) {
  const coverLetterQuery = {
    'application_id': application_id,
    'application_cover_letter' : letter
  };
  this.applicationService.patchCoverLetter(coverLetterQuery).subscribe();
    this.editMode = false;
}
setEdit() {
   this.editMode = true;
}
}

