import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import {MatDatepicker} from '@angular/material/datepicker';
import {
  AutoCompleteService,
  UserService,
  CompanyService,
  AlertsService,
  AlertType,
  HelperService,
  PhotoStateService,
} from 'src/app/services';

import {
  City, School, Major, Skill, Interest, Level, Company,
  UserGeneralInfo, UserObject,
  UserEducationItem, UserEducationItemData,
  UserExperienceItem, UserExperienceItemData,
  UserSkillItem,
  UserInterestItem,
  UserProjectItem,
  UserProjectItemData,
  UserPublicationItem,
  UserPublicationItemData,
  EthnicityTypes,
  CompanySizeTypes,
  Genders,
  State,
  Countries,
  Levels,
  Industry,
  UserExternalResourcesItem,
  UserExternalResourcesItemData,
  ExternalResources,
  ProfileStatuses,
  UserRoles,
  ITEMS_LIMIT
} from 'src/app/models';
import moment from 'moment';

export interface EditSkillItem {
  index: number;
  skillItem: UserSkillItem;
}

@Component({
  selector: 'app-create-company',
  templateUrl: './create-company.component.html',
  styleUrls: ['./create-company.component.scss']
})
export class CreateCompanyComponent implements OnInit {
  @Output() updatedGeneralInfoData = new EventEmitter();

  page_titles = [
    'Name & Overview',
    'Company Information',
    'Industry',
    'External Links',
    'Terms & Conditions',
    ''
  ];

  profileCreationPages = [
    'profile-basic',
    'profile-basic',
    'profile-skills',
    'profile-education',
    'profile-work',
    'profile-skills',
    'profile-project',
    'profile-publication',
    'profile-links',
    'profile-status'
  ];

  isTabMenuOpen: boolean;

  progressWidth = [
    {
      label: 10,
      width: 100 / 9 - 100 / 18
    },
    {
      label: 20,
      width: 200 / 9 - 100 / 18
    },
    {
      label: 30,
      width: 300 / 9 - 100 / 18
    },
    {
      label: 40,
      width: 400 / 9 - 100 / 18
    },
    {
      label: 50,
      width: 500 / 9 - 100 / 18
    },
    {
      label: 60,
      width: 600 / 9 - 100 / 18
    },
    {
      label: 70,
      width: 700 / 9 - 100 / 18
    },
    {
      label: 90,
      width: 800 / 9 - 100 / 18
    },
    {
      label: 100,
      width: 100
    }
  ];

  maxDate = new Date();

  // contants
  genders: string[] = Genders;
  companySizeTypes: string[] = CompanySizeTypes;

  ethnicityTypes: string[] = EthnicityTypes; // TODO: omg ...
  countries: string[] = Countries.slice().sort();
  degrees: Level[] = Levels;

  skills_trained: Skill[][];
  additional_industries: Industry[][];

  // FormGroups
  nameOverviewForm: FormGroup;
  companyBasicInfoForm: FormGroup;
  companyIndustryForm: FormGroup;
  companyTermsForm: FormGroup;
  externalResourcesForm: FormGroup;


  basicInfoForm: FormGroup; // TODO: Omg ...
  educationFormArray: FormArray;
  aboutMeForm: FormGroup;
  workExperienceFormArray: FormArray;
  skillsAndInterestsForm: FormGroup;
  projectsFormArray: FormArray;
  publicationsFormArray: FormArray;

  // autocomplete lists
  autocomplete_cities: City[] = [];
  temp_city: City;
  autocomplete_states: State[] = [];
  temp_state: State;
  autocomplete_universities: School[][] = [];
  autocomplete_majors: Major[][] = [];
  autocomplete_focus_majors: Major[][] = [];
  temp_university: School[] = [];
  temp_major: Major[] = [];
  temp_focus_major: Major[] = [];
  autocomplete_companies: Company[][] = [];
  temp_company: Company[] = [];
  autocomplete_skills_trained: Skill[][] = [];
  autocomplete_additional_industries: Industry[][] = [];
  autocomplete_skills: Skill[] = [];
  autocomplete_interests: Interest[] = [];
  prevent_skills_autocomplete: boolean;
  prevent_interets_autocomplete: boolean;

  temp_skill: EditSkillItem;

  statuses: string[] = ProfileStatuses;

  externalResources = ExternalResources;

  profile_status: number;
  selectedPageIndex: number;

  generalInfoResponse: UserGeneralInfo;
  generalInfoRequest: UserObject;
  educationList: UserEducationItem[];
  educationDataList: UserEducationItemData[];
  experienceList: UserExperienceItem[];
  experienceDataList: UserExperienceItemData[];
  userSkillsList: UserSkillItem[];
  userInterestsList: UserInterestItem[];
  userProjectsList: UserProjectItem[];
  userProjectsDataList: UserProjectItemData[];
  userPublicationsList: UserPublicationItem[];
  userPublicationsDataList: UserPublicationItemData[];
  externalResourcesList: UserExternalResourcesItem[];
  externalResourcesDataList: UserExternalResourcesItemData[];

  userRole: string;
  is_skip: boolean;

  company_logo: string;
  company_name: string;
  company_desc: string;
  company_size:	string;
  hq_city: City;
  hq_state:	State;
  hq_country:	number;
  founding_year: any;
  website: string;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private autoCompleteService: AutoCompleteService,
    private userService: UserService,
    private companyService: CompanyService,
    private alertsService: AlertsService,
    public helperService: HelperService,
    private photoStateService: PhotoStateService) { }

  ngOnInit() {
    if (this.route.snapshot.queryParams.role) {
      // this.userRole = this.route.snapshot.queryParams.role;
      this.userRole = UserRoles[0];
    }
    this.isTabMenuOpen = false;

    this.company_size = CompanySizeTypes[0];
    this.selectedPageIndex = 0;
    this.initializeFormsByPageIndex();

    // this.initNameOverviewForm();
    // this.initCompanyBasicInfoForm();
    // this.initCompanyIndustryForm();
    // this.initCompanyTermsForm();


    // this.initBasicInfoForm();
    // // this.initAboutMeForm();
    // this.initExternalResourcesForm();
    // this.initProfileStatus();

    // this.getGeneralInfo();
  }

  toggleTabMenuOpen() {
    this.isTabMenuOpen = !this.isTabMenuOpen;
  }

  goToCreatProfilePage() {
    this.selectedPageIndex = 1;
  }

  goToNextPage() {
    ++this.selectedPageIndex;
    switch (this.selectedPageIndex) {
      case 1:
        this.initCompanyBasicInfoForm();
        break;
      case 2:
        this.initCompanyIndustryForm();
        break;
      // case 3:
      //   this.updateEducationData();
      //   break;
      // case 4:
      //   this.updateExperienceData();
      //   break;
      // case 5:
      //   this.selectedPageIndex++;
      //   this.initializeFormsByPageIndex();
      //   break;
      // case 6:
      //   this.updateUserProjectsData();
      //   break;
      // case 7:
      //   this.updateUserPublicationsData();
      //   break;
      // case 8:
      //   this.updateExternalResourceData();
      //   break;
      // case 9:
      //   this.updateGeneralInfo();
      //   break;
      default:
        break;
    }
  }

  goToPage(index: number) {
    this.selectedPageIndex = index;
    this.initializeFormsByPageIndex();
  }

  goToMyProfilePage() {
    this.router.navigate(['/my-profile']);
  }

  initializeFormsByPageIndex() {
    switch (this.selectedPageIndex) {
      case 0:
        this.initNameOverviewForm();
        break;
      case 1:
        this.initCompanyBasicInfoForm();
        break;
      case 2:
        this.initCompanyIndustryForm();
        break;
      // case 3:
      //   this.initEducationFormArray();
      //   this.getEducationList();
      //   break;
      // case 4:
      //   this.initExperienceFormArray();
      //   this.getExperienceList();
      //   break;
      // case 5:
      //   this.initSkillsAndInterestsForm();
      //   this.getUserSkillsList();
      //   this.getUserInterestsList();
      //   break;
      // case 6:
      //   this.initProjectsFormArray();
      //   this.getUserProjectsList();
      //   break;
      // case 7:
      //   this.initPublicationsFormArray();
      //   this.getUserPublicationsList();
      //   break;
      // case 8:
      //   this.initExternalResourcesForm();
      //   this.getExternalResourceList();
      //   break;
      // case 9:
      //   this.getGeneralInfo();
      //   break;
      default:
        break;
    }
  }

  checkBasicInfoFormSkip(): boolean {
    // if (
    //   !this.basicInfoForm.get('photo').value
    //   && this.basicInfoForm.get('basicInfoEthnicity').value === 'Undisclosed'
    //   && !this.helperService.checkSpacesString(this.basicInfoForm.get('basicInfoCity').value)
    //   && !this.helperService.checkSpacesString(this.basicInfoForm.get('basicInfoState').value)
    //   && !this.helperService.checkSpacesString(this.basicInfoForm.get('basicInfoCountry').value)
    //   && !this.helperService.checkSpacesString(this.basicInfoForm.get('basicInfoGender').value)
    //   && !this.helperService.checkSpacesString(this.basicInfoForm.get('basicInfoBirth').value)
    //   && !this.helperService.checkSpacesString(this.basicInfoForm.get('basicInfoTitle').value)
    //   && this.generalInfoResponse.photo === null
    //   && this.generalInfoResponse.city_id === null
    //   && this.generalInfoResponse.state_id === null
    //   && this.generalInfoResponse.country_id === null
    //   && this.generalInfoResponse.gender === null
    //   && this.generalInfoResponse.birthdate === null
    //   && this.generalInfoResponse.title === null
    //   && this.generalInfoResponse.ethnicity === 'Undisclosed'
    // ) {
    //   this.is_skip = true;
    // } else {
    //   this.is_skip = false;
    // }
    // return this.is_skip;

    this.is_skip = true;
    return this.is_skip;
  }

  /**
   * Company Name and Overview Form
   */
  initNameOverviewForm() {
    this.nameOverviewForm = new FormGroup({
      company_logo: new FormControl(this.company_logo ? this.company_logo : null),
      company_name: new FormControl(this.company_name ? this.company_name : null, [Validators.required]),
      company_desc: new FormControl(this.company_desc ? this.company_desc : null, [Validators.required]),
    });

    this.nameOverviewForm.get('company_logo').valueChanges.subscribe((company_logo) => {
      this.company_logo = company_logo ? company_logo : null;
    });

    this.nameOverviewForm.get('company_name').valueChanges.subscribe((company_name) => {
      this.company_name = company_name && this.helperService.checkSpacesString(company_name) ? company_name : null;
    });

    this.nameOverviewForm.get('company_desc').valueChanges.subscribe((company_desc) => {
      this.company_desc = company_desc && this.helperService.checkSpacesString(company_desc) ? company_desc : null;
    });
  }

  /**
   * Company Basic Info
   */
  initCompanyBasicInfoForm() {
    this.autocomplete_cities = [];
    this.autocomplete_states = [];

    this.companyBasicInfoForm = new FormGroup({
      company_size: new FormControl(this.company_size ? this.company_size : null, [Validators.required]),
      founding_year: new FormControl(this.founding_year ? this.helperService.convertStringToFormattedDateString(this.founding_year, 'L', 'YYYY') : null),
      hq_city: new FormControl(this.hq_city ? this.helperService.cityNameFromAutoComplete(this.hq_city.city) : null),
      hq_state: new FormControl(this.hq_state ? this.hq_state.state : null),
      hq_country: new FormControl(this.hq_country ? Countries[this.hq_country - 1] : null),
      website: new FormControl(this.website ? this.website : null)
    });

    this.companyBasicInfoForm.get('hq_city').valueChanges.subscribe((hq_city) => {
      if (hq_city && this.helperService.checkSpacesString(hq_city)) {
        this.autoCompleteService.autoComplete(hq_city, 'cities').subscribe(
          dataJson => {
            if (dataJson['success']) {
              this.autocomplete_cities = dataJson['data'];
              if (this.autocomplete_cities.length === 0) {
                this.hq_city = null;
              }
            }
          },
          error => {
            this.alertsService.show(error.message, AlertType.error);
            this.autocomplete_cities = [];
            this.hq_city = null;
          }
        );
      } else {
        this.autocomplete_cities = [];
        this.hq_city = null;
      }
    });

    this.companyBasicInfoForm.get('hq_state').valueChanges.subscribe((hq_state) => {
      if (hq_state && this.helperService.checkSpacesString(hq_state)) {
        this.autoCompleteService.autoComplete(hq_state, 'states').subscribe(
          dataJson => {
            if (dataJson['success']) {
              this.autocomplete_states = dataJson['data'];
              if (this.autocomplete_states.length === 0) {
                this.hq_state = null;
              }
            }
          },
          error => {
            this.alertsService.show(error.message, AlertType.error);
            this.autocomplete_states = [];
            this.hq_state = null;
          }
        );
      } else {
        this.autocomplete_states = [];
        this.hq_state = null;
      }
    });

    this.companyBasicInfoForm.get('hq_country').valueChanges.subscribe(
      (hq_country) => {
        if (hq_country) {
          this.hq_country = Countries.indexOf(hq_country) + 1;
        } else {
          this.hq_country = null;
        }
      }
    );

    this.companyBasicInfoForm.get('founding_year').valueChanges.subscribe(
      (founding_year) => {
        this.founding_year = founding_year ? this.helperService.convertStringToFormattedDateString(founding_year, 'YYYY', 'L') : null;
      }
    );

    this.companyBasicInfoForm.get('website').valueChanges.subscribe(
      (website) => {
        this.website = website ? this.helperService.checkSpacesString(website) : null;
      }
    );


  }

  /**
   * Company Industry
   */

  primary_industries: Industry[] = []; // TODO: rename to primary_industry_list
  autocomplete_primary_industries: Industry[] = [];

  secondary_industries: Industry[] = []; // TODO: rename to primary_industry_list
  autocomplete_secondary_industries: Industry[] = [];

  initCompanyIndustryForm() {
    this.autocomplete_skills = [];
    this.autocomplete_interests = [];
    this.prevent_skills_autocomplete = false;
    this.prevent_interets_autocomplete = false;
    this.userSkillsList = [];
    this.userInterestsList = [];
    this.temp_skill = null;

    this.additional_industries = [];
    this.autocomplete_additional_industries = [];

    this.primary_industries = []; 
    this.autocomplete_primary_industries = [];
    this.secondary_industries = []; // TODO: rename to primary_industry_list
    this.autocomplete_secondary_industries = [];

    this.companyIndustryForm = new FormGroup({
      primary_industries_form: new FormControl(''),
      secondary_industries_form: new FormControl(''),

    });

    this.companyIndustryForm.get('primary_industries_form').valueChanges.subscribe(
      (industry) => {
        if (industry && this.helperService.checkSpacesString(industry)) {
          this.autoCompleteService.autoComplete(industry, 'industries').subscribe(
            dataJson => {
              if (dataJson['success']) {
                this.autocomplete_primary_industries = dataJson['data'];
              }
            },
            error => {
              this.autocomplete_primary_industries = [];
              this.alertsService.show(error.message, AlertType.error);
            }
          );
        } else {
          this.autocomplete_primary_industries = [];
        }
      }
    );

    this.companyIndustryForm.get('secondary_industries_form').valueChanges.subscribe(
      (industry) => {
        if (industry && this.helperService.checkSpacesString(industry)) {
          this.autoCompleteService.autoComplete(industry, 'industries').subscribe(
            dataJson => {
              if (dataJson['success']) {
                this.autocomplete_secondary_industries = dataJson['data'];
              }
            },
            error => {
              this.autocomplete_secondary_industries = [];
              this.alertsService.show(error.message, AlertType.error);
            }
          );
        } else {
          this.autocomplete_secondary_industries = [];
        }
      }
    );

  }

  /**
   * Company Name and Overview Form
   */
  initCompanyTermsForm() {
    this.companyTermsForm = new FormGroup({
      companyWebsiteLink: new FormControl('', [Validators.required]),
      companyTerms: new FormControl('', [Validators.required]),
    });
  }

  /** 
    * External Resource Information Form
   */

  initExternalResourcesForm() {
    this.externalResourcesForm = new FormGroup({});
    this.externalResourcesList = [];
    this.externalResourcesDataList = [];

    this.externalResources.forEach((resource, index) => {
      this.externalResourcesForm.addControl(resource, new FormControl(''));
      this.externalResourcesForm.get(resource).valueChanges.subscribe(
        (link) => {
          this.onExternalResourceValueChange(resource, index, link);
        }
      );
      this.externalResourcesDataList.push({
        link: null,
        description: resource
      });
    });
  }

  onExternalResourceValueChange(resource: string, arrIndex: number, link: string) {
    if (this.externalResourcesDataList[arrIndex].description === resource) {
      this.externalResourcesDataList[arrIndex] .link = link ? this.helperService.checkSpacesString(link) : null;
    }
  }



  public onPhotoFileSelected(event): void {
    if (event.target.files && event.target.files[0]) {
      if (event.target.files[0].size > 1830020) {
        this.alertsService.show('Image size too big.', AlertType.error);
        return null;
      }

      const file = event.target.files[0];

      this.userService.getSignedPhotoUrl(file)
        .subscribe((signedPhoto) => {
            this.userService.uploadPhotoToS3(file, signedPhoto.data.signedUrl, signedPhoto.data.url)
              .subscribe((response) => {
                this.basicInfoForm.patchValue({
                  photo: response.data
                });
                this.photoStateService.setPhoto(response.data);
              }, err => {
                this.alertsService.show(err.message, AlertType.error);
              });
          }, err => {
            this.alertsService.show(err.message, AlertType.error);
          }
        );
    }
  }

  onSelectCity(city: City) {
    this.hq_city = city;
  }

  onBlurCity() {
    if (this.hq_city && this.companyBasicInfoForm.value.hq_city !== this.helperService.cityNameFromAutoComplete(this.hq_city.city)) {
      this.hq_city = null;
    }
  }

  onCheckCityValidation(): boolean {
    const value = this.companyBasicInfoForm.get('hq_city').value;
    if (value && this.helperService.checkSpacesString(value)) {
      if (this.hq_city) {
        return value === this.helperService.cityNameFromAutoComplete(this.hq_city.city) ? true : false;
      } else {
        return false;
      }
    } else {
      return this.hq_city ? false : true;
    }
  }

  clearCity() {
    this.hq_city = null;
  }

  onSelectState(state: State) {
    this.hq_state = state;
  }

  onBlurState() {
    if (this.hq_state && this.companyBasicInfoForm.value.hq_state !== this.hq_state.state) {
      this.hq_state = null;
    }
  }

  onCheckStateValidation(): boolean {
    const value = this.companyBasicInfoForm.value.hq_state;
    if (value && this.helperService.checkSpacesString(value)) {
      if (this.hq_state) {
        return value === this.hq_state.state ? true : false;
      } else {
        return false;
      }
    } else {
      return this.hq_state ? true : false;
    }
  }

  onFoundedYearSelect(date: any, datePicker: MatDatepicker<any>) {
    datePicker.close();
    this.companyBasicInfoForm.get('founding_year').setValue(this.helperService.convertToFormattedString(date, 'YYYY'));
  }


  addPrimaryIndustry(industry: Industry) {
    if (industry) {
      if (this.primary_industries.filter(additional_industry => additional_industry.industry_id === industry.industry_id).length === 0) {
        this.primary_industries.push(industry);
        // if (this.experienceDataList[index].add_industry_ids) {
        //   this.experienceDataList[index].add_industry_ids.push(industry.industry_id);
        // } else {
        //   this.experienceDataList[index].add_industry_ids = [industry.industry_id];
        // }
      }
      this.companyIndustryForm.get('primary_industries_form').setValue('');
    }

  }

  onRemovePrimaryIndustry(industry: Industry) {
    this.primary_industries = this.primary_industries.filter(primary_industry => primary_industry !== industry);
  }

  addSecondaryIndustry(industry: Industry) {
    if (industry) {
      if (this.secondary_industries.filter(additional_industry => additional_industry.industry_id === industry.industry_id).length === 0) {
        this.secondary_industries.push(industry);
        // if (this.experienceDataList[index].add_industry_ids) {
        //   this.experienceDataList[index].add_industry_ids.push(industry.industry_id);
        // } else {
        //   this.experienceDataList[index].add_industry_ids = [industry.industry_id];
        // }
      }
      this.companyIndustryForm.get('secondary_industries_form').setValue('');
    }

  }

  onRemoveSecondaryIndustry(industry: Industry) {
    this.secondary_industries = this.secondary_industries.filter(primary_industry => primary_industry !== industry);
  }

  finish() {
    console.log("TCL: CreateCompanyComponent -> finish -> nameOverviewForm", this.nameOverviewForm.value)
    const companyPayload = {
      company_name: this.nameOverviewForm.get('nameCompany').value,
      company_desc: this.nameOverviewForm.get('aboutCompany').value,
      company_logo: this.nameOverviewForm.get('photo').value || '',
      company_size: 'small',
      hq_city: 10,
      // hq_state: this.companyBasicInfoForm.get('companyState').value,
      // hq_country: this.companyBasicInfoForm.get('companyCountry').value,
      // founding_year: this.companyBasicInfoForm.get('companyFounded_date').value,
      // website: this.companyBasicInfoForm.get('companyWebsite').value,
      hq_state: 100,
      hq_country: 100,
      // founding_year: this.companyBasicInfoForm.get('companyFounded_date').value,
      website: this.companyBasicInfoForm.get('companyWebsite').value,
      // main_industry: 100,
      // active: 1,
      // company_industry_ids: [101, 102 , 103],
    };
    console.log("TCL: CreateCompanyComponent -> finish -> companyPayload", companyPayload);



    this.companyService.createCompany(companyPayload).subscribe(dataJson => {
      console.log("TCL: CreateCompanyComponent -> finish -> dataJson", dataJson);
    },
    error => {
      console.log("TCL: CreateCompanyComponent -> finish -> error", error);
    });


    
  }
}

