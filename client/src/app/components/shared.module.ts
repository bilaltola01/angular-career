import { NgModule } from '@angular/core';
import { sharedComponents } from './index';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../modules/material.module';
import { AlertBarComponent } from './alert-bar/alert-bar.component';
import { AddSkillPopupComponent, SkillLevelPopupComponent } from './add-skill-popup/add-skill-popup.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MaterialModule
  ],
  declarations: [
    ...sharedComponents,
    AddSkillPopupComponent,
    SkillLevelPopupComponent
  ],
  exports: [
    ...sharedComponents
  ],
  entryComponents: [
    AlertBarComponent,
    SkillLevelPopupComponent
  ]
})

export class SharedModule {
}
