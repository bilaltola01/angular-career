import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  UserService,
  AlertsService,
  AlertType,
  HelperService
} from 'src/app/services';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent implements OnInit {

  // FormGroup
  passwordResetForm: FormGroup;

  passwordStrength: string;

  strongRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})');
  mediumRegex = new RegExp('^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})');


  constructor (
    private userService: UserService,
    private alertsService: AlertsService,
    private helperService: HelperService
  ) { }

  ngOnInit() {
    this.passwordStrength = 'weak';
    this.initPasswordResetForm();
  }

  initPasswordResetForm() {
    this.passwordResetForm = new FormGroup({
      new_password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirm_password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });

    this.passwordResetForm.get('new_password').valueChanges.subscribe((password) => {
      this.checkPasswordStrength(password);
    });
  }

  checkPasswordStrength(password: string) {
    if (this.strongRegex.test(password)) {
      this.passwordStrength = 'strong';
    } else if (this.mediumRegex.test(password)) {
      this.passwordStrength = 'medium';
    } else {
      this.passwordStrength = 'weak';
    }
  }

  resetPassword() {
    if (this.passwordResetForm.valid && this.passwordResetForm.value.new_password === this.passwordResetForm.value.confirm_password) {
      const newPasswordInfo = {
        new_password: this.passwordResetForm.value.new_password
      };

      this.userService.resetPassword(newPasswordInfo).subscribe(
        data => {
          if (data['success']) {
            console.log(data['message']);
          }
        },
        error => {
          console.log(error['message']);
          this.alertsService.show(error.message, AlertType.error);
        }
      );
    }
  }

}
