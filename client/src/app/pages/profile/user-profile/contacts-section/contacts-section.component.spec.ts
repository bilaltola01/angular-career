import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialModule, TestingModule } from 'src/app/modules';

import { ContactsSectionComponent } from './contacts-section.component';
import { ActionButtonComponent } from 'src/app/components/action-button/action-button.component';

describe('ContactsSectionComponent', () => {
  let component: ContactsSectionComponent;
  let fixture: ComponentFixture<ContactsSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports : [ MaterialModule, TestingModule ],
      declarations: [ ContactsSectionComponent, ActionButtonComponent ]
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
