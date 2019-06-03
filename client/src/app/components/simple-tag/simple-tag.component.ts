import { Component, OnInit, Input } from '@angular/core';

@Component({
  // TODO: Fix lint rules
  // tslint:disable-next-line: component-selector
  selector: 'simple-tag',
  templateUrl: './simple-tag.component.html',
  styleUrls: ['./simple-tag.component.scss']
})
export class SimpleTagComponent implements OnInit {
  @Input() type: string;
  @Input() title: string;
  @Input() onlineTag = false;
  @Input() ellipseTag = false;
  @Input() value: Number = 0;

  tagClasseNames = {
    'matched': 'tag-matched',
    'missing': 'tag-missing',
    'normal': 'tag-normal',
    'required': 'tag-requied',
  };

  ellipseNumbers: Number = 6;

  numbers = [];

  constructor() {
    this.numbers = Array.from(Array(this.ellipseNumbers), (x, i) => i);
  }

  ngOnInit() {
  }

}
