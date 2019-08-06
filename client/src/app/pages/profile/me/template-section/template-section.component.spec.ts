import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateSectionComponent } from './template-section.component';

describe('TemplateSectionComponent', () => {
  let component: TemplateSectionComponent;
  let fixture: ComponentFixture<TemplateSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateSectionComponent ]
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
