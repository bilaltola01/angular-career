import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'nav-section',
  templateUrl: './nav-section.component.html',
  styleUrls: ['./nav-section.component.scss']
})
export class NavSectionComponent implements OnInit {

  @Input() navMenu: any[];
  @Input() editMode: boolean;
  navIndex: number;

  constructor() { }

  ngOnInit() {
    this.navIndex = 0;
  }

  onSelectNavMenu(navIndex: number) {
    this.navIndex = navIndex;
  }

}
