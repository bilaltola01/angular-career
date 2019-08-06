import { PositionSearchComponent } from './position-search/position-search.component';
import { AuthGuard } from '../../guard/auth.guard';
import { Routes } from '@angular/router';

export const positionRoutes: Routes = [
  {
    path: '',
    component: PositionSearchComponent,
    // canActivate: [AuthGuard]
  }
];
