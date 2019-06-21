import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertsService, AlertType } from 'src/app/services/alerts.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  userRoles: object = {
    'applicant': 0,
    'recruiter': 1
  };

  registrationForm: FormGroup;

  currentRole: number;
  isAgreeTerm: boolean;
  passwordStrength: string;

  strongRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})');
  mediumRegex = new RegExp('^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})');

  constructor(private router: Router, private userService: UserService, private alertsService: AlertsService) {
  }

  ngOnInit() {
    this.currentRole = 0;
    this.isAgreeTerm = false;
    this.passwordStrength = 'weak';
    this.initiRegistrationForm();
  }

  initiRegistrationForm() {
    this.registrationForm = new FormGroup({
      first_name: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      last_name: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      emailAddress: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(50)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
    this.registrationForm.controls.password.valueChanges.subscribe((password) => {
      this.checkPasswordStrength(password);
    });
  }

  switchRole(role: string) {
    this.currentRole = this.userRoles[role];
  }

  checkUserRole(role: string) {
    return this.currentRole === this.userRoles[role];
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
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

  signUp() {
    if (this.isAgreeTerm && this.registrationForm.valid) {
      const user = {
        first_name: this.registrationForm.controls.first_name.value,
        last_name: this.registrationForm.controls.last_name.value,
        email: this.registrationForm.controls.emailAddress.value,
        password: this.registrationForm.controls.password.value,
        captcha: 0,
      };
      this.userService.signUp(user).subscribe(
        data => {
          if (data['success']) {
            console.log(data['message']);
            this.router.navigate(['/email-sent']);
          }
        },
        error => {
          console.log(error['message']);
          this.alertsService.show(error.message, AlertType.error);
        }
      );
    }
  }

  toggleAgreeTerm(isAgreeTerm: boolean) {
    this.isAgreeTerm = isAgreeTerm;
  }

}
