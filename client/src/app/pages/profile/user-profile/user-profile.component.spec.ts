import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestingModule } from 'src/app/modules/testing.module';
import { MaterialModule } from 'src/app/modules/material.module';

import { UserProfileComponent } from './user-profile.component';
import { HeaderSectionComponent } from 'src/app/components/header-section/header-section.component';
import { NavSectionComponent } from 'src/app/components/nav-section/nav-section.component';
import { MainSectionComponent } from 'src/app/components/main-section/main-section.component';
import { SimpleTagComponent } from 'src/app/components/simple-tag/simple-tag.component';

describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports : [ MaterialModule, TestingModule ],
      declarations: [ UserProfileComponent, HeaderSectionComponent, NavSectionComponent, MainSectionComponent, SimpleTagComponent ]
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
