import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestingModule, MaterialModule } from 'src/app/modules';

import { PeopleSearchComponent } from './people-search.component';
import { SimpleTagComponent } from '../../../components/simple-tag/simple-tag.component';
import { ActionButtonComponent } from '../../../components/action-button/action-button.component';
import { RoundCheckboxComponent } from '../../../components/round-checkbox/round-checkbox.component';

describe('PeopleSearchComponent', () => {
  let component: PeopleSearchComponent;
  let fixture: ComponentFixture<PeopleSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports : [ MaterialModule, TestingModule ],
      declarations: [ PeopleSearchComponent, SimpleTagComponent, ActionButtonComponent, RoundCheckboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeopleSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
