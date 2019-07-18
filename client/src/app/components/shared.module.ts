import { NgModule } from '@angular/core';
import { sharedComponents } from './index';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../modules/material.module';
import { AlertBarComponent } from './alert-bar/alert-bar.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
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
    AlertBarComponent
  ]
})

export class SharedModule {
}