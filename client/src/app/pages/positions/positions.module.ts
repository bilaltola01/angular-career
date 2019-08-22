import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../modules/material.module';
import { positionRoutes } from './positions.routing';
import { positionComponents } from './index';
import { SharedModule } from '../../components/shared.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(positionRoutes),
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule
  ],
  declarations: [
    ...positionComponents
  ]
})

export class PositionModule {
}
