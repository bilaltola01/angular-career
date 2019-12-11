import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialModule } from 'src/app/modules/material.module';
import { TestingModule } from 'src/app/modules/testing.module';
import { SimpleTagComponent } from 'src/app/components/simple-tag/simple-tag.component';
import { ActionButtonComponent } from '../action-button/action-button.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InterestLevelPopupComponent } from './interest-level-popup.component';

describe('InterestLevelPopupComponent', () => {
  let component: InterestLevelPopupComponent;
  let fixture: ComponentFixture<InterestLevelPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports : [ MaterialModule, TestingModule ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: [] },
      ],
      declarations: [ InterestLevelPopupComponent, SimpleTagComponent, ActionButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterestLevelPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
