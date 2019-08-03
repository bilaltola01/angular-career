import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsSectionComponent } from './contacts-section.component';

describe('ContactsSectionComponent', () => {
  let component: ContactsSectionComponent;
  let fixture: ComponentFixture<ContactsSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactsSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
