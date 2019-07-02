import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'action-button',
  templateUrl: './action-button.component.html',
  styleUrls: ['./action-button.component.scss'],
})

export class ActionButtonComponent implements OnInit {

  @Input() type = 'flat';
  @Input() title: string;
  @Input() color: string;
  @Input() done = false;
  @Input() disabled = false;

  constructor() { }

  ngOnInit() {
  }

}
