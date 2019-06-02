import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleTagComponent } from './../../components/simple-tag/simple-tag.component';

import { StyleGuideComponent } from './style-guide.component';
import { TestingModule } from 'src/app/modules/testing.module';
import { MaterialModule } from 'src/app/modules/material.module';

describe('StyleGuideComponent', () => {
  let component: StyleGuideComponent;
  let fixture: ComponentFixture<StyleGuideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports : [ MaterialModule, TestingModule ],
      declarations: [ StyleGuideComponent, SimpleTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StyleGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
