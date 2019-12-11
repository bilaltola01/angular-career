import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from 'src/app/modules/testing.module';
import { MaterialModule } from 'src/app/modules/material.module';
import { SimpleTagComponent } from '../../../../components/simple-tag/simple-tag.component';
import { ActionButtonComponent } from '../../../../components/action-button/action-button.component';
import { RoundCheckboxComponent } from '../../../../../app/components/round-checkbox/round-checkbox.component';
import { ApplicationPositionInformationComponent } from './application-position-information.component';

describe('ApplicationPositionInformationComponent', () => {
  let component: ApplicationPositionInformationComponent;
  let fixture: ComponentFixture<ApplicationPositionInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports : [ MaterialModule, TestingModule ],
      declarations: [ ApplicationPositionInformationComponent, SimpleTagComponent, ActionButtonComponent, RoundCheckboxComponent  ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationPositionInformationComponent);
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
