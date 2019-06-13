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
    'profile-about',
    'profile-education',
    'profile-work',
    'profile-skills',
    'profile-project',
    'profile-publication',
    'profile-links',
    'profile-status'
  ];

  selectedPageIndex = 9;

  constructor() { }

  ngOnInit() {
  }

  goToCreatProfilePage() {
    this.selectedPageIndex = 1;
  }

  goToNextPage() {
    if (this.selectedPageIndex < this.profileCreationPages.length - 1) {
      this.selectedPageIndex++;
    }
  }
}
