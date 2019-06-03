import { Component, OnInit, Input } from '@angular/core';

@Component({
  // TODO: Fix lint rules
  // tslint:disable-next-line: component-selector
  selector: 'simple-tag',
  templateUrl: './simple-tag.component.html',
  styleUrls: ['./simple-tag.component.scss']
})
export class SimpleTagComponent implements OnInit {
  @Input() type: String = 'normal';
  @Input() title: String;
  @Input() onlineTag: Boolean = false;
  @Input() ellipseTag: Boolean = false;
  @Input() value: Number = 0;

  tagClasseNames = {
    'green': 'tag-green',
    'red': 'tag-red',
    'gray': 'tag-gray',
    'normal': 'tag-normal'
  };

  ellipseNumbers: Number = 6;

  numbers = [];

  constructor() {
    this.numbers = Array.from(Array(this.ellipseNumbers), (x, i) => i);
  }

  ngOnInit() {
  }

}
