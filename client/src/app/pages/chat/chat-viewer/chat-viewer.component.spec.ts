import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from 'src/app/modules/testing.module';
import { MaterialModule } from 'src/app/modules/material.module';
import { ActionButtonComponent } from '../../../components/action-button/action-button.component';
import { ChatViewerComponent } from './chat-viewer.component';
import { BehaviorSubject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';

describe('ChatViewerComponent', () => {
  let component: ChatViewerComponent;
  let fixture: ComponentFixture<ChatViewerComponent>;

  const FirestoreStub = {
    collection: (name: string) => ({
      doc: (_id: string) => ({
        valueChanges: () => new BehaviorSubject({ foo: 'bar' }),
        set: (_d: any) => new Promise((resolve, _reject) => resolve()),
      }),
    }),
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports : [ MaterialModule, TestingModule ],
      declarations: [ ChatViewerComponent, ActionButtonComponent ],
      providers: [
        { provide: AngularFirestore, useValue: FirestoreStub },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
