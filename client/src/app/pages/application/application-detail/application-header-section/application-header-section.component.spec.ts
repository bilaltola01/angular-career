import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialModule } from 'src/app/modules/material.module';
import { SimpleTagComponent } from '../../../../components/simple-tag/simple-tag.component';
import { ActionButtonComponent } from '../../../../components/action-button/action-button.component';
import { RoundCheckboxComponent } from '../../../../../app/components/round-checkbox/round-checkbox.component';
import { ApplicationHeaderSectionComponent } from './application-header-section.component';
import { TestingModule } from 'src/app/modules/testing.module';
import { ApplicationNavSectionComponent } from './../application-nav-section/application-nav-section.component';

describe('ApplicationHeaderSectionComponent', () => {
  let component: ApplicationHeaderSectionComponent;
  let fixture: ComponentFixture<ApplicationHeaderSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports : [ MaterialModule, TestingModule ],
      declarations: [ ApplicationHeaderSectionComponent, ApplicationNavSectionComponent, SimpleTagComponent, ActionButtonComponent, RoundCheckboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationHeaderSectionComponent);
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
