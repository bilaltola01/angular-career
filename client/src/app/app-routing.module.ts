import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ErrorPageComponent } from './components/error-page/error-page.component';

export const routes: Routes = [
  {
    path: '', loadChildren: () => import('./pages/authentication/authentication.module')
      .then(module => module.AuthenticationModule)
  },
  {
    path: '', loadChildren: () => import('./pages/profile/profile.module')
      .then(module => module.ProfileModule)
  },
  {
    path: '', loadChildren: () => import('./pages/company/company.module')
      .then(module => module.CompanyModule)
  },
  {
    path: 'style-guide', loadChildren: () => import('./pages/style-guide/style-guide.module')
      .then(module => module.StyleGuideModule)
  },
  {
    path: 'read-more', loadChildren: () => import('./pages/read-more/read-more.module')
      .then(module => module.ReadMoreModule)
  },
  {
    path: 'legal', loadChildren: () => import('./pages/legal-terms/legal-terms.module')
      .then(module => module.LegalTermsModule)
  },
  {
    path: '', loadChildren: () => import('./pages/positions/positions.module')
      .then(module => module.PositionModule)
  },
  {
    path: 'saved-jobs', loadChildren: () => import('./pages/saved-jobs/saved-jobs.module')
      .then(module => module.SavedJobsModule)
  },
  {
    path: 'people', loadChildren: () => import('./pages/people/people.module')
      .then(module => module.PeopleModule)
  },
  // Use this route to redirect to /404 if we want to pop error page to the user
  // We cannot redirect to '**' so we shall use 404 instead
  { path: 'error/:status-code', component: ErrorPageComponent },
  { path: '**', component: ErrorPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
