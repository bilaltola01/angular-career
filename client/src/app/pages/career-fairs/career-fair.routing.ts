import { Routes } from '@angular/router';
import { AuthGuard } from '../../guard/auth.guard';
import { CareerFairSearchComponent } from './career-fair-search/career-fair-search.component';

export const careerFairSearchRouting: Routes = [
  {
    path: '',
    component: CareerFairSearchComponent
  }
];
