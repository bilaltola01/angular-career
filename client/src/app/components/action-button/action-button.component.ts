import { Component, OnInit, Input, NgModule } from '@angular/core';

@Component({
  // TODO: Fix lint rules
  // tslint:disable-next-line: component-selector
  selector: 'action-button',
  templateUrl: './action-button.component.html',
  styleUrls: ['./action-button.component.scss'],
})

export class ActionButtonComponent implements OnInit {

  @Input() type: string;
  @Input() title: string;
  @Input() color: string;

  constructor() { }

  ngOnInit() {
  }

}
