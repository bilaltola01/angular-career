import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'round-checkbox',
  templateUrl: './round-checkbox.component.html',
  styleUrls: ['./round-checkbox.component.scss']
})
export class RoundCheckboxComponent implements OnInit {

  @Input() id = 'checkbox';
  @Input() title: string;
  @Input() checked = false;
  @Input() indeterminate = false;
  @Input() active = true;
  @Output() statusChange = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  toggleCheck() {
    if (this.active) {
      this.checked = !this.checked;
      if (this.checked) {
        this.indeterminate = false;
      }
      this.statusChange.emit(this.checked);
    }
  }

}
