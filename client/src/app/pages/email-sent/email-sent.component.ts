import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { AlertsService, AlertType } from 'src/app/services/alerts.service';

@Component({
  selector: 'app-email-sent',
  templateUrl: './email-sent.component.html',
  styleUrls: ['./email-sent.component.scss']
})
export class EmailSentComponent implements OnInit {

  emailSendForm: FormGroup;
  isSent: boolean;

  constructor(private route: ActivatedRoute, private userService: UserService, private alertsService: AlertsService) { }

  ngOnInit() {
    this.isSent = true;
    if (this.route.snapshot.queryParams.from === 'login') {
      this.initEmailSendForm();
    }
  }

  initEmailSendForm() {
    this.isSent = false;
    this.emailSendForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(50)])
    });
  }

  resendEmail() {
    if (this.emailSendForm.valid) {
      const request = {
        email: this.emailSendForm.controls.email.value
      };
      this.userService.resendEmail(request).subscribe(
        data => {
          if (data['success']) {
            console.log(data['message']);
            this.alertsService.show(data.message, AlertType.success);
            this.isSent = true;
          }
        },
        error => {
          console.log(error);
          this.alertsService.show(error.message, AlertType.error);
        }
      );
    }
  }
}
