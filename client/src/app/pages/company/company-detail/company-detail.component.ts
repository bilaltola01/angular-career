import { Component, OnInit } from '@angular/core';
import {
  AlertsService,
  AlertType,
  CompanyService
} from 'src/app/services';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { CompanyInfoResponse } from 'src/app/models';

@Component({
  selector: 'app-company-detail',
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.scss']
})
export class CompanyDetailComponent implements OnInit {

  company_id: number;
  showBackButton: boolean;
  loading: boolean;
  companyInfo: CompanyInfoResponse;

  constructor(
    private route: ActivatedRoute,
    private alertsService: AlertsService,
    private companyService: CompanyService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.loadBasicCompanyInfo();
  }

  /**
   * Parse query parameters, Retrieve basic company infomation
   */
  loadBasicCompanyInfo() {
    this.company_id = parseInt(this.route.snapshot.queryParamMap.get('id'), 10) || null;
    this.showBackButton = this.route.snapshot.queryParamMap.get('showBackButton') === 'true' || false;

    if (this.company_id) {
      this.getCompanyById(this.company_id);
    }
  }

  getCompanyById(company_id: number) {
    this.companyService.getCompanyById(company_id).subscribe(
      dataJson => {
        this.loading = false;
        this.companyInfo = dataJson['data'];
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
      }
    );
  }

  /**
   * Retrieve positions info
   */
  loadCompanyPositionsInfo() {

  }

  /**
   * Retrieve peoples info
   */
  loadCompanyPeoplesInfo() {

  }

  /**
   * Retrieve CareerFair Info
   */
  loadCareerFairInfo() {

  }

}
