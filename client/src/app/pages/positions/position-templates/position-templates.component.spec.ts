import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionTemplatesComponent } from './position-templates.component';
import { TestingModule, MaterialModule } from 'src/app/modules';
import { ActionButtonComponent } from 'src/app/components/action-button/action-button.component';

describe('PositionTemplatesComponent', () => {
  let component: PositionTemplatesComponent;
  let fixture: ComponentFixture<PositionTemplatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports : [ MaterialModule, TestingModule ],
      declarations: [ PositionTemplatesComponent, ActionButtonComponent ]
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
