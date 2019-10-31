import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from 'src/app/modules/testing.module';
import { MaterialModule } from 'src/app/modules/material.module';
import { SimpleTagComponent } from '../../../../components/simple-tag/simple-tag.component';
import { ActionButtonComponent } from '../../../../components/action-button/action-button.component';
import { RoundCheckboxComponent } from '../../../../components/round-checkbox/round-checkbox.component';
import { ApplicationCoverLetterComponent } from './application-cover-letter.component';

describe('ApplicationCoverLettrComponent', () => {
  let component: ApplicationCoverLetterComponent;
  let fixture: ComponentFixture<ApplicationCoverLetterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports : [ MaterialModule, TestingModule ],
      declarations: [ ApplicationCoverLetterComponent, SimpleTagComponent, ActionButtonComponent, RoundCheckboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationCoverLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
