import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertsService } from 'src/app/services/alerts.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  userRoles: object = {
    'applicant': 0,
    'recruiter': 1
  };

  currentRole: number;
  emailAddress: FormControl;
  password: FormControl;

  isRememberMe = false;

  constructor(private router: Router,
              private userService: UserService,
              private alertsService: AlertsService) { }

  ngOnInit() {
    this.currentRole = 0;
    this.emailAddress = new FormControl('');
    this.emailAddress.setValidators([Validators.required, Validators.email, , Validators.maxLength(50)]);
    this.password = new FormControl('');
    this.password.setValidators([Validators.required, Validators.minLength(6)]);
  }

  switchRole(role: string) {
    this.currentRole = this.userRoles[role];
  }

  checkUserRole(role: string) {
    return this.currentRole === this.userRoles[role];
  }

  navigateToSignUp() {
    this.router.navigate(['/registration']);
  }

  login() {
    if (this.emailAddress.valid && this.password.valid) {
      const user = {
        email: this.emailAddress.value,
        password: this.password.value
      };
      this.userService.login(user).subscribe(
        data => {
          if (data['success']) {
            console.log(data['message']);
            this.router.navigate(['/style-guide']);
          } else {
            console.log(data['message']);
          }
        },
        error => {
          console.log(error);
          this.alertsService.show(error.message, 'error');
        }
      );
    }
  }

  toggleRemember(isRememberMe: boolean) {
    this.isRememberMe = isRememberMe;
  }
}
