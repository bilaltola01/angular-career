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
import { ApplicationCoverLettrComponent } from './application-detail/application-cover-lettr/application-cover-lettr.component';


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
    ApplicationCoverLettrComponent
  ],
  entryComponents: [
    AddSkillPopupComponent,
    InterestLevelPopupComponent
  ]
})
export class ApplicationsModule { }
