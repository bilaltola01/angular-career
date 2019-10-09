import { Component, OnInit } from '@angular/core';
import { Router, UrlTree, UrlSegmentGroup, UrlSegment } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  UserService,
  AlertsService,
  AlertType
} from 'src/app/services';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  user_id: string;
  valid_token: string;
  passwordResetForm: FormGroup;
  passwordStrength: string;
  is_done: Boolean;
  is_forgot_password: Boolean;

  strongRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})');
  mediumRegex = new RegExp('^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})');

  constructor(
    private router: Router,
    private userService: UserService,
    private alertsService: AlertsService
  ) { }

  ngOnInit() {
    this.passwordStrength = 'weak';
    this.is_done = false;

    if (this.router.url.includes('change-password')) {
      this.initPasswordChangeForm();
      this.is_forgot_password = false;
    } else {
      const tree: UrlTree = this.router.parseUrl(this.router.url);
      const segmentGroup: UrlSegmentGroup = tree.root.children['primary'];
      if (segmentGroup) {
        const segments: UrlSegment[] = segmentGroup.segments;
        this.user_id = segments[1].path;
        this.valid_token = segments[3].path;
      }
      this.initPasswordResetForm();
      this.is_forgot_password = true;
    }
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

  initPasswordChangeForm() {
    this.passwordResetForm = new FormGroup({
      old_password: new FormControl('', [Validators.required, Validators.minLength(6)]),
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

      this.userService.forgotPassword(newPasswordInfo, this.user_id, this.valid_token).subscribe(
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

  changePassword() {
    if (this.passwordResetForm.valid && this.passwordResetForm.value.new_password === this.passwordResetForm.value.confirm_password) {
      const newPasswordInfo = {
        old_password: this.passwordResetForm.value.old_password,
        new_password: this.passwordResetForm.value.new_password
      };

      this.userService.putPassword(newPasswordInfo).subscribe(
        data => {
          if (data['success']) {
            const token = data.data.token;
            if (token) {
              localStorage.setItem('token', token);
            }
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
