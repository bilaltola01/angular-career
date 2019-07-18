import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { authenticationRoutes } from './authentication.routing';
import { MaterialModule } from '../../modules/material.module';
import { authenticationComponents } from './index';
import { SharedModule } from '../../components/shared.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(authenticationRoutes),
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule
  ],
  declarations: [
    ...authenticationComponents
  ]
})

export class AuthenticationModule {
}
