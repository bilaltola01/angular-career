import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-chat-viewer',
  templateUrl: './chat-viewer.component.html',
  styleUrls: ['./chat-viewer.component.scss']
})
export class ChatViewerComponent implements OnInit {

  constructor(private afs: AngularFirestore,) {
    const things = afs.collection('chats').valueChanges();
    things.subscribe(console.log);
  }

  ngOnInit() {
  }

  demoAdd() {
    console.log("TCL: ChatViewerComponent -> demoAdd -> demoAdd");

    const docRef = this.afs.collection('chats').add({test: 'delete me'});
  }

}



