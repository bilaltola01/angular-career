import { Component, OnInit, Input } from '@angular/core';
import { UserGeneralInfo } from 'src/app/models';

@Component({
  selector: 'header-section',
  templateUrl: './header-section.component.html',
  styleUrls: ['./header-section.component.scss']
})
export class HeaderSectionComponent implements OnInit {

  @Input() userGeneralInfo: UserGeneralInfo;
  birthdate: Date;

  constructor() { }

  ngOnInit() {
    if (this.userGeneralInfo && this.userGeneralInfo.birthdate) {
      this.birthdate = new Date(this.userGeneralInfo.birthdate);
    }
  }

}
