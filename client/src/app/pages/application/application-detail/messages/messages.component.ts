import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { Observable } from 'rxjs';
import { UserObject } from 'src/app/models';
import { ApplicationService, UserService } from 'src/app/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {

  @ViewChild('chatbox', { static: false }) chatRef: ElementRef;
  chatRoom$: Observable<any>;
  myChatRooms$: Observable<any>;
  chatRoom = [];
  recuriterRoom = [];

  chatId: string;
  newMessage: string;

  cachedUsers: UserObject[] = []; // TODO: Add Cached users
  applicationId;
  recruiterUserId;
  getRoomChatId;
  currentUser;
  positionTitle;
  isJobLoading;
  constructor(private chatService: ChatService, private router: Router, private userService: UserService, private applicationService: ApplicationService) {


  }

  ngOnInit() {
    const urlObject = this.router.url.split('/');
    for (let i = 0; i < urlObject.length; i++) {
      if (i === 2) {
        this.applicationId = urlObject[i];
        console.log('type application id', typeof this.applicationId);
        this.getApplicationData(parseInt(this.applicationId, 10));
      }
    }
    this.checkCuurentUser();
  }

  async checkChatRoom() {

    this.chatService.getApplicantRoom().subscribe(querySnapshot => {
      if (querySnapshot) {
        querySnapshot.forEach(doc => {
          // console.log('doc chatroom id', doc.data())
          if (doc.data().applicationId === this.applicationId) {
            this.chatRoom.push(doc.data());
          }
        });
        this.checkRecuriterChatRoom(this.chatRoom);
      }
    });

  }
  checkRecuriterChatRoom(chatRoom) {
    this.isJobLoading = true;
    this.chatService.getRecuriterRoom().subscribe(querySnapshot => {
      querySnapshot.forEach(doc => {
        chatRoom.push(doc.data());
        this.isJobLoading = false;
      });
      this.getRoomChatId = this.chatRoom.filter(id => id.applicationId === this.applicationId);
      // console.log('filter', this.getRoomChatId)
      if (this.getRoomChatId && this.getRoomChatId.length > 0) {
        this.joinRoom(this.getRoomChatId[0].charRoomId);
      }
    });

  }
  getApplicationData(applicationId) {
    this.applicationService.getApplication(applicationId).subscribe(
      dataJson => {
        this.recruiterUserId = dataJson.data['recruiter_id'];
        this.positionTitle = dataJson.data['position'];
        this.checkChatRoom();
      }
    );
  }
  joinRoom(chatId) {
    // console.log(chatId)
    const source = this.chatService.get(chatId);
    this.chatRoom$ = this.chatService.joinUsers(source);
    this.scrollChatBoxToBottom();
  }

  async sendMessage() {
    if (!this.newMessage) {
      return;
    }
    // debugger
    this.newMessage.trim();
    if (this.getRoomChatId.length > 0) {
      if (this.newMessage.length > 0 || this.newMessage.length < 5000) {
        this.chatService.sendMessage(this.getRoomChatId[0].charRoomId, this.newMessage);
        this.newMessage = '';
        this.scrollChatBoxToBottom();
      }
    } else {
      // debugger;
      this.chatId = await this.chatService.create(this.positionTitle, this.recruiterUserId, this.applicationId);
      this.joinRoom(this.chatId);
      if (this.newMessage.length > 0 || this.newMessage.length < 5000) {
        this.chatService.sendMessage(this.chatId, this.newMessage);
        this.newMessage = '';
        this.scrollChatBoxToBottom();
        this.checkChatRoom();
      }
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

  checkCuurentUser() {
    this.currentUser = this.userService.user_id;
  }
}
