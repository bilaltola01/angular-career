import { PositionSearchComponent } from './position-search/position-search.component';
import { CreatePositionComponent } from './create-position/create-position.component';
import { AuthGuard } from '../../guard/auth.guard';
import { Routes } from '@angular/router';
import { PositionsDetailsComponent } from 'src/app/components/positions-details/positions-details.component';

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
    canActivate: [AuthGuard]
  },
  {
    path: 'position-info/:position_id',
    component: PositionsDetailsComponent
    // canActivate: [AuthGuard]
  }
];
