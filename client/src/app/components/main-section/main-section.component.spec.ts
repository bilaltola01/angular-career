import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialModule, TestingModule } from 'src/app/modules';

import { MainSectionComponent } from './main-section.component';
import { SimpleTagComponent } from './../simple-tag/simple-tag.component';
import { ActionButtonComponent } from 'src/app/components/action-button/action-button.component';

describe('MainSectionComponent', () => {
  let component: MainSectionComponent;
  let fixture: ComponentFixture<MainSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports : [ MaterialModule, TestingModule ],
      declarations: [ MainSectionComponent, SimpleTagComponent, ActionButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});