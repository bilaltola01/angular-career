import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AlertsService, AlertType, AutoCompleteService, CareerFairService } from '../../../services/index';

import { City, Company, careerFairsListLimit } from 'src/app/models';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';


@Component({
  selector: 'app-careerfair-info',
  templateUrl: './careerfair-info.component.html',
  styleUrls: ['./careerfair-info.component.scss']
})
export class CareerfairInfoComponent implements OnInit {
  careerfairId;

 // FormGroup
 careerFairForm: FormGroup;
 // Autocomplete list
 autocomplete_cities: City[] = [];
 autocomplete_companies: Company[][] = [];


 careerFairsList = [];
 autocomplete_searchposition = [];
 filterAttributes = {
   city_id: null,
   industry_id: null,
   major_id: null,
   school_id: null,
   recruiter_id: null,
   offset: 0,
   limit: careerFairsListLimit
 };


 isJobLoading = true;
 selectedAllFlag = false;
 filter_list: boolean;
 currentPageNumber = 1;
 paginationArr = [];
 preLoadDataObject = {};
 searchQueryParam;
 urlParams = {};
 offsetFlag = false;
 queryFlag = true;
 prequeryFlag = false;
 preLoadDataFlag = true;
 offsetParam;
 urlQueryParameter;
 minDate = new Date;
 careerFairData = [];
 compaiesCount;
 positionsCount;
 currentPage: string;
public Object = Object;
 constructor(private autoCompleteService: AutoCompleteService, private route: ActivatedRoute, private router: Router,
   private alertsService: AlertsService, private careerfairService: CareerFairService) {
    this.careerfairId = this.route.snapshot.paramMap.get('careerfair_id');
    this.getCareerFairInfo(this.careerfairId);
    this.getCareerFairCompaniesCount(this.careerfairId);
    this.getCareerFairPositionsCount(this.careerfairId);
    this.parseRouterUrl(router.url);
    // console.log('router',router.url)
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.parseRouterUrl(val.url);
        // console.log('val.url',val.url)
      }
    });
    // this.getCareerfairCompanies();
 }
 ngOnInit() {
   const urlParams = new URLSearchParams(window.location.search);
   this.searchQueryParam = urlParams.get('search');
   if (this.searchQueryParam) {
     this.preLoadDataFlag = false;
     this.offsetFlag = true;
     const urlObject = this.searchQueryParam.split('&');

     for (let i = 0; i < urlObject.length; i++) {
       const result = urlObject[i].split('=');
       this.urlParams[result[0]] = result[1];
     }
   }

   this.initPositionFilterForm();
   this.getJobData();

 }

 toggleTabMenuOpen() {
   this.filter_list = !this.filter_list;
 }

 parseRouterUrl(url: string) {
  if (url.includes('careerfair-info')) {
    if (url.includes('companies')) {
      this.currentPage = 'companies';
    } else {
      this.currentPage = 'positions';
    }
  }
}
getCareerFairInfo(careerfairId) {
  this.careerfairService.getCareerFairById(careerfairId).subscribe(dataJson => {
    if (dataJson) {
      this.careerFairData.push(dataJson.data);
    }
  },
  error => {
    this.alertsService.show(error.message, AlertType.error);
  });
}
getCareerFairCompaniesCount(careerFairId) {
  this.careerfairService.getCompaniesCount(careerFairId).subscribe( dataJson => {
    if (dataJson) {
      this.compaiesCount = dataJson.data['count'];
    }
  },
  error => {
    this.alertsService.show(error.message, AlertType.error);
  });
}
getCareerFairPositionsCount(careerFairId) {
  this.careerfairService.getPositionsCount(careerFairId).subscribe( dataJson => {
    if (dataJson) {
      this.positionsCount = dataJson.data['count'];
    }
  },
  error => {
    this.alertsService.show(error.message, AlertType.error);
  });
}


 initPositionFilterForm() {
   this.careerFairForm = new FormGroup({
     'searchCompany': new FormControl(null),
     'location': new FormControl(null),
     'company': new FormControl(null),
     'date': new FormControl(null),
   });
   this.careerFairForm.get('location').valueChanges.subscribe((location) => {
     location ? this.onCityValueChanges(location) : this.autocomplete_cities = [];
   });
   this.careerFairForm.get('company').valueChanges.subscribe((company) => {
     company ? this.onCompanyValueChanges(company) : this.autocomplete_companies = [];
   });
 }


 onCityValueChanges(location: string) {
   this.autoCompleteService.autoComplete(location, 'cities').subscribe(
     dataJson => {
       if (dataJson['success']) {
         this.autocomplete_cities = dataJson['data'];
       }
     },
     error => {
       this.alertsService.show(error.message, AlertType.error);
       this.autocomplete_cities = [];
     }
   );
 }
 onCompanyValueChanges(company: string) {
   this.autoCompleteService.autoComplete(company, 'companies').subscribe(
     dataJson => {
       if (dataJson['success']) {
         this.autocomplete_companies = dataJson['data'];
       }
     },
     error => {
       this.alertsService.show(error.message, AlertType.error);
       this.autocomplete_companies = [];
     }
   );
 }
 generateQueryString(): string {
   let queryString;
   // let urlQueryParam;
   queryString = this.careerFairForm.value.location ? `${queryString ? queryString + '&' : ''}location=${this.careerFairForm.value.location ? this.careerFairForm.value.location : ''}` : queryString;
   queryString = this.careerFairForm.value.company ? `${queryString ? queryString + '&' : ''}company=${this.careerFairForm.value.company}` : queryString;
   queryString = this.careerFairForm.value.date ? `${queryString ? queryString + '&' : ''}date=${this.careerFairForm.value.date}` : queryString;
   queryString = queryString ? `${queryString}&offset=${this.filterAttributes.offset}` : `offset=${this.filterAttributes.offset}`;
   queryString = queryString ? `${queryString}&limit=${this.filterAttributes.limit}` : `offset=${this.filterAttributes.limit}`;
   queryString = this.careerFairForm.value.searchCompany ? `${queryString ? queryString + '&' : ''}name=${this.careerFairForm.value.searchCompany}` : queryString;

   return queryString;
 }
 getJobData() {
   this.queryFlag = true;
   this.selectedAllFlag = false;
   if (this.searchQueryParam) {
     this.currentPageNumber = (this.urlParams['offset'] / this.urlParams['limit']) + 1;
   } else {
     this.currentPageNumber = (this.filterAttributes.offset / this.filterAttributes.limit) + 1;
   }

   if (this.preLoadDataObject[this.currentPageNumber]) {
     this.careerFairsList = this.preLoadDataObject[this.currentPageNumber].data.data;

     this.setPaginationValues(this.preLoadDataObject[this.currentPageNumber]);
     if (this.currentPageNumber < this.paginationArr[this.paginationArr.length - 1]) {
       this.preLoadNextPage(this.currentPageNumber + 1);
     } else {
       // this.router.navigate(['/positions'], { queryParams: { search: this.urlQueryParameter ? this.urlQueryParameter : '' } });
     }
   } else {
     this.isJobLoading = true;
     let queryParameters;
     queryParameters = this.generateQueryString();
       this.careerfairService.getPresentcompanies(this.careerfairId , queryParameters).subscribe(
       dataJson => {
         this.isJobLoading = false;
         if (dataJson['success'] && dataJson.data.data) {
           this.careerFairsList = dataJson.data.data;
          //  console.log('careerfair companies',this.careerFairsList)
           this.setPaginationValues(dataJson);
           if (this.currentPageNumber < this.paginationArr[this.paginationArr.length - 1]) {
             this.preLoadNextPage(this.currentPageNumber + 1);
           }
         }
       },
       error => {
         this.isJobLoading = false;
         this.alertsService.show(error.message, AlertType.error);
         this.careerFairsList = [];
       }
     );
   }
 }
 parseReverseCompanySize(companySizeTypes: string): string {
  let company_size = 'Small (1 - 49)';
  if (companySizeTypes.includes('medium')) {
    company_size = 'Medium (50 - 499)';
  } else if (companySizeTypes.includes('large')) {
    company_size = 'Large (500+)';
  }

  return company_size;
}

//  getCareerfairCompanies() {
//   let queryParameters;
//   // queryParameters = this.generateQueryString();
//    this.careerfairService.getPresentcompanies(5).subscribe( dataJson => {
//     if(dataJson) {
//     console.log('comapany',dataJson);
//     }
//     })
//  }
 setPaginationValues(dataJson) {
   let max;
   let min;
   if (this.currentPageNumber >= 5) {
     max = Math.ceil(dataJson.data.count / careerFairsListLimit) <= 6 ? Math.ceil(dataJson.data.count / careerFairsListLimit) + this.currentPageNumber - 1 : this.currentPageNumber + 6;
     min = max > 10 ? max - 9 : 1;
   } else {
     if (this.offsetFlag) {
       this.filterAttributes.offset = parseInt(this.urlParams['offset'], 10);
     }
     max = Math.ceil((dataJson.data.count + this.filterAttributes.offset) / careerFairsListLimit) < 10 ? Math.ceil((dataJson.data.count + this.filterAttributes.offset) / careerFairsListLimit) : 10;
     min = 1;
   }
   this.paginationArr = Array(max - min + 1).fill(0).map((x, i) => i + min);
 }
 clearFilter() {
   const sortValue = this.careerFairForm.value.sortBy;
   const setPositionValue = this.careerFairForm.value.searchCompany;
   this.careerFairForm.reset();
   this.preLoadDataObject = {};
   this.careerFairForm.patchValue({ 'sortBy': sortValue });
   this.careerFairForm.patchValue({ 'searchCompany': setPositionValue });
   this.toggleTabMenuOpen();
 }

 onSearchCareerfair(event) {
   this.prequeryFlag = true;
   this.offsetFlag = false;
   this.filterAttributes.offset = 0;
   this.preLoadDataObject = {};
   this.getJobData();
   event.stopPropagation();
 }

 applyFilter() {
   this.prequeryFlag = true;
   this.offsetFlag = false;
   this.filterAttributes.offset = 0;
   this.toggleTabMenuOpen();
   this.preLoadDataObject = {};
   this.getJobData();
 }
 pageClicked(pageNo) {
   this.prequeryFlag = true;
   this.offsetFlag = false;
   document.getElementById('sidenav-content').scrollTo(0, 0);
   if (pageNo > 0 && pageNo <= this.paginationArr[this.paginationArr.length - 1]) {
     this.currentPageNumber = pageNo;
     this.filterAttributes.offset = ((this.currentPageNumber - 1) * careerFairsListLimit);
     this.offsetParam = this.filterAttributes.offset;
     this.getJobData();

   }

 }
 preLoadNextPage(nextPageNumber) {
   this.queryFlag = false;
   if (!this.preLoadDataObject[nextPageNumber]) {
     const previousOffset = this.filterAttributes.offset;
     this.filterAttributes.offset = this.filterAttributes.offset + careerFairsListLimit;
     const queryString = this.generateQueryString();
     this.careerfairService.getCareerFairs(queryString).subscribe(
       dataJson => {
         if (dataJson['success'] && dataJson) {
           this.preLoadDataObject = {};
           this.preLoadDataObject[nextPageNumber] = dataJson;
         }
         this.filterAttributes.offset = previousOffset;
       },
       error => {
         this.careerFairsList = [];
       }
     );
   }
 }
//  navigateToCompanies() {
//   this.router.navigate([`careerfair-info/${this.careerfairid}/companies`], { relativeTo: this.route });
// }

navigateToPositions() {
  this.router.navigate(['/my-contacts', 'incoming-requests'], { relativeTo: this.route });
}
}
