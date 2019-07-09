import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../modules/material.module';
import { styleGuideRouting } from './style-guide.routing';
import { styleGuideComponents } from './index';
import { SharedModule } from '../../components/shared.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(styleGuideRouting),
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule
  ],
  declarations: [
    ...styleGuideComponents
  ]
})

export class StyleGuideModule {
}
