import { Routes } from '@angular/router';
import { AuthGuard } from '../../guard/auth.guard';
import { CareerFairSearchComponent } from './career-fair-search/career-fair-search.component';
import { CareerfairInfoComponent } from './careerfair-info/careerfair-info.component';
import { PositionsDetailsComponent } from 'src/app/components/positions-details/positions-details.component';

export const careerFairSearchRouting: Routes = [
  {
    path: '',
    component: CareerFairSearchComponent
  },
  {
    path: 'careerfair-info',
    component: CareerfairInfoComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'position-info/:position_id',
    component: PositionsDetailsComponent,
    pathMatch: 'full'
    // canActivate: [AuthGuard]
  },
  {
    path: 'career-fairs/careerfair-info/position-info',
    component: PositionsDetailsComponent
    // canActivate: [AuthGuard]
  },
];
