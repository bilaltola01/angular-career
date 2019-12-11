import { PositionSearchComponent } from './position-search/position-search.component';
import { CreatePositionComponent } from './create-position/create-position.component';
import { AuthGuard } from '../../guard/auth.guard';
import { Routes } from '@angular/router';
import { PositionsDetailsComponent } from 'src/app/components/positions-details/positions-details.component';
import { PositionTemplatesComponent } from './position-templates/position-templates.component';

export const positionRoutes: Routes = [
  {
    path: '',
    redirectTo: 'positions',
    pathMatch: 'full'
  },
  {
    path: '',
    component: PositionSearchComponent
    // canActivate: [AuthGuard]
  },
  {
    path: 'positions',
    component: PositionSearchComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'create-position',
    component: CreatePositionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'positions/position-info',
    component: PositionsDetailsComponent
    // canActivate: [AuthGuard]
  },
  {
    path: 'position-templates',
    component: PositionTemplatesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '',
    component: PositionSearchComponent,
    pathMatch: 'full'
  },


];
