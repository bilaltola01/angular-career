import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../modules/material.module';
import { legalTermsRouting } from './legal-terms.routing';
import { legalTermsComponents } from './index';
import { SharedModule } from '../../components/shared.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(legalTermsRouting),
    MaterialModule,
    SharedModule
  ],
  declarations: [
    ...legalTermsComponents
  ]
})

export class LegalTermsModule {
}
