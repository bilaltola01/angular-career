import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationComponent } from './registration.component';
import { TestingModule } from 'src/app/modules/testing.module';
import { MaterialModule } from 'src/app/modules/material.module';
import { ActionButtonComponent } from './../../components/action-button/action-button.component';
import { RoundCheckboxComponent } from './../../components/round-checkbox/round-checkbox.component';

describe('RegistrationComponent', () => {
  let component: RegistrationComponent;
  let fixture: ComponentFixture<RegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports : [ MaterialModule, TestingModule ],
      declarations: [ RegistrationComponent, ActionButtonComponent, RoundCheckboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationComponent);
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

  it('should show weak password', () => {
    component.checkPasswordStrength('weakweak');
    expect(component.passwordStrength).toEqual('weak');
  });

  it('should show medium password', () => {
    component.checkPasswordStrength('medium12345');
    expect(component.passwordStrength).toEqual('medium');
  });

  it('should show strong password', () => {
    component.checkPasswordStrength('Strong12345!');
    expect(component.passwordStrength).toEqual('strong');
  });

  it('should toggle toggleAgreeTerm to true', () => {
    component.toggleAgreeTerm(true);
    expect(component.isAgreeTerm).toBeTruthy();
  });
});
