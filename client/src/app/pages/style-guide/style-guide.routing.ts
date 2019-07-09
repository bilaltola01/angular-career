import { Routes } from '@angular/router';
import { StyleGuideComponent } from './style-guide.component';
import { AuthGuard } from '../../guard/auth.guard';

export const styleGuideRouting: Routes = [
  {
    path: '',
    component: StyleGuideComponent,
    canActivate: [AuthGuard]
  }
];
