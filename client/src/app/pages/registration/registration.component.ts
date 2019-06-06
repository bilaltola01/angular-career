import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
  first_name: string;
  last_name: string;
  emailAddress: string;
  password: string;

  constructor(private router: Router) {
  }

  ngOnInit() {
    this.currentRole = 0;
    this.first_name = '';
    this.last_name = '';
    this.emailAddress = '';
    this.password = '';
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

  signUp() {}

}
