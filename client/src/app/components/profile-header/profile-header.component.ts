import { Component, OnInit, Input } from '@angular/core';
import { UserGeneralInfo } from 'src/app/models';

@Component({
  selector: 'profile-header',
  templateUrl: './profile-header.component.html',
  styleUrls: ['./profile-header.component.scss']
})
export class ProfileHeaderComponent implements OnInit {

  @Input() userGeneralInfo: UserGeneralInfo;

  constructor() { }

  ngOnInit() {
  }

}
