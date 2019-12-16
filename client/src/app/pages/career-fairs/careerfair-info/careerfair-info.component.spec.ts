import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CareerfairInfoComponent } from './careerfair-info.component';

describe('CareerfairInfoComponent', () => {
  let component: CareerfairInfoComponent;
  let fixture: ComponentFixture<CareerfairInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CareerfairInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CareerfairInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
