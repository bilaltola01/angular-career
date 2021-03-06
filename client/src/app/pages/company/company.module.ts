import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../modules/material.module';
import { companyRoutes } from './company.routing';
import { companyComponents } from './index';
import { SharedModule } from '../../components/shared.module';
import { AddSkillPopupComponent } from 'src/app/components/add-skill-popup/add-skill-popup.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(companyRoutes),
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule
  ],
  declarations: [
    ...companyComponents
  ],
  entryComponents: [
    AddSkillPopupComponent
  ]
})

export class CompanyModule {
}
