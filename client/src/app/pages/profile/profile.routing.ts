import { CreateProfileComponent } from './create-profile/create-profile.component';
import { AuthGuard } from '../../guard/auth.guard';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { MyProfileComponent } from './me/my-profile/my-profile.component';
import { Routes } from '@angular/router';
import { ProfileSectionComponent } from './me/profile-section/profile-section.component';
import { ContactsSectionComponent } from './me/contacts-section/contacts-section.component';

export const profileRoutes: Routes = [
  {
    path: 'create-profile',
    component: CreateProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'my-profile',
    component: UserProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'me',
    component: MyProfileComponent,
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
      }
    ]
  }
];
