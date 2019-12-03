import { TestBed } from '@angular/core/testing';

import { BehaviorSubject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ChatService } from './chat.service';


describe('ChatService', () => {
  const FirestoreStub = {
    collection: (name: string) => ({
      doc: (_id: string) => ({
        valueChanges: () => new BehaviorSubject({ foo: 'bar' }),
        set: (_d: any) => new Promise((resolve, _reject) => resolve()),
      }),
    }),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports : [ HttpClientTestingModule, RouterTestingModule ],
      providers: [
        { provide: AngularFirestore, useValue: FirestoreStub },
      ],
    });
  });

  it('should be created', () => {
    const service: ChatService = TestBed.get(ChatService);
    expect(service).toBeTruthy();
  });
});
