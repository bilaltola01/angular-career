import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatService } from 'src/app/services/chat.service'; // TODO: Fix
import { UserObject } from 'src/app/models';

@Component({
  selector: 'app-chat-viewer',
  templateUrl: './chat-viewer.component.html',
  styleUrls: ['./chat-viewer.component.scss']
})
export class ChatViewerComponent implements OnInit {
  @ViewChild('chatbox', { static: false }) chatRef: ElementRef;
  chatRoom$: Observable<any>;
  myChatRooms$: Observable<any>;

  someRooms  = [];
  chatId: string;
  chatTitle: string;
  chatOtherUserId: string;
applicationId: number;
  newMessage: string;

  cachedUsers: UserObject[] = []; // TODO: Add Cached users

  constructor(private chatService: ChatService) {
  }

  ngOnInit() { }

  joinRoom() {
    const source = this.chatService.get(this.chatId);
    this.chatRoom$ = this.chatService.joinUsers(source);
    this.scrollChatBoxToBottom();
  }

  async createRoom() {
     this.chatId = await this.chatService.create(this.chatTitle, parseInt(this.chatOtherUserId, 10), this.applicationId);

  }

  getMyRooms() {
    this.myChatRooms$ = this.chatService.getMyRooms();
    this.chatService.getMyRooms().subscribe(querySnapshot => {
      querySnapshot.forEach(doc => {
        // console.log("TCL: ChatViewerComponent -> getMyRooms -> doc.data()", doc.data())
        this.someRooms.push(doc.data());
      });
    });
  }

  sendMessage() {
    if (!this.newMessage) {
      return;
    }

    this.newMessage.trim();
    if (this.newMessage.length > 0 || this.newMessage.length < 5000) {
      this.chatService.sendMessage(this.chatId, this.newMessage);
      this.newMessage = '';
      this.scrollChatBoxToBottom();
    }
  }

  trackByCreated(i, msg) {
    return msg.createdAt;
  }

  scrollChatBoxToBottom() {
    if (this.chatRef) {
      setTimeout(() => {
        this.chatRef.nativeElement.scrollTop = this.chatRef.nativeElement.scrollHeight + 50;
      }, 500);
    }
  }

}
