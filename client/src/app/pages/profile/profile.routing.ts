import { CreateProfileComponent } from './create-profile/create-profile.component';
import { AuthGuard } from '../../guard/auth.guard';
import { MyProfileComponent } from './user-profile/my-profile/my-profile.component';
import { Routes } from '@angular/router';
import { ProfileSectionComponent } from './user-profile/profile-section/profile-section.component';
import { ContactsSectionComponent } from './user-profile/contacts-section/contacts-section.component';
import { TemplateSectionComponent } from './user-profile/template-section/template-section.component';

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
        path: 'my-profile/:name',
        component: ProfileSectionComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'my-contacts',
        component: ContactsSectionComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'my-template',
        component: TemplateSectionComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'my-template/:name',
        component: TemplateSectionComponent,
        canActivate: [AuthGuard]
      }
    ]
  }
];
