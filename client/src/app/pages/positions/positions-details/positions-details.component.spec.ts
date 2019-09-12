import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from 'src/app/modules/testing.module';
import { MaterialModule } from 'src/app/modules/material.module';
import { PositionsDetailsComponent } from './positions-details.component';
import { SimpleTagComponent } from '../../../components/simple-tag/simple-tag.component';
import { ActionButtonComponent } from '../../../components/action-button/action-button.component';
import { RoundCheckboxComponent } from '../../../components/round-checkbox/round-checkbox.component';

describe('PositionsDetailsComponent', () => {
  let component: PositionsDetailsComponent;
  let fixture: ComponentFixture<PositionsDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports : [ MaterialModule, TestingModule ],
      declarations: [ PositionsDetailsComponent, SimpleTagComponent, ActionButtonComponent, RoundCheckboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PositionsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
