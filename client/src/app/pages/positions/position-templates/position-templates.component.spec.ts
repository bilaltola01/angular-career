import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionTemplatesComponent } from './position-templates.component';

describe('PositionTemplatesComponent', () => {
  let component: PositionTemplatesComponent;
  let fixture: ComponentFixture<PositionTemplatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PositionTemplatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PositionTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
