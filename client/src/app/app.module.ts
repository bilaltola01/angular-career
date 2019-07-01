import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './modules/material.module';

import { StyleGuideComponent } from './pages/style-guide/style-guide.component';
import { SimpleTagComponent } from './components/simple-tag/simple-tag.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { ActionButtonComponent } from './components/action-button/action-button.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { VerificationComponent } from './pages/verification/verification.component';
import { RoundCheckboxComponent } from './components/round-checkbox/round-checkbox.component';
import { AlertBarComponent } from './components/alert-bar/alert-bar.component';
import { EmailSentComponent } from './pages/email-sent/email-sent.component';
import { CreateProfileComponent } from './pages/create-profile/create-profile.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';

@NgModule({
  declarations: [
    AppComponent,
    StyleGuideComponent,
    SimpleTagComponent,
    ToolbarComponent,
    ActionButtonComponent,
    LoginComponent,
    RegistrationComponent,
    VerificationComponent,
    RoundCheckboxComponent,
    AlertBarComponent,
    EmailSentComponent,
    CreateProfileComponent,
    UserProfileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [AlertBarComponent]
})
export class AppModule { }
