import { Routes } from '@angular/router';
import { AuthGuard } from '../../guard/auth.guard';
import { SavedJobsComponent } from './saved-jobs.component';
import { PositionsDetailsComponent } from 'src/app/components/positions-details/positions-details.component';

export const savedJobsRouting: Routes = [
  {
    path: '',
    component: SavedJobsComponent
  },
    {
      path: 'saved-jobs',
      component: SavedJobsComponent,
      canActivate: [AuthGuard],
  },
  {
    path: 'position-info/:position_id',
    component: PositionsDetailsComponent
    // canActivate: [AuthGuard]
  },
];
