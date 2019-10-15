import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { firestore } from 'firebase/app';
import { map, switchMap } from 'rxjs/operators';
import { Observable, combineLatest, of } from 'rxjs';
import { UserService } from './user.service';

export interface ChatRoom {
  // uuid: string;
  createdAt: number;
  title: string;
  // participants: ChatMember[];
  participant1?: ChatMember;
  participant2?: ChatMember;
  messages?: ChatMessage[];
}
export interface ChatMember {
  id: number; // Only ID for now
  photo_url: string;
  first_name: string;
  last_name: string;
  isRecruiter: number; // 0 false, 1 true
}
export interface ChatMessage {
  uid: number;
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
export class ChatService {
  constructor(
    private afs: AngularFirestore,
    // private auth: AuthService,
    private userService: UserService,
  ) {}

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

  async create() {
    // const { uid } = await this.auth.getUser();

    this.userService.getGeneralInfo().subscribe( async info => {

      const chatMember: ChatMember = {
        id: info.data.user_id,
        photo_url: info.data.photo,
        first_name: info.data.first_name,
        last_name: info.data.last_name,
        isRecruiter: info.data.recruiter
      };

      const chatData: ChatRoom = {
        // uuid: chatId,
        title: 'Delete Room',
        createdAt: Date.now(),
        participant1: chatMember,
      };

      const docRef = await this.afs.collection('ChatRooms').add(chatData);
      console.log("TCL: ChatService -> create -> docRef.id", docRef.id)

      return docRef.id;

    });

  }

  async sendMessage(chatId, content) {
    const uid  = this.userService.user_id;

    const data = {
      uid,
      content,
      createdAt: Date.now()
    };

    if (uid) {
      const ref = this.afs.collection('ChatRooms').doc(chatId);
      return ref.update({
        messages: firestore.FieldValue.arrayUnion(data)
      });
    }
  }

}