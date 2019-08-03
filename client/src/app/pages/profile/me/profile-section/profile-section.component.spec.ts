import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialModule, TestingModule } from 'src/app/modules';

import { ProfileSectionComponent } from './profile-section.component';
import { SimpleTagComponent } from 'src/app/components/simple-tag/simple-tag.component';
import { ActionButtonComponent } from 'src/app/components/action-button/action-button.component';

describe('ProfileSectionComponent', () => {
  let component: ProfileSectionComponent;
  let fixture: ComponentFixture<ProfileSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports : [ MaterialModule, TestingModule ],
      declarations: [ ProfileSectionComponent, SimpleTagComponent, ActionButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
