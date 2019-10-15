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

  async create() { // TODO: Add title
    // const { uid } = await this.auth.getUser();

    this.userService.getGeneralInfo().subscribe( async info => {

      console.log("TCL: ChatService -> create -> info", info)

      const chatMember: ChatMember = { // TODO: Maybe not needeeed
        id: info.data.user_id,
        photo_url: info.data.photo,
        first_name: info.data.first_name,
        last_name: info.data.last_name,
        isRecruiter: info.data.recruiter
      };

      const chatData: ChatRoom = {
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
    const user_id  = this.userService.user_id; // TODO: Get User ID function

    const data = {
      user_id,
      content,
      createdAt: Date.now()
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

        const userDocs = user_ids.map(u =>
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
