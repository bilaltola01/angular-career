import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
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
  @Input() active = false;
  @Input() removeTag = false;
  @Input() isControl = false;
  @Input() removeActive;
  @Output() levelChanged = new EventEmitter();
  @Output() removeClick = new EventEmitter();


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

  onSelectLevel(level: number) {
    if (this.isControl || this.removeActive) {
      this.levelChanged.emit(level + 1);
    }
  }

  onRemove() {
    if (this.isControl) {
      this.removeClick.emit();
    }
  }

}
