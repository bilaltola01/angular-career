import { Component, OnInit, Input } from '@angular/core';

@Component({
  // TODO: Fix lint rules
  // tslint:disable-next-line: component-selector
  selector: 'simple-tag',
  templateUrl: './simple-tag.component.html',
  styleUrls: ['./simple-tag.component.scss']
})
export class SimpleTagComponent implements OnInit {
  @Input() type = 'normal';
  @Input() title: string;
  @Input() onlineTag = false;
  @Input() ellipseTag = false;
  @Input() value = 0;

  tagClasseNames = {
    'green': 'tag-green',
    'red': 'tag-red',
    'gray': 'tag-gray',
    'normal': 'tag-normal'
  };

  ellipseNumbers: Number = 6;

  numbers = [];

  constructor() {
    this.numbers = Array.from(Array(this.ellipseNumbers), (_, i) => i);
  }

  ngOnInit() {
  }

}
