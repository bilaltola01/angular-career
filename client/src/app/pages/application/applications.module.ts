import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../modules/material.module';
import { applicationsRoutes } from './applications.routing';
import { applicationComponents } from './index';
import { SharedModule } from '../../components/shared.module';
import { AddSkillPopupComponent } from 'src/app/components/add-skill-popup/add-skill-popup.component';
import { InterestLevelPopupComponent } from 'src/app/components/interest-level-popup/interest-level-popup.component';
import { ApplicationCoverLetterComponent } from './application-detail/application-cover-letter/application-cover-letter.component';
import { ApplicationNavSectionComponent } from './application-detail/application-nav-section/application-nav-section.component';
import { ApplicationHeaderSectionComponent } from './application-detail/application-header-section/application-header-section.component';
import { ApplicationTemplateInformationComponent } from './application-detail/application-template-information/application-template-information.component';
import { ApplicationReferencesComponent } from './application-detail/application-references/application-references.component';
import { ApplicationPositionInformationComponent } from './application-detail/application-position-information/application-position-information.component';
import { ProfileInformationComponent } from './application-detail/profile-information/profile-information.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(applicationsRoutes),
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule,
  ],
  declarations: [
    ...applicationComponents,
    ApplicationCoverLetterComponent,
    ApplicationNavSectionComponent,
    ApplicationHeaderSectionComponent,
    ApplicationTemplateInformationComponent,
    ApplicationReferencesComponent,
    ApplicationPositionInformationComponent,
    ProfileInformationComponent
  ],
  entryComponents: [
    AddSkillPopupComponent,
    InterestLevelPopupComponent
  ]
})
export class ApplicationsModule { }
