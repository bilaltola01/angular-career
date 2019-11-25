import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../modules/material.module';
import { positionRoutes } from './positions.routing';
import { positionComponents } from './index';
import { SharedModule } from '../../components/shared.module';
import { AddSkillPopupComponent } from 'src/app/components/add-skill-popup/add-skill-popup.component';
import { CreatePositionDialogComponent } from './create-position/create-position.component';
import { SkillDescriptionPopupComponent } from 'src/app/components/skill-description-popup/skill-description-popup.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(positionRoutes),
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule,

  ],
  declarations: [
    ...positionComponents
  ],
  entryComponents: [
    AddSkillPopupComponent,
    CreatePositionDialogComponent,
    SkillDescriptionPopupComponent
  ]
})

export class PositionModule {
}
