import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundCheckboxComponent } from './round-checkbox.component';

describe('RoundCheckboxComponent', () => {
  let component: RoundCheckboxComponent;
  let fixture: ComponentFixture<RoundCheckboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoundCheckboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('checking toggleChecks toggle check', () => {
    component.checked = false;
    component.toggleCheck();
    expect(component.checked).toBeTruthy();
    component.toggleCheck();
    expect(component.checked).toBeFalsy();
  });

});
