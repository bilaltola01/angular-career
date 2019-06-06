import { Component, OnInit } from '@angular/core';
import { ActionButtonComponent } from './../../components/action-button/action-button.component';

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
  emailAddress: string;
  password: string;

  constructor() { }

  ngOnInit() {
    this.currentRole = 0;
    this.emailAddress = '';
    this.password = '';
  }

  switchRole(role: string) {
    this.currentRole = this.userRoles[role];
  }

  checkUserRole(role: string) {
    return this.currentRole === this.userRoles[role];
  }

  navigateToSignUp() {}

  login() {}

}
