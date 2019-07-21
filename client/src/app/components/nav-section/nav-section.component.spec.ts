import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialModule } from 'src/app/modules';

import { NavSectionComponent } from './nav-section.component';
import { ActionButtonComponent } from 'src/app/components/action-button/action-button.component';

describe('NavSectionComponent', () => {
  let component: NavSectionComponent;
  let fixture: ComponentFixture<NavSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports : [ MaterialModule ],
      declarations: [ NavSectionComponent, ActionButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
