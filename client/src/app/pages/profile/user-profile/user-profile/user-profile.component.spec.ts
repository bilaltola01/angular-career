import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestingModule } from 'src/app/modules/testing.module';
import { MaterialModule } from 'src/app/modules/material.module';

import { UserProfileComponent } from './user-profile.component';

import { SimpleTagComponent } from 'src/app/components/simple-tag/simple-tag.component';
import { ActionButtonComponent } from 'src/app/components/action-button/action-button.component';
import { HeaderSectionComponent } from 'src/app/pages/profile/user-profile/header-section/header-section.component';
import { NavSectionComponent } from 'src/app/pages/profile/user-profile/nav-section/nav-section.component';
import { ProfileSectionComponent } from 'src/app/pages/profile/user-profile/profile-section/profile-section.component';

describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ MaterialModule, TestingModule ],
      declarations: [ UserProfileComponent, HeaderSectionComponent, NavSectionComponent, ProfileSectionComponent, SimpleTagComponent, ActionButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
