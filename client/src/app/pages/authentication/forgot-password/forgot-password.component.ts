import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  UserService,
  AlertsService,
  AlertType
} from 'src/app/services';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  // FormGroup
  forgotPasswordForm: FormGroup;
  email_sent: Boolean;

  constructor(
    private router: Router,
    private userService: UserService,
    private alertsService: AlertsService
  ) { }

  ngOnInit() {
    this.initForgotPasswordForm();
  }

  initForgotPasswordForm() {
    this.email_sent = false;
    this.forgotPasswordForm = new FormGroup({
      emailAddress: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(50)])
    });
  }

  sendRequest() {
    if (this.forgotPasswordForm.valid) {
      const forgotPassword = {
        email: this.forgotPasswordForm.value.emailAddress
      };

      this.userService.sendPasswordResetEmail(forgotPassword).subscribe(
        dataJson => {
          if (dataJson['success']) {
            this.email_sent = true;
            this.alertsService.show(dataJson.data.message, AlertType.success);
          }
        },
        error => {
          this.alertsService.show(error.message, AlertType.error);
        }
      );
    }
  }

  clickCancel() {
    this.router.navigate(['/']);
  }

  goToLoginPage() {
    this.router.navigate(['/login']);
  }

}
