import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../modules/material.module';
import { companyRoutes } from './company.routing';
import { companyComponents, companiesComponents } from './index';
import { SharedModule } from '../../components/shared.module';


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
    ...companyComponents,
    ...companiesComponents
  ]
})

export class CompanyModule {
}
