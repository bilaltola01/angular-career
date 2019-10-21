import { Routes } from '@angular/router';
import { AuthGuard } from '../../guard/auth.guard';
import { SavedJobsComponent } from './saved-jobs.component';

export const savedJobsRouting: Routes = [
  {
    path: '',
    component: SavedJobsComponent
  }
];
