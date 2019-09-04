import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AddSkillPopupComponent } from './add-skill-popup.component';
import { MaterialModule } from 'src/app/modules/material.module';
import { TestingModule } from 'src/app/modules/testing.module';
import { SimpleTagComponent } from 'src/app/components/simple-tag/simple-tag.component';
import { ActionButtonComponent } from '../action-button/action-button.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('AddSkillPopupComponent', () => {
  let component: AddSkillPopupComponent;
  let fixture: ComponentFixture<AddSkillPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports : [ MaterialModule, TestingModule ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: [] },
      ],
      declarations: [ AddSkillPopupComponent, SimpleTagComponent, ActionButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSkillPopupComponent);
    component = fixture.componentInstance;
    fixture.autoDetectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
