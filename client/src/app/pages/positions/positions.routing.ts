import { PositionSearchComponent } from './position-search/position-search.component';
import { AuthGuard } from '../../guard/auth.guard';
import { Routes } from '@angular/router';
import { PositionsDetailsComponent } from './positions-details/positions-details.component';

export const positionRoutes: Routes = [
  {
    path: '',
    component: PositionSearchComponent
    // canActivate: [AuthGuard]
  },
      {
        path: 'position-info/:position_id',
        component: PositionsDetailsComponent
        // canActivate: [AuthGuard]
      },
      {
        path: '',
        component: PositionSearchComponent,
        pathMatch: 'full'
      },
];
