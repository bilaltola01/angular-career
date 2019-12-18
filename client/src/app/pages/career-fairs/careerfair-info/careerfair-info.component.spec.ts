import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule, MaterialModule } from './../../../../../src/app/modules';
import { SimpleTagComponent } from '../../../components/simple-tag/simple-tag.component';
import { ActionButtonComponent } from '../../../components/action-button/action-button.component';
import { RoundCheckboxComponent } from '../../../components/round-checkbox/round-checkbox.component';
import { CareerfairInfoComponent } from './careerfair-info.component';

describe('CareerfairInfoComponent', () => {
  let component: CareerfairInfoComponent;
  let fixture: ComponentFixture<CareerfairInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports : [ MaterialModule, TestingModule ],
      declarations: [ CareerfairInfoComponent, SimpleTagComponent, ActionButtonComponent, RoundCheckboxComponent ]
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
