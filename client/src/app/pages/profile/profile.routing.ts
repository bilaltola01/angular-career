import { CreateProfileComponent } from './create-profile/create-profile.component';
import { AuthGuard } from '../../guard/auth.guard';
import { MyProfileComponent } from './user-profile/my-profile/my-profile.component';
import { Routes } from '@angular/router';
import { ProfileSectionComponent } from './user-profile/profile-section/profile-section.component';
import { ContactsSectionComponent } from './user-profile/contacts-section/contacts-section.component';
import { TemplateSectionComponent } from './user-profile/template-section/template-section.component';
import { UserProfileComponent } from './user-profile/user-profile/user-profile.component';
import { ReferencesSectionComponent } from './user-profile/references-section/references-section.component';

export const profileRoutes: Routes = [
  {
    path: 'create-profile',
    component: CreateProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '',
    component: MyProfileComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'my-profile',
        pathMatch: 'full'
      },
      {
        path: 'my-profile',
        component: ProfileSectionComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'my-profile/edit',
        component: ProfileSectionComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'my-contacts',
        component: ContactsSectionComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'my-contacts/incoming-requests',
        component: ContactsSectionComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'my-template',
        component: TemplateSectionComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'my-template/edit',
        component: TemplateSectionComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'my-references',
        component: ReferencesSectionComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'my-references/incoming-requests',
        component: ReferencesSectionComponent,
        canActivate: [AuthGuard]
      },
    ]
  },
  {
    path: 'user/:userId',
    component: UserProfileComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'profile',
        pathMatch: 'full'
      },
      {
        path: 'profile',
        component: ProfileSectionComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'contacts',
        component: ContactsSectionComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'template',
        component: TemplateSectionComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'references',
        component: ReferencesSectionComponent,
        canActivate: [AuthGuard]
      }
    ]
  }
];
