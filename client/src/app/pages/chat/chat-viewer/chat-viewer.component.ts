import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ChatService, ChatRoom } from 'src/app/services/chat.service';


@Component({
  selector: 'app-chat-viewer',
  templateUrl: './chat-viewer.component.html',
  styleUrls: ['./chat-viewer.component.scss']
})
export class ChatViewerComponent implements OnInit {
  // chatRoom$: Observable<ChatRoom>;
  chatRoom$: Observable<any>;
  chatId: string;
  newMessage: string;

  things$: Observable<any>;

  constructor(private afs: AngularFirestore, private chatService: ChatService) {
    // const things = afs.collection('chats').valueChanges();
    // things.subscribe(console.log);
  }

  ngOnInit() {
  
  }

  joinRoom() {
    this.chatRoom$ = this.chatService.get(this.chatId);
  }

  createRoom() {
    this.chatService.create();
  }

  sendMessage() {
    this.chatService.sendMessage(this.chatId, this.newMessage);
    this.newMessage = '';

  }

  trackByCreated(i, msg) {
    return msg.createdAt;
}

}



