import { PeopleSearchComponent } from './people-search/people-search.component';
import { AuthGuard } from '../../guard/auth.guard';
import { Routes } from '@angular/router';

export const peopleRoutes: Routes = [
  {
    path: '',
    component: PeopleSearchComponent,
    canActivate: [AuthGuard]
  }
];
