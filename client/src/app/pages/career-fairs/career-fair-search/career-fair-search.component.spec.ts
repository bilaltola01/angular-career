import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CareerFairSearchComponent } from './career-fair-search.component';

describe('CareerFairSearchComponent', () => {
  let component: CareerFairSearchComponent;
  let fixture: ComponentFixture<CareerFairSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CareerFairSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CareerFairSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
