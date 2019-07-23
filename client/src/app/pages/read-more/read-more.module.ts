import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../modules/material.module';
import { readMoreRouting } from './read-more.routing';
import { readMoreComponents } from './index';
import { SharedModule } from '../../components/shared.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(readMoreRouting),
    MaterialModule,
    SharedModule
  ],
  declarations: [
    ...readMoreComponents
  ]
})

export class ReadMoreModule {
}
