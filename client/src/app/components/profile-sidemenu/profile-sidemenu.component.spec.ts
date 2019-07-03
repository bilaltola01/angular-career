import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileSidemenuComponent } from './profile-sidemenu.component';

describe('ProfileSidemenuComponent', () => {
  let component: ProfileSidemenuComponent;
  let fixture: ComponentFixture<ProfileSidemenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileSidemenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileSidemenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
