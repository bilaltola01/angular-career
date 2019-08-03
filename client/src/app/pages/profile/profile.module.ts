import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../modules/material.module';
import { profileRoutes } from './profile.routing';
import { profileComponents } from './index';
import { SharedModule } from '../../components/shared.module';
import { ProfileDialogContentComponent } from './me/profile-section/profile-section.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(profileRoutes),
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule
  ],
  declarations: [
    ...profileComponents
  ],
  entryComponents: [
    ProfileDialogContentComponent
  ]
})

export class ProfileModule {
}
