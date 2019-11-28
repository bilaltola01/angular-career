import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from 'src/app/modules/testing.module';
import { MaterialModule } from 'src/app/modules/material.module';
import { CareerFairSearchComponent } from './career-fair-search.component';
import { ActionButtonComponent } from 'src/app/components/action-button/action-button.component';

describe('CareerFairSearchComponent', () => {
  let component: CareerFairSearchComponent;
  let fixture: ComponentFixture<CareerFairSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports : [ MaterialModule, TestingModule ],
      declarations: [ CareerFairSearchComponent, ActionButtonComponent ]
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
