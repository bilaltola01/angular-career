import { Component, OnInit, Input } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material';

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

  tagClasseNames = {
    'matched': 'tag-matched',
    'missing': 'tag-missing',
    'normal': 'tag-normal',
    'required': 'tag-requied',
    'online': 'tag-online',
  };

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'tag-online',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/tag-online.svg')
    );
    iconRegistry.addSvgIcon(
      'tag-ellipse-gray',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/tag-ellipse-gray.svg')
    );
    iconRegistry.addSvgIcon(
      'tag-ellipse-green',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/tag-ellipse-green.svg')
    );
  }

  ngOnInit() {
  }

}
