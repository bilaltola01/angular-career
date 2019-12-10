import { PositionSearchComponent } from './position-search/position-search.component';
import { CreatePositionComponent } from './create-position/create-position.component';
import { AuthGuard } from 'src/app/guard/auth.guard';
import { RecruiterGuard } from 'src/app/guard/role.guard';
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
    path: 'positions',
    component: PositionSearchComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'create-position',
    component: CreatePositionComponent,
    canActivate: [AuthGuard, RecruiterGuard]
  },
  {
    path: 'positions/position-info/:position_id',
    component: PositionsDetailsComponent
    // canActivate: [AuthGuard]
  },
  {
    path: 'position-templates',
    component: PositionTemplatesComponent,
    canActivate: [AuthGuard, RecruiterGuard]
  }
];
