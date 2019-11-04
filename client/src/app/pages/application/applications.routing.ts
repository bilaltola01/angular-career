import { ApplicationsComponent } from './application-search-page/applications.component';
import { AuthGuard } from '../../guard/auth.guard';
import { Routes } from '@angular/router';
import { ApplicationCoverLetterComponent } from './application-detail/application-cover-letter/application-cover-letter.component';
import { ApplicationHeaderSectionComponent } from './application-detail/application-header-section/application-header-section.component';
import { ApplicationTemplateInformationComponent } from './application-detail/application-template-information/application-template-information.component';
import { ApplicationReferencesComponent } from './application-detail/application-references/application-references.component';
import { ApplicationPositionInformationComponent } from './application-detail/application-position-information/application-position-information.component';
import { ProfileInformationComponent } from './application-detail/profile-information/profile-information.component';


export const applicationsRoutes: Routes = [
  {
    path: '',
    component: ApplicationsComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: 'application-detail/:application_id/:position_id',
    component: ApplicationHeaderSectionComponent,
    // canActivate: [AuthGuard],
    children: [
      // {
      //   path: '',
      //   redirectTo: 'app-application-header-section',
      //   pathMatch: 'full'
      // },
      {
        path: 'application-cover-letter',
        component: ApplicationCoverLetterComponent,
        // canActivate: [AuthGuard]
      },
      {
        path: 'application-template-information',
        component: ApplicationTemplateInformationComponent,
        // canActivate: [AuthGuard]
      },
      {
        path: 'application-references',
        component: ApplicationReferencesComponent,
        // canActivate: [AuthGuard]
      },
      {
          path: 'position-information',
          component: ApplicationPositionInformationComponent,
          // canActivate: [AuthGuard]
        },
      {
        path: 'profile-information',
        component: ProfileInformationComponent,
        // canActivate: [AuthGuard]
      }
    ]
  },
];
