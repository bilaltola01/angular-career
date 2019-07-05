import { Component, OnInit, Input } from '@angular/core';
import { UserGeneralInfo } from 'src/app/models';
import moment from 'moment';

@Component({
  selector: 'header-section',
  templateUrl: './header-section.component.html',
  styleUrls: ['./header-section.component.scss']
})
export class HeaderSectionComponent implements OnInit {

  @Input() userGeneralInfo: UserGeneralInfo;

  constructor() { }

  ngOnInit() { }

  extractDate(date: string): string {
    return moment.utc(new Date(date)).format('ll');
  }

}
