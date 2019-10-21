import { ApplicationsComponent } from './application-search-page/applications.component';
import { AuthGuard } from '../../guard/auth.guard';
import { Routes } from '@angular/router';
import { ApplicationCoverLettrComponent } from './application-detail/application-cover-lettr/application-cover-lettr.component';


export const applicationsRoutes: Routes = [
  {
    path: '',
    component: ApplicationsComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: 'application-detail/:application_id',
    component: ApplicationCoverLettrComponent,
    // canActivate: [AuthGuard]
  }
];
