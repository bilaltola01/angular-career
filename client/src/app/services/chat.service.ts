import { Injectable, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { firestore } from 'firebase/app';
import { map, switchMap } from 'rxjs/operators';
import { Observable, combineLatest, of, merge } from 'rxjs';
import { UserService } from './user.service';

export interface ChatRoom {
  createdAt: number;
  title: string;
  messages?: ChatMessage[];
}

export interface ChatMessage {
  user_id: number;
  content: string;
  createdAt: number;
  type: MessageType.Simple;
}
enum MessageType {
  Simple,
}

@Injectable({
  providedIn: 'root'
})
export class ChatService implements OnInit {

  constructor(
    private afs: AngularFirestore,
    private userService: UserService,
  ) {}

  ngOnInit() { }

  get(chatId) {
    return this.afs
      .collection<any>('ChatRooms')
      .doc(chatId)
      .snapshotChanges()
      .pipe(
        map(doc => {
          return { id: doc.payload.id, ...doc.payload.data() };
        })
      );
  }

  async create(roomTitle: string = 'Room Title', otherUserId: number, applicationId: number) {

      const chatRoomData: ChatRoom = {
        title: roomTitle,
        createdAt: Date.now(),
        messages: []
      };

      const docRef = await this.afs.collection('ChatRooms').add(chatRoomData);


      const chatRoomPairs = {
        userRecruiterId: otherUserId,
        userApplicantId: this.userService.user_id,
        applicationId: applicationId,
        charRoomId: docRef.id,
        chatRoomTitle: roomTitle,
      };

      const docRefPairs = await this.afs.collection('chatRoomPairs').add(chatRoomPairs);

      return docRef.id;
  }

  getMyRooms() {
    const user_id  = this.userService.user_id;
    const applicantRooms = this.afs.collection('chatRoomPairs', ref => ref.where('userRecruiterId', '==', user_id)).get();
    const recruiterRooms = this.afs.collection('chatRoomPairs', ref => ref.where('userApplicantId', '==', user_id)).get();

    const mergedRooms = merge(applicantRooms, recruiterRooms);

    return mergedRooms;
  }
  getApplicantRoom() {
    const user_id = this.userService.user_id;
    const applicantRooms  =  this.afs.collection('chatRoomPairs', ref => ref.where('userRecruiterId', '==', user_id)).get();
    return applicantRooms;
  }
  getRecuriterRoom() {
    const user_id = this.userService.user_id;
    const recruiterRooms = this.afs.collection('chatRoomPairs', ref => ref.where('userApplicantId', '==', user_id)).get();
    return recruiterRooms ;
  }


  async sendMessage(chatId, content) {
    const user_id  = this.userService.user_id; // TODO: Make a Get User ID function

    const data: ChatMessage = {
      user_id,
      content,
      createdAt: Date.now(),
      type: MessageType.Simple
    };

    if (user_id) {
      const ref = this.afs.collection('ChatRooms').doc(chatId);
      return ref.update({
        messages: firestore.FieldValue.arrayUnion(data)
      });
    }
  }

  joinUsers(chat$: Observable<any>) {
    let chat;
    const joinKeys = {};

    return chat$.pipe(
      switchMap(c => {
        // Unique User IDs
        chat = c;
        const user_ids = Array.from(new Set(c.messages.map(v => v.user_id)));

        // Firestore User Doc Reads
        const userDocs = user_ids.map(u =>
          // TODO: This should be cached somehow to reduce the number of GETs
          this.userService.getGeneralInfo(u as number)
        );

        return userDocs.length ? combineLatest(userDocs) : of([]);
      }),
      map(arr => {
        arr.forEach(v => {
          joinKeys[(<any>v).data.user_id] = v.data;
        });

        chat.messages = chat.messages.map(v => {
          return { ...v, user: joinKeys[v.user_id] };
        });

        return chat;
      })
    );
  }

}
