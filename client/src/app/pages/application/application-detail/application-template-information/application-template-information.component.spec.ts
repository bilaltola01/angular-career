import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ApplicationTemplateInformationComponent } from './application-template-information.component';
import { TestingModule } from 'src/app/modules/testing.module';
import { MaterialModule } from 'src/app/modules/material.module';
import { SimpleTagComponent } from '../../../../components/simple-tag/simple-tag.component';
import { ActionButtonComponent } from '../../../../components/action-button/action-button.component';
import { RoundCheckboxComponent } from '../../../../../app/components/round-checkbox/round-checkbox.component';


describe('ApplicationTemplateInformationComponent', () => {
  let component: ApplicationTemplateInformationComponent;
  let fixture: ComponentFixture<ApplicationTemplateInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports : [ MaterialModule, TestingModule ],
      declarations: [ ApplicationTemplateInformationComponent, SimpleTagComponent, ActionButtonComponent, RoundCheckboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationTemplateInformationComponent);
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
