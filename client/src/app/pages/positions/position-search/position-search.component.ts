import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AlertsService, AlertType } from '../../../services/alerts.service';
import { AutoCompleteService } from '../../../services/auto-complete.service';
import { PositionService } from '../../../services/position.service';

import {
  City,
  MinimumSalary,
  PositionLevel,
  LatestDatePosted,
  Salary,
  SortBy,
  Industry,
  Company,
  Skill,
  School,
  SkillLevelDescription,
  QualificationLevel
} from 'src/app/models';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-position-search',
  templateUrl: './position-search.component.html',
  styleUrls: ['./position-search.component.scss']
})
export class PositionSearchComponent implements OnInit, AfterViewInit {
  showMoreFlag = false;
  // Constants
  qualificationLevel: object[] = QualificationLevel;
  minimumSalary: number[] = MinimumSalary;
  positionLevel: string[] = PositionLevel;
  latestDatePosted: string[] = LatestDatePosted;
  salary: number[] = Salary;
  sortBy: object[] = SortBy;
  SkillLevelDescription = SkillLevelDescription;
  // FormGroup
  positionForm: FormGroup;
  // Autocomplete list
  autocomplete_cities: City[] = [];
  autocomplete_skills: Skill[] = [];
  autocomplete_school: School[][] = [];
  autocomplete_additional_industries: Industry[][] = [];
  autocomplete_companies: Company[][] = [];
  userSkillsList = [];
  positionList = [];
  autocomplete_searchposition = [];
  filterAttributes = {
    city_id: null,
    industry_id: null,
    school_id: null,
    offset: 0,
    limit: 20
  };

  isJobLoading = true;
  selectedAllFlag = false;
  constructor(private autoCompleteService: AutoCompleteService, private alertsService: AlertsService, private positionService: PositionService) { }

  ngOnInit() {
    this.initPositionFilterForm();
    this.getJobData();
  }

  ngAfterViewInit(): void {
    this.positionForm.controls.searchPosition.valueChanges
      .pipe(
        debounceTime(1000)
      ).subscribe(data => {
        this.getJobData(true);
      });
  }

  initPositionFilterForm() {
    this.positionForm = new FormGroup({
      'searchPosition': new FormControl(null),
      'minQualificationLvl': new FormControl(null),
      'city': new FormControl(null),
      'skill': new FormControl(null),
      'minSal': new FormControl(null),
      'position': new FormControl(null),
      'industry': new FormControl(null),
      'company': new FormControl(null),
      'post': new FormControl(null),
      'salary': new FormControl(null),
      'school': new FormControl(null),
      'recruiter': new FormControl(null),
      'sortBy': new FormControl('post-date')
    });
    this.positionForm.get('city').valueChanges.subscribe((city) => {
      city ? this.onCityValueChanges(city) : this.autocomplete_additional_industries = [];
    });
    this.positionForm.get('industry').valueChanges.subscribe((industry) => {
      industry ? this.onIndustryValueChanges(industry) : this.autocomplete_additional_industries = [];
    });
    this.positionForm.get('company').valueChanges.subscribe((company) => {
      company ? this.onCompanyValueChanges(company) : this.autocomplete_companies = [];
    });
    this.positionForm.get('skill').valueChanges.subscribe(
      (skill) => {
        skill ? this.onSkillValueChanges(skill) : this.autocomplete_skills = [];
      }
    );
    this.positionForm.get('school').valueChanges.subscribe((school) => {
      school ? this.onSchoolValueChanges(school) : this.autocomplete_school = [];
    });

  }

  onChangeCity(city) {
    this.filterAttributes['city_id'] = city.city_id;
  }

  onChangeIndustry(industry) {
    this.filterAttributes['industry_id'] = industry.industry_id;
  }

  onChangeSchool(school) {
    this.filterAttributes['school_id'] = school.school_id;
  }
  onCityValueChanges(city: string) {
    this.autoCompleteService.autoComplete(city, 'cities').subscribe(
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
  onIndustryValueChanges(industry: string) {
    this.autoCompleteService.autoComplete(industry, 'industries').subscribe(
      dataJson => {
        if (dataJson['success']) {
          this.autocomplete_additional_industries = dataJson['data'];
        }
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
        this.autocomplete_additional_industries = [];
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
  onSkillValueChanges(skill: string) {
    this.autoCompleteService.autoComplete(skill, 'skills').subscribe(
      dataJson => {
        if (dataJson['success']) {
          this.autocomplete_skills = dataJson['data'];
        }
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
        this.autocomplete_skills = [];
      }
    );
  }
  onSchoolValueChanges(school: string) {
    this.autoCompleteService.autoComplete(school, 'schools').subscribe(
      dataJson => {
        if (dataJson['success']) {
          this.autocomplete_school = dataJson['data'];
        }
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
        this.autocomplete_school = [];
      }
    );
  }

  addSkills(skillItem: Skill) {
    this.positionForm.patchValue({ skill: '' });
    this.userSkillsList.push(skillItem);
  }
  removeUserSkillsData(index: number) {
    this.userSkillsList.splice(index, 1);
  }

  generateQueryString(fromSearch): string {
    let queryString;
    if (!fromSearch) {
      const skillArr = this.userSkillsList.map(skill => skill.skill_id);
      queryString = this.positionForm.value.minQualificationLvl ? `${queryString ? queryString + '&' : ''}qualification=${this.positionForm.value.minQualificationLvl}` : queryString;
      queryString = this.positionForm.value.city ? `${queryString ? queryString + '&' : ''}city=${this.filterAttributes.city_id}` : queryString;
      queryString = this.positionForm.value.position ? `${queryString ? queryString + '&' : ''}level=${this.positionForm.value.position}` : queryString;
      queryString = this.positionForm.value.industry ? `${queryString ? queryString + '&' : ''}industry=${this.filterAttributes.industry_id}` : queryString;
      queryString = skillArr.length > 0 ? `${queryString ? queryString + '&' : ''}skill=${skillArr}` : queryString;
      queryString = this.positionForm.value.company ? `${queryString ? queryString + '&' : ''}company=${this.positionForm.value.company}` : queryString;
      queryString = this.positionForm.value.salary ? `${queryString ? queryString + '&' : ''}pay=${this.positionForm.value.salary}` : queryString;
      queryString = this.positionForm.value.sortBy ? `${queryString ? queryString + '&' : ''}sort=${this.positionForm.value.sortBy}` : queryString;
    } else {
      queryString = this.positionForm.value.searchPosition ? `${queryString ? queryString + '&' : ''}position=${this.positionForm.value.searchPosition}` : queryString;
    }

    queryString = queryString ? `${queryString}&offset=${this.filterAttributes.offset}` : `offset=${this.filterAttributes.offset}`;
    queryString = queryString ? `${queryString}&limit=${this.filterAttributes.limit}` : `offset=${this.filterAttributes.limit}`;
    return queryString;
  }
  getJobData(fromSearch = false) {
    this.isJobLoading = true;
    this.selectedAllFlag = false;
    const queryString = this.generateQueryString(fromSearch);
    this.positionService.getPositions(queryString).subscribe(
      dataJson => {
        this.isJobLoading = false;
        if (dataJson['success']) {
          this.positionList = dataJson.data.data;
        }
      },
      error => {
        this.isJobLoading = false;
        this.alertsService.show(error.message, AlertType.error);
        this.positionList = [];
      }
    );
  }

  clearFilter() {
    const sortValue = this.positionForm.value.sortBy;
    this.positionForm.reset();
    this.positionForm.patchValue({ 'sortBy': sortValue });
  }

  selectAll(isChecked) {
    this.selectedAllFlag = isChecked;
    this.positionList = this.positionList.map(job => {
      job['selected'] = isChecked;
      return job;
    });
  }

}
