import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from 'src/app/modules/testing.module';
import { MaterialModule } from 'src/app/modules/material.module';
import { SimpleTagComponent } from '../../../../components/simple-tag/simple-tag.component';
import { ActionButtonComponent } from '../../../../components/action-button/action-button.component';
import { RoundCheckboxComponent } from '../../../../../app/components/round-checkbox/round-checkbox.component';

import { ApplicationNavSectionComponent } from './application-nav-section.component';

describe('ApplicationNavSectionComponent', () => {
  let component: ApplicationNavSectionComponent;
  let fixture: ComponentFixture<ApplicationNavSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports : [ MaterialModule, TestingModule ],
      declarations: [ ApplicationNavSectionComponent, SimpleTagComponent, ActionButtonComponent, RoundCheckboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationNavSectionComponent);
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
