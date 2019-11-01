import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestingModule, MaterialModule } from 'src/app/modules';

import { CompaniesComponent } from './companies.component';
import { SimpleTagComponent } from '../../../components/simple-tag/simple-tag.component';
import { ActionButtonComponent } from '../../../components/action-button/action-button.component';
import { RoundCheckboxComponent } from '../../../components/round-checkbox/round-checkbox.component';

describe('CompaniesComponent', () => {
  let component: CompaniesComponent;
  let fixture: ComponentFixture<CompaniesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports : [ MaterialModule, TestingModule ],
      declarations: [ CompaniesComponent, SimpleTagComponent, ActionButtonComponent, RoundCheckboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
