import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  PositionService,
  AlertsService,
  AlertType,
  UserStateService
} from 'src/app/services';
import {
  PositionTemplateResponse,
  PositionInfoResponse,
  UserGeneralInfo,
  positionListLimit
} from 'src/app/models';

@Component({
  selector: 'app-position-templates',
  templateUrl: './position-templates.component.html',
  styleUrls: ['./position-templates.component.scss']
})
export class PositionTemplatesComponent implements OnInit {

  current_user: UserGeneralInfo;
  position_templates: PositionTemplateResponse[];
  inactive_positions: PositionInfoResponse[];
  is_loading_templates: Boolean;
  is_loading_positions: Boolean;
  offset: number;
  limit: number;
  open: number;

  constructor(
    private router: Router,
    private alertsService: AlertsService,
    private positionService: PositionService,
    private userStateService: UserStateService
  ) { }

  ngOnInit() {
    this.getCurrentUserInfo();
    this.offset = 0;
    this.limit = positionListLimit;
    this.open = 0;
    this.getPositionTemplates();
    this.getInactivePositions();
  }

  getCurrentUserInfo() {
    this.userStateService.getUser.subscribe(user => {
      this.current_user = user;
    }, error => {
      this.alertsService.show(error.message, AlertType.error);
    });
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
    let queryString;
    queryString = `offset=${this.offset}`;
    queryString += `&limit=${this.limit}`;
    queryString += `&open=${this.open}`;

    this.is_loading_positions = true;
    this.positionService.getRecruiterPositions(this.current_user.user_id, queryString).subscribe(
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
