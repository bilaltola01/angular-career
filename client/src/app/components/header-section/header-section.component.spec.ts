import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialModule } from './../../modules/material.module';
import { TestingModule } from './../../modules/testing.module';

import { HeaderSectionComponent } from './header-section.component';
import { SimpleTagComponent } from './../simple-tag/simple-tag.component';

describe('HeaderSectionComponent', () => {
  let component: HeaderSectionComponent;
  let fixture: ComponentFixture<HeaderSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ MaterialModule, TestingModule ],
      declarations: [ HeaderSectionComponent, SimpleTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
