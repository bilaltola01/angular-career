import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  // TODO: Fix lint rules
  // tslint:disable-next-line: component-selector
  selector: 'round-checkbox',
  templateUrl: './round-checkbox.component.html',
  styleUrls: ['./round-checkbox.component.scss']
})
export class RoundCheckboxComponent implements OnInit {

  @Input() id = 'checkbox';
  @Input() title: string;
  @Input() checked = false;
  @Input() indeterminate = false;
  @Output() statusChange = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  toggleCheck() {
    this.checked = !this.checked;
    if (this.checked) {
      this.indeterminate = false;
    }
    this.statusChange.emit(this.checked);
  }

}
