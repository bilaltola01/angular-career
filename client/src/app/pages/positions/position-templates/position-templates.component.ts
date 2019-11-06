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
  currentPageNumber: number;
  paginationArr: number[];
  preLoadDataObject: object;

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
    this.currentPageNumber = 1;
    this.paginationArr = [];
    this.preLoadDataObject = {};
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
    if (this.preLoadDataObject[this.currentPageNumber]) {
      this.inactive_positions = this.preLoadDataObject[this.currentPageNumber].data;
      this.setPaginationValues(this.preLoadDataObject[this.currentPageNumber].count);
      if (this.currentPageNumber < this.paginationArr[this.paginationArr.length - 1]) {
        this.preLoadNextPage(this.currentPageNumber + 1);
      }
    } else {
      if (this.current_user) {
        let queryString;
        queryString = `offset=${this.offset}`;
        queryString += `&limit=${this.limit}`;
        queryString += `&open=${this.open}`;

        this.is_loading_positions = true;
        this.positionService.getRecruiterPositions(this.current_user.user_id, queryString).subscribe(
          dataJson => {
            if (dataJson['success'] && dataJson.data.data) {
              this.inactive_positions = dataJson.data.data;
              const prelaodData = {
                data: this.inactive_positions.slice(),
                count: dataJson.data.count
              };

              this.setPaginationValues(dataJson.data.count);
              this.is_loading_positions = false;
              this.preLoadDataObject[this.currentPageNumber] = prelaodData;
              if (this.currentPageNumber < this.paginationArr[this.paginationArr.length - 1]) {
                this.preLoadNextPage(this.currentPageNumber + 1);
              }
            }
          },
          error => {
            this.alertsService.show(error.message, AlertType.error);
          }
        );
      }
    }
  }

  preLoadNextPage(nextPageNumber) {
    if (!this.preLoadDataObject[nextPageNumber]) {
      let queryString;
      queryString = `offset=${this.offset + this.limit}`;
      queryString += `&limit=${this.limit}`;
      queryString += `&open=${this.open}`;

      this.positionService.getRecruiterPositions(this.current_user.user_id, queryString).subscribe(
        dataJson => {
          if (dataJson['success'] && dataJson.data.data) {
            const prelaodData = {
              data: dataJson.data.data,
              count: dataJson.data.count
            };
            this.preLoadDataObject[nextPageNumber] = prelaodData;
          }
        },
        error => {
          this.alertsService.show(error.message, AlertType.error);
        }
      );
    }
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

  /**
   * Create a new position
   */
  newPosition() {
    this.router.navigate(['create-position']);
  }

  /**
   * Back to positions search page
   */
  backToPositionsPage() {
    this.router.navigate(['positions']);
  }

  pageClicked(currentPageNumber: number) {
    if (currentPageNumber > 0 && currentPageNumber <= this.paginationArr[this.paginationArr.length - 1]) {
      this.currentPageNumber = currentPageNumber;
      this.offset = this.limit * (this.currentPageNumber - 1);
      this.getInactivePositions();
    }
  }

  setPaginationValues(count: number) {
    let max;
    let min;
    if (this.currentPageNumber >= 5) {
      max = Math.ceil(count / this.limit) <= 6 ? Math.ceil(count / this.limit) + this.currentPageNumber - 1 : this.currentPageNumber + 6;
      min = max > 10 ? max - 9 : 1;
    } else {
      max = Math.ceil((count + this.offset) / this.limit) < 10 ? Math.ceil((count + this.offset) / this.limit) : 10;
      min = 1;
    }

    this.paginationArr = Array(max - min + 1).fill(0).map((x, i) => i + min);
  }

}
