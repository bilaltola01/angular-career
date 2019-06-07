import { Component, OnInit } from '@angular/core';
import { Router, UrlTree, UrlSegmentGroup, UrlSegment } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss']
})
export class VerificationComponent implements OnInit {

  user_id = '';
  verify_str = '';
  verify_key = '';
  message = 'Email Verification...';
  isVerified = false;

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit() {
    const tree: UrlTree = this.router.parseUrl(this.router.url);
    const segmentGroup: UrlSegmentGroup = tree.root.children['primary'];
    const segments: UrlSegment[] = segmentGroup.segments;

    this.user_id = segments[1].path;
    this.verify_str = segments[2].path;
    this.verify_key = segments[3].path;

    this.emailVerify();
  }

  emailVerify() {
    this.userService.emailVerification(this.user_id, this.verify_str, this.verify_key).subscribe(
      data => {
        this.message = data['message'];
        this.isVerified = data['success'];
      },
      error => {
        this.message = error['message'];
        this.isVerified = false;
      }
    );
  }

}
