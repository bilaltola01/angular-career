import { Component, OnInit, Inject, ErrorHandler } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService, HelperService, AutoCompleteService, AlertsService, AlertType, ApplicationService } from 'src/app/services';
import { FormGroup, FormControl } from '@angular/forms';
import { User } from 'src/app/models';
// import { error } from 'util';



@Component({
  selector: 'app-request-response-popup',
  templateUrl: './request-response-popup.component.html',
  styleUrls: ['./request-response-popup.component.scss']
})
export class RequestResponsePopupComponent implements OnInit {

  userContactList = [];
  searchForm: FormGroup;
  allContanctList = [];
  autocomplete_searchUser: User[] = [];
  applicationId;
  contact_status = false;

  constructor(
    private autoCompleteService: AutoCompleteService,
    private alertsService: AlertsService,
    public helperService: HelperService,
    private userService: UserService,
    private applicationService: ApplicationService,
    public dialogRef: MatDialogRef<RequestResponsePopupComponent>, @Inject(MAT_DIALOG_DATA) public data,
    public dialog: MatDialog) {
    this.applicationId = data;
  }
  ngOnInit() {
    // this.getUserContact();
    this.initSearchForm();

  }
  onClose(): void {
    this.dialogRef.close();

  }
  initSearchForm() {
    this.searchForm = new FormGroup({
      searchUser: new FormControl(''),
    });
    this.searchForm.get('searchUser').valueChanges.subscribe((searchUser) => {
      searchUser && this.helperService.checkSpacesString(searchUser) ? this.onSearchPeopleValueChanges(searchUser) : this.autocomplete_searchUser = [];
    });
  }
  onSearchPeopleValueChanges(searchUser: string) {
    if (!searchUser.includes('@')) {
      this.autoCompleteService.autoComplete(searchUser, 'users').subscribe(
        dataJson => {
          if (dataJson['success']) {
            this.autocomplete_searchUser = dataJson['data'];
          }
        },
        error => {
          this.alertsService.show(error.message, AlertType.error);
          this.autocomplete_searchUser = [];
        }
      );
    } else {
      this.autocomplete_searchUser = [];
    }
  }
  addUser(people) {

    this.applicationService.findExistingEmployeeReference(this.applicationId, people.user_id).subscribe(
      dataJson => {
        if (dataJson) {
          people.status = 'Sent';
          if (this.userContactList.length === 0) {
            this.userContactList.push(people);
          } else {
            const filterList = this.userContactList.filter(value => value.user_id === people.user_id);
            if (filterList.length === 0) {
              this.userContactList.unshift(people);
            }
          }
        }
      },
      error => {
        people.status = 'Send';
        if (this.userContactList.length === 0) {
          this.userContactList.push(people);
        } else {
          const filterList = this.userContactList.filter(value => value.user_id === people.user_id);
          if (filterList.length === 0) {
            this.userContactList.unshift(people);
          }
        }
      }
    );
  }
  sendReferenceRequest(i, contact) {
    const userData = {
      'employee_id': contact.user_id,
      'application_id': this.applicationId
    };
    this.applicationService.postReferenceRequest(userData).subscribe(
      dataJSON => {
        this.userContactList.splice(i, 1);
      });
  }
  deleteContactRequest(i) {
    this.userContactList.splice(i, 1);
  }
}


