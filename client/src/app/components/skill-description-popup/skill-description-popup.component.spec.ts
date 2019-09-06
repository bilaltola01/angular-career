import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialModule } from 'src/app/modules/material.module';
import { TestingModule } from 'src/app/modules/testing.module';
import { SkillDescriptionPopupComponent } from './skill-description-popup.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SimpleTagComponent } from 'src/app/components/simple-tag/simple-tag.component';

describe('SkillDescriptionPopupComponent', () => {
  let component: SkillDescriptionPopupComponent;
  let fixture: ComponentFixture<SkillDescriptionPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports : [ MaterialModule, TestingModule ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: [] },
      ],
      declarations: [ SkillDescriptionPopupComponent, SimpleTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillDescriptionPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
