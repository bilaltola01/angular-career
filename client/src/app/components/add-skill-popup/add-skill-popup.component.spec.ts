import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSkillPopupComponent } from './add-skill-popup.component';

describe('AddSkillPopupComponent', () => {
  let component: AddSkillPopupComponent;
  let fixture: ComponentFixture<AddSkillPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSkillPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSkillPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
