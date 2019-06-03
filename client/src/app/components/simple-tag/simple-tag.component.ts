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

  tagClasseNames = {
    'matched': 'tag-matched',
    'missing': 'tag-missing',
    'normal': 'tag-normal',
    'required': 'tag-requied'
  };

  constructor() { }

  ngOnInit() {
  }

}
