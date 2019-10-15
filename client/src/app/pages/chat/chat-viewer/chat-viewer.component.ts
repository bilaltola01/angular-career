import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ChatService, ChatRoom } from 'src/app/services/chat.service';
import { UserObject } from 'src/app/models';
import { filter } from 'lodash';
import { UserService } from 'src/app/services';


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

  cachedUsers: UserObject[] = [];

  things$: Observable<any>;

  constructor(private afs: AngularFirestore, private chatService: ChatService, private userService: UserService) {
    // const things = afs.collection('chats').valueChanges();
    // things.subscribe(console.log);
  }

  ngOnInit() {
  
  }

  joinRoom() {
    // this.chatRoom$ = this.chatService.get(this.chatId);
    const source = this.chatService.get(this.chatId);
    this.chatRoom$ = this.chatService.joinUsers(source);
  }

  createRoom() {
    this.chatService.create();
  }

  sendMessage() {
    this.chatService.sendMessage(this.chatId, this.newMessage);
    this.newMessage = '';
  }

  // Get the user from cached user or update if not present
  // getUserById(id): UserObject {
  //   if ( filter(this.cachedUsers, { user_id: id}).length < 1) {
  //     this.userService.getGeneralInfo().subscribe( async userInfo => {
  //       console.log('TCL: ChatViewerComponent -> getUserById -> userInfo', userInfo);
  //       this.cachedUsers.push(userInfo);
  //       return userInfo;
  //     });
  //   } else {
  //     return filter(this.cachedUsers, { user_id: id})[0];
  //   }
  // }

  trackByCreated(i, msg) {
    return msg.createdAt;
}

}



