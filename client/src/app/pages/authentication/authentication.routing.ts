import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { VerificationComponent } from './verification/verification.component';
import { EmailSentComponent } from './email-sent/email-sent.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { UnauthGuard } from '../../guard/unauth.guard';
import { AuthGuard } from '../../guard/auth.guard';

export const authenticationRoutes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [UnauthGuard]
  },
  {
    path: 'registration',
    component: RegistrationComponent,
    canActivate: [UnauthGuard]
  },
  {
    path: 'verification/:user_id/:verify_str/:verify_key',
    component: VerificationComponent,
    canActivate: [UnauthGuard]
  },
  {
    path: 'email-sent',
    component: EmailSentComponent,
    canActivate: [UnauthGuard]
  },
  {
    path: 'change-password',
    component: ResetPasswordComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    canActivate: [UnauthGuard]
  },
  {
    path: 'user/:user_id/token/:valid_token/password-reset',
    component: ResetPasswordComponent,
    canActivate: [UnauthGuard]
  },
];
