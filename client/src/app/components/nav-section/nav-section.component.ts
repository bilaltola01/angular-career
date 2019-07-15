import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'nav-section',
  templateUrl: './nav-section.component.html',
  styleUrls: ['./nav-section.component.scss']
})
export class NavSectionComponent implements OnInit {

  @Input() navMenu: any[];
  @Input() editMode: boolean;
  @Input() isOpened: boolean;
  @Input() navIndex: number;
  @Output() clickUpdate = new EventEmitter();
  @Output() selectNavMenu = new EventEmitter();

  constructor() { }

  ngOnInit() { }

  onSelectNavMenu(navIndex: number) {
    this.selectNavMenu.emit(navIndex);
  }

  onClickUpdate() {
    this.clickUpdate.emit();
  }

}
