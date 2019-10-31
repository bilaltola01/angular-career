import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { ApplicationService } from '../../../../services/index';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-application-cover-letter',
  templateUrl: './application-cover-letter.component.html',
  styleUrls: ['./application-cover-letter.component.scss']
})
export class ApplicationCoverLetterComponent implements OnInit {

  editMode = false;

  // FormGroup
  coverLetterForm: FormGroup;
  applicationId;
  applicationData = {};
  applicationCoverLetter;
  isJobLoading: boolean;

  constructor(private applicationService: ApplicationService, private route: ActivatedRoute, private router: Router) {

  }
  ngOnInit() {
    const urlObject = this.router.url.split('/');
    for (let i = 0; i < urlObject.length; i++) {
      if (i === 3) {
        this.applicationId = parseInt(urlObject[i], 10);
        this.getApplicationData(this.applicationId);
      }
    }
    this.initCoverLetterForm();
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
    this.isJobLoading = true;
    this.applicationService.getApplication(applicationId).subscribe(
      dataJson => {
        this.isJobLoading = false;
        this.applicationData = dataJson.data;
        this.applicationCoverLetter = dataJson.data['application_cover_letter'];
      }
    );
  }

  updateCoverLetter(letter: string) {
    this.isJobLoading = true;
    const coverLetterQuery = {
      'application_id': this.applicationId,
      'application_cover_letter': letter
    };
    this.applicationService.patchCoverLetter(coverLetterQuery).subscribe(
      () => {
        this.isJobLoading = false;
      });
    this.editMode = false;
  }
  setEdit() {
    this.editMode = true;
  }
}

