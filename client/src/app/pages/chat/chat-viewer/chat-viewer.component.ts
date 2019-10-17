import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ChatService, ChatRoom } from 'src/app/services/chat.service';
import { UserObject } from 'src/app/models';

@Component({
  selector: 'app-chat-viewer',
  templateUrl: './chat-viewer.component.html',
  styleUrls: ['./chat-viewer.component.scss']
})
export class ChatViewerComponent implements OnInit {
  chatRoom$: Observable<any>;
  chatId: string;
  newMessage: string;

  cachedUsers: UserObject[] = [];

  things$: Observable<any>;

  constructor(private afs: AngularFirestore, private chatService: ChatService) {
  }

  ngOnInit() { }

  joinRoom() {
    const source = this.chatService.get(this.chatId);
    this.chatRoom$ = this.chatService.joinUsers(source);
  }

  async createRoom() {
     this.chatId = await this.chatService.create(); // TODO: Get and store chat ID
  }

  sendMessage() {
    this.chatService.sendMessage(this.chatId, this.newMessage);
    this.newMessage = '';
  }

  trackByCreated(i, msg) {
    return msg.createdAt;
}

}



