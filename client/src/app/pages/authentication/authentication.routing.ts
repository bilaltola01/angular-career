import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { VerificationComponent } from './verification/verification.component';
import { EmailSentComponent } from './email-sent/email-sent.component';

export const authenticationRoutes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'registration',
    component: RegistrationComponent
  },
  {
    path: 'verification/:user_id/:verify_str/:verify_key',
    component: VerificationComponent
  },
  {
    path: 'email-sent',
    component: EmailSentComponent
  }
];
