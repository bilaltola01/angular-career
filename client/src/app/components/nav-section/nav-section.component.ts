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
  @Output() selectedNavItem = new EventEmitter();

  constructor() { }

  ngOnInit() { }

  onSelectNavItem(id: string) {
    this.selectedNavItem.emit(id);
  }

  onSelectNavMenu(navIndex: number) {
    this.selectNavMenu.emit(navIndex);
  }

  onClickUpdate() {
    this.clickUpdate.emit();
  }

}
