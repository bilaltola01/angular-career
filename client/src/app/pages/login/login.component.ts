import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertsService, AlertType } from 'src/app/services/alerts.service';
import { UserGeneralInfo } from 'src/app/models';

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

  loginForm: FormGroup;
  currentRole: number;
  isRememberMe = false;

  constructor(private router: Router, private userService: UserService, private alertsService: AlertsService) { }

  ngOnInit() {
    this.initLoginForm();
  }

  private initLoginForm() {
    this.checkStoredUser();
    this.currentRole = 0;

    this.loginForm = new FormGroup({
      emailAddress: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(50)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  private checkStoredUser() {
    const user = this.userService.checkStoredUser();
    if (user) {
      this.router.navigate(['/style-guide']);
    }
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

  navigateToProfilePage(isProfileCreated: boolean) {
    if (isProfileCreated) {
      this.router.navigate(['/my-profile']);
    } else {
      this.router.navigate(['/create-profile']);
    }
  }

  checkProfileCreation(userInfo: UserGeneralInfo) {
    let isProfileCreated = false;
    if (userInfo.applicant === 1 || userInfo.recruiter === 1) {
      isProfileCreated = true;
    }
    this.navigateToProfilePage(isProfileCreated);
  }

  getGeneralInformation() {
    this.userService.getGeneralInfo().subscribe(
      dataJson => {
        const userInfo = dataJson['data'];
        this.checkProfileCreation(userInfo);
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

  login() {
    if (this.loginForm.valid) {
      const user = {
        email: this.loginForm.controls.emailAddress.value,
        password: this.loginForm.controls.password.value
      };
      this.userService.login(user, this.isRememberMe).subscribe(
        data => {
          if (data['success']) {
           this.getGeneralInformation();
          }
        },
        error => {
          console.log(error);
          this.alertsService.show(error.message, AlertType.error);
        }
      );
    }
  }

  toggleRemember(isRememberMe: boolean) {
    this.isRememberMe = isRememberMe;
  }

  goToEmailSentPage() {
    this.router.navigate(['/email-sent'], {queryParams: {from: 'login'}});
  }
}
