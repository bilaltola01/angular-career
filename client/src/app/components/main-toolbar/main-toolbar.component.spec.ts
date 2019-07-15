import { LayoutModule } from '@angular/cdk/layout';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './../../modules/material.module';
import { TestingModule } from './../../modules/testing.module';

import { MainToolbarComponent } from './main-toolbar.component';

describe('MainToolbarComponent', () => {
  let component: MainToolbarComponent;
  let fixture: ComponentFixture<MainToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MainToolbarComponent],
      imports: [
        NoopAnimationsModule,
        LayoutModule,
        MaterialModule,
        TestingModule,
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
