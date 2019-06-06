import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

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

  constructor(private router: Router, private userService: UserService) { }

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

  navigateToSignUp() {
    this.router.navigate(['/registration']);
  }

  login() {
    if (this.emailAddress !== '' && this.password !== '') {
      const user = {
        email: this.emailAddress,
        password: this.password
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
        }
      );
    }
  }

}
