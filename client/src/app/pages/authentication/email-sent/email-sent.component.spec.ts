import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailSentComponent } from './email-sent.component';
import { TestingModule } from 'src/app/modules/testing.module';
import { MaterialModule } from 'src/app/modules/material.module';
import { ActionButtonComponent } from '../../../components/action-button/action-button.component';

describe('EmailSentComponent', () => {
  let component: EmailSentComponent;
  let fixture: ComponentFixture<EmailSentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports : [ MaterialModule, TestingModule ],
      declarations: [ EmailSentComponent, ActionButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailSentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
