import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { AlertsService, AlertType } from 'src/app/services/alerts.service';

@Component({
  selector: 'app-style-guide',
  templateUrl: './style-guide.component.html',
  styleUrls: ['./style-guide.component.scss']
})
export class StyleGuideComponent implements OnInit {

  constructor(private userService: UserService,
    private alertsService: AlertsService) { }

  ngOnInit() { }

  openSnackBarError() {
    this.alertsService.show('This is error', AlertType.error);
  }

  openSnackBarWarning() {
    this.alertsService.show('This is warning', AlertType.warning);
  }

  openSnackBarSuccess() {
    this.alertsService.show('This is success', AlertType.success);
  }

}
