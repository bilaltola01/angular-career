import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionSearchComponent } from './position-search.component';
import { TestingModule } from 'src/app/modules/testing.module';
import { MaterialModule } from 'src/app/modules/material.module';

import { SimpleTagComponent } from '../../../components/simple-tag/simple-tag.component';
import { ActionButtonComponent } from '../../../components/action-button/action-button.component';
import { RoundCheckboxComponent } from '../../../components/round-checkbox/round-checkbox.component';
describe('PositionSearchComponent', () => {
  let component: PositionSearchComponent;
  let fixture: ComponentFixture<PositionSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports : [ MaterialModule, TestingModule ],
      declarations: [ PositionSearchComponent, SimpleTagComponent, ActionButtonComponent, RoundCheckboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PositionSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
