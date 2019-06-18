import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

import { AlertBarComponent } from './../../components/alert-bar/alert-bar.component';

import { Observable, of } from 'rxjs';
import { AlertsService } from 'src/app/services/alerts.service';

@Component({
  selector: 'app-style-guide',
  templateUrl: './style-guide.component.html',
  styleUrls: ['./style-guide.component.scss']
})
export class StyleGuideComponent implements OnInit {

  constructor(private userService: UserService,
    private alertsService: AlertsService) { }

  ngOnInit() {
    this.userService.loadUsers('offset=0&limit=20&name=Royce').subscribe(
      dataJson => {
        console.log('TCL: StyleGuideComponent -> ngOnInit -> dataJson', dataJson);
      },
      error => console.log(error)
    );
  }

  openSnackBarError() {
    this.alertsService.show('This is error', 'error');
  }

  openSnackBarWarning() {
    this.alertsService.show('This is warning', 'warning');
  }

  openSnackBarSuccess() {
    this.alertsService.show('This is success', 'success');
  }

}
