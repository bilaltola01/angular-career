import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  UserService,
  AlertsService,
  AlertType
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
  is_done: Boolean;

  strongRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})');
  mediumRegex = new RegExp('^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})');


  constructor (
    private router: Router,
    private userService: UserService,
    private alertsService: AlertsService
  ) { }

  ngOnInit() {
    this.passwordStrength = 'weak';
    this.initPasswordResetForm();
    this.is_done = false;
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
            this.is_done = true;
            localStorage.removeItem('token');
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
