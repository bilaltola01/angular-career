import { Routes } from '@angular/router';
import { AuthGuard } from '../../guard/auth.guard';
import { CareerFairSearchComponent } from './career-fair-search/career-fair-search.component';
import { CareerfairInfoComponent } from './careerfair-info/careerfair-info.component';

export const careerFairSearchRouting: Routes = [
  {
    path: '',
    component: CareerFairSearchComponent
  },
  {
    path: 'careerfair-info/:careerfair_id',
    component: CareerfairInfoComponent
  }
];
