import { Component, OnInit, Input } from '@angular/core';
import { UserGeneralInfo } from 'src/app/models';
import { HelperService } from 'src/app/services';

@Component({
  selector: 'header-section',
  templateUrl: './header-section.component.html',
  styleUrls: ['./header-section.component.scss']
})
export class HeaderSectionComponent implements OnInit {

  @Input() userGeneralInfo: UserGeneralInfo;

  constructor(private helperService: HelperService) { }

  ngOnInit() { }

}
