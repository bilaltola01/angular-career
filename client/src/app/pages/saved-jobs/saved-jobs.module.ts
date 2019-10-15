import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../modules/material.module';
import { savedJobsRouting } from './saved-jobs.routing';
import { savedJobsComponent } from './index';
import { SharedModule } from '../../components/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddSkillPopupComponent } from 'src/app/components/add-skill-popup/add-skill-popup.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(savedJobsRouting),
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule
  ],
  declarations: [
    ...savedJobsComponent
  ],
  entryComponents: [
    AddSkillPopupComponent
  ]
})

export class SavedJobsModule {
}
