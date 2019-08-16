import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialModule, TestingModule } from 'src/app/modules';

import { TemplateSectionComponent } from './template-section.component';
import { ActionButtonComponent } from 'src/app/components/action-button/action-button.component';
import { RoundCheckboxComponent } from 'src/app/components/round-checkbox/round-checkbox.component';

describe('TemplateSectionComponent', () => {
  let component: TemplateSectionComponent;
  let fixture: ComponentFixture<TemplateSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports : [ MaterialModule, TestingModule ],
      declarations: [ TemplateSectionComponent, ActionButtonComponent, RoundCheckboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
