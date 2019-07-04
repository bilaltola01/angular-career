import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'nav-section',
  templateUrl: './nav-section.component.html',
  styleUrls: ['./nav-section.component.scss']
})
export class NavSectionComponent implements OnInit {

  @Input() navMenu: any[];

  constructor() { }

  ngOnInit() {
  }

}
