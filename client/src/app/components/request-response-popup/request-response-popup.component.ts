import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService, HelperService, AutoCompleteService, AlertsService, AlertType, ApplicationService } from 'src/app/services';
import { FormGroup, FormControl } from '@angular/forms';
import { User } from 'src/app/models';

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
// getUserContact() {
//     this.userService.getUserContact().subscribe(
//       dataJson => {
//         this.userContactList = dataJson.data;
//       },
//       error => {
//       });
// }
initSearchForm() {
  this.searchForm = new FormGroup({
    searchUser: new FormControl(''),
  });
  this.searchForm.get('searchUser').valueChanges.subscribe((searchUser) => {
    searchUser && this.helperService.checkSpacesString(searchUser) ? this.onSearchPeopleValueChanges(searchUser) : this.autocomplete_searchUser = [];
  });
}
onSearchPeopleValueChanges(searchUser: string) {
  // console.log("seaechParam",searchUser);
  if (!searchUser.includes('@')) {
    this.autoCompleteService.autoComplete(searchUser, 'users').subscribe(
      dataJson => {
        // console.log("dataJson",dataJson);
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
  this.userContactList.unshift(people);
}
acceptContactRequest(i, contact) {
  const userData = {
    'employee_id': contact.user_id,
    'application_id': 26
  };
this.applicationService.postReferenceRequest(userData).subscribe(
  dataJSON => {
    console.log(dataJSON);
    this.userContactList.splice(i, 1);
  }
);

}
deleteContactRequest(i) {
  this.userContactList.splice(i, 1);
}
}


