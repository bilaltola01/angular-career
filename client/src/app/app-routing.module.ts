import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
