import { CreateProfileComponent } from './create-profile/create-profile.component';
import { AuthGuard } from '../../guard/auth.guard';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { MyProfileComponent } from './me/my-profile/my-profile.component';
import { Routes } from '@angular/router';

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
    canActivate: [AuthGuard]
  }
];
