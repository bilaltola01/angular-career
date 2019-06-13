import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.scss']
})
export class CreateProfileComponent implements OnInit {

  profileCreationPages = [
    'choose-option',
    'profile-basic',
  ];

  selectedPageIndex = 1;

  constructor() { }

  ngOnInit() {
  }

  goToCreatProfilePage() {
    this.selectedPageIndex = 1;
  }

}
