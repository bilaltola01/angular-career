import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  PositionService,
  AlertsService,
  AlertType,
  UserStateService,
  HelperService
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
    private userStateService: UserStateService,
    private helperService: HelperService
  ) { }

  ngOnInit() {
    this.getCurrentUserInfo();
    this.offset = 0;
    this.limit = positionListLimit;
    this.open = 0; // open=0 means inactive position
    this.getPositionTemplates();
    this.getInactivePositions();
  }

  /**
   * Get Current user infomation.
   */
  getCurrentUserInfo() {
    this.userStateService.getUser.subscribe(user => {
      this.current_user = user;
    }, error => {
      this.alertsService.show(error.message, AlertType.error);
    });
  }

  /**
   * Get Position templates list from server.
   */
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

  /**
   * Get Inactive positions list from the server.
   * current user is a recruiter for these positions.
   */
  getInactivePositions() {
    let queryString;
    queryString = `offset=${this.offset}`;
    queryString += `&limit=${this.limit}`;
    queryString += `&open=${this.open}`;

    this.is_loading_positions = true;
    this.positionService.getRecruiterPositions(this.current_user.user_id, queryString).subscribe(
      dataJson => {
        this.inactive_positions = dataJson['data']['data'];
        this.is_loading_positions = false;
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

  /**
   * Create a Position with template
   * @param index - array Index
   */
  selectTemplate(index: number) {
    this.router.navigate(['create-position'], { queryParams: { type: 'template', id: this.position_templates[index].template_id } });
  }

  /**
   * Publish an inactive position
   * @param index - array Index
   */
  selectPosition(index: number) {
    this.router.navigate(['create-position'], { queryParams: { type: 'position', id: this.inactive_positions[index].position_id } });
  }

}
