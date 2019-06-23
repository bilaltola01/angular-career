import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { TestingModule } from 'src/app/modules/testing.module';
import { MaterialModule } from 'src/app/modules/material.module';
import { ActionButtonComponent } from './../../components/action-button/action-button.component';
import { RoundCheckboxComponent } from './../../components/round-checkbox/round-checkbox.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports : [ MaterialModule, TestingModule ],
      declarations: [ LoginComponent, ActionButtonComponent, RoundCheckboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should switchRole to applicant', () => {
    component.switchRole('applicant');
    expect(component.currentRole).toEqual(0);
    expect(component.checkUserRole('applicant')).toBeTruthy();
  });

  it('should switchRole to recruiter', () => {
    component.switchRole('recruiter');
    expect(component.checkUserRole('recruiter')).toBeTruthy();
    expect(component.currentRole).toEqual(1);
  });
});
