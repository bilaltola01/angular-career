import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialModule, TestingModule } from 'src/app/modules';

import { CompanyDetailComponent } from './company-detail.component';

import { SimpleTagComponent } from 'src/app/components/simple-tag/simple-tag.component';

describe('CompanyDetailComponent', () => {
  let component: CompanyDetailComponent;
  let fixture: ComponentFixture<CompanyDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports : [ MaterialModule, TestingModule ],
      declarations: [ CompanyDetailComponent, SimpleTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
