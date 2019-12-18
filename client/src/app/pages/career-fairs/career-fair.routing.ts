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
    path: 'careerfair-info/:careerfair_id',
    component: CareerfairInfoComponent,
    children: [
      {
        path: 'position',
        component: CareerfairInfoComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'company',
        component: CareerfairInfoComponent,
        canActivate: [AuthGuard]
      },
    ]
  },
  {
    path: 'careerfair-info/:careerfair_id/position-info',
    component: PositionsDetailsComponent
    // canActivate: [AuthGuard]
  },
];
