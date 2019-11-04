import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  PositionService,
  AlertsService,
  AlertType,
} from 'src/app/services';
import { PositionTemplateResponse, PositionInfoResponse } from 'src/app/models';

@Component({
  selector: 'app-position-templates',
  templateUrl: './position-templates.component.html',
  styleUrls: ['./position-templates.component.scss']
})
export class PositionTemplatesComponent implements OnInit {

  position_templates: PositionTemplateResponse[];
  inactive_positions: PositionInfoResponse[];
  is_loading_templates: Boolean;
  is_loading_positions: Boolean;

  constructor(
    private router: Router,
    private alertsService: AlertsService,
    private positionService: PositionService
  ) { }

  ngOnInit() {
    this.getPositionTemplates();
    this.getInactivePositions();
  }

  getPositionTemplates() {
    this.is_loading_templates = true;
    this.positionService.getPositionTemplates().subscribe(
      dataJson => {
        this.position_templates = dataJson['data'];
        this.is_loading_templates = false;
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

  getInactivePositions() {
    this.is_loading_positions = true;
    this.positionService.getPositions().subscribe(
      dataJson => {
        this.inactive_positions = dataJson['data'];
        this.is_loading_positions = false;
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

}
