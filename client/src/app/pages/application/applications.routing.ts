import { ApplicationsComponent } from './applications.component';
import { AuthGuard } from '../../guard/auth.guard';
import { Routes } from '@angular/router';


export const applicationsRoutes: Routes = [
  {
    path: '',
    component: ApplicationsComponent,
    // canActivate: [AuthGuard]
  }
];
