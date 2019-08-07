import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestingModule } from 'src/app/modules/testing.module';
import { MaterialModule } from 'src/app/modules/material.module';

import { MyProfileComponent } from './my-profile.component';

import { SimpleTagComponent } from 'src/app/components/simple-tag/simple-tag.component';
import { ActionButtonComponent } from 'src/app/components/action-button/action-button.component';

import { HeaderSectionComponent } from 'src/app/pages/profile/user-profile/header-section/header-section.component';
import { NavSectionComponent } from 'src/app/pages/profile/user-profile/nav-section/nav-section.component';
import { ProfileSectionComponent } from 'src/app/pages/profile/user-profile/profile-section/profile-section.component';

describe('MyProfileComponent', () => {
  let component: MyProfileComponent;
  let fixture: ComponentFixture<MyProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports : [ MaterialModule, TestingModule ],
      declarations: [ MyProfileComponent, HeaderSectionComponent, NavSectionComponent, ProfileSectionComponent, SimpleTagComponent, ActionButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
