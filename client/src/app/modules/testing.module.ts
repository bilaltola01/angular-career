import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

@NgModule({
  imports: [
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientTestingModule,
    RouterTestingModule,
  ],
  exports: [
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientTestingModule,
    RouterTestingModule
  ],
  providers: [
  ]
})
export class TestingModule {}
