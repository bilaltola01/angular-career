import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { FormControl, Validators } from '@angular/forms';
import { AlertsService } from 'src/app/services/alerts.service';

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

  currentRole: number;
  first_name: FormControl;
  last_name: FormControl;
  emailAddress: FormControl;
  password: FormControl;

  isAgreeTerm = false;

  passwordStrength = 'weak';

  strongRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})');
  mediumRegex = new RegExp('^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})');

  constructor(private router: Router, private userService: UserService, private alertsService: AlertsService) {
  }

  ngOnInit() {
    this.currentRole = 0;
    this.first_name = new FormControl('');
    this.first_name.setValidators([Validators.required, Validators.maxLength(20)]);
    this.last_name = new FormControl('');
    this.last_name.setValidators([Validators.required, Validators.maxLength(20)]);
    this.emailAddress = new FormControl('');
    this.emailAddress.setValidators([Validators.required, Validators.email, Validators.maxLength(50)]);
    this.password = new FormControl('');
    this.password.setValidators([Validators.required, Validators.minLength(6)]);

    this.password.valueChanges.subscribe((password) => {
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
    } else if (this.mediumRegex.test(this.password.value)) {
      this.passwordStrength = 'medium';
    } else {
      this.passwordStrength = 'weak';
    }
  }

  signUp() {
    if (this.isAgreeTerm && this.first_name.valid && this.last_name.valid && this.emailAddress.valid && this.password.valid) {
      const user = {
        first_name: this.first_name.value,
        last_name: this.last_name.value,
        email: this.emailAddress.value,
        password: this.password.value,
        captcha: 0,
      };
      this.userService.signUp(user).subscribe(
        data => {
          if (data['success']) {
            console.log(data['message']);
          } else {
            console.log(data['message']);
          }
        },
        error => {
          console.log(error['message']);
          this.alertsService.show(error.message, 'error');
        }
      );
    }
  }

  toggleAgreeTerm(isAgreeTerm: boolean) {
    this.isAgreeTerm = isAgreeTerm;
  }

}
