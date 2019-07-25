import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AlertsService, AlertType } from '../../../services/alerts.service';
import { AutoCompleteService } from '../../../services/auto-complete.service';
import { PositionService } from '../../../services/position.service';

import {
  Levels, City,
  Level,
  MinimumSalary,
  PositionLevel,
  LatestDatePosted,
  Salary,
  SortBy,
  Industry,
  Company,
  Skill,
  School,
  levelDesc
} from '../../../models';

@Component({
  selector: 'app-position-search',
  templateUrl: './position-search.component.html',
  styleUrls: ['./position-search.component.scss']
})
export class PositionSearchComponent implements OnInit {
  showMoreFlag = false;
  // Constants
  qualificationLevel: Level[] = Levels;
  minimumSalary: string[] = MinimumSalary;
  positionLevel: string[] = PositionLevel;
  latestDatePosted: string[] = LatestDatePosted;
  salary: string[] = Salary;
  sortBy: string[] = SortBy;
  levelDesc = levelDesc;
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
    school_id: null
  };
  constructor(private autoCompleteService: AutoCompleteService, private alertsService: AlertsService, private positionService: PositionService) { }

  ngOnInit() {
    this.initPositionFilterForm();
    this.getJobData();
  }

  reloadResult() {
    this.getJobData();
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
      'sortby': new FormControl('post-date')
    });
    this.positionForm.get('searchPosition').valueChanges.subscribe((searchposition) => {
      searchposition ? this.onSearchPositionValueChanges(searchposition) : this.autocomplete_searchposition = [];
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

  applyfilter() {
    const skillArr = this.userSkillsList.map(skill => skill.skill_id);
    let queryString;
    queryString = this.positionForm.value.minQualificationLvl ? `${queryString ? queryString + '&' : ''}qualification=${this.positionForm.value.minQualificationLvl}` : queryString;
    queryString = this.positionForm.value.city ? `${queryString ? queryString + '&' : ''}city=${this.filterAttributes.city_id}` : queryString;
    queryString = this.positionForm.value.position ? `${queryString ? queryString + '&' : ''}level=${this.positionForm.value.position}` : queryString;
    queryString = this.positionForm.value.industry ? `${queryString ? queryString + '&' : ''}industry=${this.filterAttributes.industry_id}` : queryString;
    queryString = skillArr.length > 0 ? `${queryString ? queryString + '&' : ''}skill=${skillArr}` : queryString;
    queryString = this.positionForm.value.company ? `${queryString ? queryString + '&' : ''}company=${this.positionForm.value.company}` : queryString;
    queryString = this.positionForm.value.salary ? `${queryString ? queryString + '&' : ''}pay=${this.positionForm.value.salary}` : queryString;
    this.getJobData(queryString);
  }
  onSearchPositionValueChanges(searchposition: string) {
    this.autoCompleteService.autoComplete(searchposition, 'positions').subscribe(
      dataJson => {
        if (dataJson['success']) {
          this.autocomplete_searchposition = dataJson['data'];
        }
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
        this.autocomplete_searchposition = [];
      }
    );
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
  getJobData(queryParam?) {
    this.positionService.getPositions(queryParam).subscribe(
      dataJson => {
        if (dataJson['success']) {
          this.positionList = dataJson.data.data;
        }
      },
      error => {
        this.alertsService.show(error.message, AlertType.error);
        this.positionList = [];
      }
    );
  }

}
