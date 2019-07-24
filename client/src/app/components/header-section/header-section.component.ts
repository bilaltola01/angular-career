import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  UserGeneralInfo,
  UserObject,
  Countries,
  City,
  State,
  Genders,
  EthnicityTypes,
  ProfileStatuses
} from 'src/app/models';
import {
  HelperService,
  AlertsService,
  AlertType,
  AutoCompleteService,
} from 'src/app/services';


@Component({
  selector: 'header-section',
  templateUrl: './header-section.component.html',
  styleUrls: ['./header-section.component.scss']
})
export class HeaderSectionComponent implements OnInit {

  @Input() generalInfo: UserGeneralInfo;
  @Input() editMode: boolean;
  @Output() updatedGeneralInfoData = new EventEmitter();
  @Output() updatedProfileStatus = new EventEmitter();

  maxDate = new Date();

  genders: string[] = Genders;
  ethnicityTypes: string[] = EthnicityTypes;
  countries: string[] = Countries.slice().sort();

  generalInfoForm: FormGroup;
  generalInfoData: UserObject;

  autocomplete_cities: City[] = [];
  temp_city: City;
  autocomplete_states: State[] = [];
  temp_state: State;

  profileStatuses = ProfileStatuses;

  constructor(
    private helperService: HelperService,
    private autoCompleteService: AutoCompleteService,
    private alertsService: AlertsService,
  ) { }

  ngOnInit() {
    if (this.generalInfo) {
      this.initGeneralInfoForm();
    }
  }

  onChangeProfileStatus(active: boolean) {
    this.generalInfoData.is_looking = active ? 0 : 1;
    this.updatedProfileStatus.emit(this.generalInfoData);
  }

  initGeneralInfoForm() {
    this.autocomplete_cities = [];
    this.autocomplete_states = [];
    this.temp_city = null;
    this.temp_state = null;

    this.generalInfoForm = new FormGroup({
      first_name: new FormControl(this.generalInfo.first_name ? this.generalInfo.first_name : '', [Validators.required]),
      last_name: new FormControl(this.generalInfo.last_name ? this.generalInfo.last_name : '', [Validators.required]),
      city: new FormControl(this.generalInfo.city ? this.generalInfo.city : ''),
      state: new FormControl(this.generalInfo.state ? this.generalInfo.state : ''),
      country: new FormControl(this.generalInfo.country ? this.generalInfo.country : ''),
      birthdate: new FormControl(this.generalInfo.birthdate ? this.helperService.convertToFormattedString(this.generalInfo.birthdate, 'L') : ''),
      title: new FormControl(this.generalInfo.title ? this.generalInfo.title : '', [Validators.required]),
      ethnicity: new FormControl(this.generalInfo.ethnicity ? this.generalInfo.ethnicity : '', [Validators.required]),
      gender: new FormControl(this.generalInfo.gender ? this.generalInfo.gender : '', [Validators.required])
    });

    this.generalInfoForm.get('first_name').valueChanges.subscribe((first_name) => {
      this.generalInfoData.first_name = first_name;
      this.updatedGeneralInfoData.emit(this.generalInfoData);
    });
    this.generalInfoForm.get('last_name').valueChanges.subscribe((last_name) => {
      this.generalInfoData.last_name = last_name;
      this.updatedGeneralInfoData.emit(this.generalInfoData);
    });
    this.generalInfoForm.get('title').valueChanges.subscribe((title) => {
      this.generalInfoData.title = title;
      this.updatedGeneralInfoData.emit(this.generalInfoData);
    });
    this.generalInfoForm.get('ethnicity').valueChanges.subscribe((ethnicity) => {
      this.generalInfoData.ethnicity = ethnicity;
      this.updatedGeneralInfoData.emit(this.generalInfoData);
    });
    this.generalInfoForm.get('gender').valueChanges.subscribe((gender) => {
      this.generalInfoData.gender = gender;
      this.updatedGeneralInfoData.emit(this.generalInfoData);
    });
    this.generalInfoForm.get('birthdate').valueChanges.subscribe((date) => {
      this.generalInfoData.birthdate = date ? date : null;
      this.updatedGeneralInfoData.emit(this.generalInfoData);
    });
    this.generalInfoForm.get('country').valueChanges.subscribe((country) => {
      if (country) {
        this.generalInfoData.country_id = Countries.indexOf(country) + 1;
      } else {
        this.generalInfoData.country_id = null;
      }
      this.updatedGeneralInfoData.emit(this.generalInfoData);
    });
    this.generalInfoForm.get('city').valueChanges.subscribe((city) => {
      if (city) {
        this.autoCompleteService.autoComplete(city, 'cities').subscribe(
          dataJson => {
            if (dataJson['success']) {
              this.autocomplete_cities = dataJson['data'];
              if (this.autocomplete_cities.length === 0) {
                this.clearCity();
              }
            }
          },
          error => {
            this.alertsService.show(error.message, AlertType.error);
            this.autocomplete_cities = [];
            this.clearCity();
          }
        );
      } else {
        this.autocomplete_cities = [];
        this.clearCity();
      }
    });
    this.generalInfoForm.get('state').valueChanges.subscribe((state) =>  {
      if (state) {
        this.autoCompleteService.autoComplete(state, 'states').subscribe(
          dataJson => {
            if (dataJson['success']) {
              this.autocomplete_states = dataJson['data'];
              if (this.autocomplete_states.length === 0) {
                this.clearState();
              }
            }
          },
          error => {
            this.alertsService.show(error.message, AlertType.error);
            this.autocomplete_states = [];
            this.clearState();
          }
        );
      } else {
        this.autocomplete_states = [];
        this.clearState();
      }
    });

    this.generalInfoData = {
      photo: this.generalInfo.photo ? this.generalInfo.photo : null,
      first_name: this.generalInfo.first_name,
      last_name: this.generalInfo.last_name,
      birthdate: this.generalInfo.birthdate ? this.generalInfo.birthdate : null,
      gender: this.generalInfo.gender,
      phone_num: this.generalInfo.phone_num,
      recruiter: this.generalInfo.recruiter,
      applicant: this.generalInfo.applicant,
      city_id: this.generalInfo.city_id,
      country_id: this.generalInfo.country_id,
      state_id: this.generalInfo.state_id,
      is_looking: this.generalInfo.is_looking,
      title: this.generalInfo.title,
      user_intro: this.generalInfo.user_intro,
      ethnicity: this.generalInfo.ethnicity
    };
    this.updatedGeneralInfoData.emit(this.generalInfoData);
  }

  onChangeBirthDate(date: any) {
    if (date.value) {
      this.generalInfoForm.get('birthdate').setValue(this.helperService.convertToFormattedString(date.value, 'L'));
    } else {
      this.generalInfoForm.get('birthdate').setValue('');
    }
  }

  onCountryValueChanges(country: string) {
    this.generalInfoData.country_id = Countries.indexOf(country) + 1;
    this.updatedGeneralInfoData.emit(this.generalInfoData);
  }

  onSelectCity(city: City) {
    this.generalInfoData.city_id = city.city_id;
    this.temp_city = city;
    this.updatedGeneralInfoData.emit(this.generalInfoData);
  }
  onBlurCity() {
    if (this.temp_city) {
      if (this.generalInfoForm.get('city').value !== this.helperService.cityNameFromAutoComplete(this.temp_city.city)) {
        this.clearCity();
        this.temp_city = null;
      }
    } else {
      if (this.generalInfoForm.get('city').value !== this.generalInfo.city) {
        this.clearCity();
      }
    }
  }
  checkCityValidation(): boolean {
    let valid = false;
    if (this.temp_city) {
      valid = this.generalInfoForm.get('city').value === this.helperService.cityNameFromAutoComplete(this.temp_city.city);
    } else {
      if (!this.generalInfoForm.get('city').value) {
        valid = true;
      } else {
        valid = this.generalInfoForm.get('city').value === this.generalInfo.city;
      }
    }
    return valid;
  }
  clearCity() {
    this.generalInfoData.city_id = null;
    this.updatedGeneralInfoData.emit(this.generalInfoData);
  }
  onSelectState(state: State) {
    this.generalInfoData.state_id = state.state_id;
    this.temp_state = state;
    this.updatedGeneralInfoData.emit(this.generalInfoData);
  }
  onBlurState() {
    if (this.temp_state) {
      if (this.generalInfoForm.get('state').value !== this.temp_state.state) {
        this.clearState();
        this.temp_state = null;
      }
    } else {
      if (this.generalInfoForm.get('state').value !== this.generalInfo.state) {
        this.clearState();
      }
    }
  }
  checkStateValidation(): boolean {
    let valid = false;
    if (this.temp_state) {
      valid = this.generalInfoForm.get('state').value === this.temp_state.state;
    } else {
      if (!this.generalInfoForm.get('state').value) {
        valid = true;
      } else {
        valid = this.generalInfoForm.get('state').value === this.generalInfo.state;
      }
    }
    return valid;
  }
  clearState() {
    this.generalInfoData.state_id = null;
    this.updatedGeneralInfoData.emit(this.generalInfoData);
  }

}
