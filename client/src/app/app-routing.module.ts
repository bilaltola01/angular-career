import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';
import { StyleGuideComponent } from './pages/style-guide/style-guide.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { VerificationComponent } from './pages/verification/verification.component';
import { EmailSentComponent } from './pages/email-sent/email-sent.component';

const routes: Routes = [
  {
    path: 'style-guide',
    component: StyleGuideComponent,
    canActivate: [AuthGuard]
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

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
