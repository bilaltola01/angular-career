import { NgModule } from '@angular/core';
import { sharedComponents } from './index';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../modules/material.module';
import { AlertBarComponent } from './alert-bar/alert-bar.component';
import { ProfileDialogContentComponent } from './main-section/main-section.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MaterialModule
  ],
  declarations: [
    ...sharedComponents
  ],
  exports: [
    ...sharedComponents
  ],
  entryComponents: [
    AlertBarComponent,
    ProfileDialogContentComponent
  ]
})

export class SharedModule {
}
