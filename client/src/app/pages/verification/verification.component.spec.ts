import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationComponent } from './verification.component';
import { TestingModule } from 'src/app/modules/testing.module';
import { MaterialModule } from 'src/app/modules/material.module';

describe('VerificationComponent', () => {
  let component: VerificationComponent;
  let fixture: ComponentFixture<VerificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports : [ MaterialModule, TestingModule ],
      declarations: [ VerificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
