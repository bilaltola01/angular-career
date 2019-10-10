import { NgModule } from '@angular/core';
import { sharedComponents } from './index';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../modules/material.module';
import { AlertBarComponent } from './alert-bar/alert-bar.component';
import { AddSkillPopupComponent } from './add-skill-popup/add-skill-popup.component';
import { SkillDescriptionPopupComponent } from './skill-description-popup/skill-description-popup.component';
import { InterestLevelPopupComponent } from './interest-level-popup/interest-level-popup.component';

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
    SkillDescriptionPopupComponent,
    InterestLevelPopupComponent
  ],
  exports: [
    ...sharedComponents
  ],
  entryComponents: [
    AlertBarComponent,
    SkillDescriptionPopupComponent
  ]
})

export class SharedModule {
}
