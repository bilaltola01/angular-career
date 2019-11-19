import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialModule, TestingModule } from 'src/app/modules';
import { ReferencesSectionComponent } from './references-section.component';
import { ActionButtonComponent } from 'src/app/components/action-button/action-button.component';

describe('ReferencesSectionComponent', () => {
  let component: ReferencesSectionComponent;
  let fixture: ComponentFixture<ReferencesSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports : [ MaterialModule, TestingModule ],
      declarations: [ ReferencesSectionComponent, ActionButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferencesSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
