import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-style-guide',
  templateUrl: './style-guide.component.html',
  styleUrls: ['./style-guide.component.scss']
})
export class StyleGuideComponent implements OnInit {

  constructor(private userService: UserService) { }


  ngOnInit() {
    this.userService.loadUsers('offset=0&limit=20&name=Royce').subscribe(
      dataJson => {
        console.log('TCL: StyleGuideComponent -> ngOnInit -> dataJson', dataJson);
      },
      error => console.log(error)
    );
  }



}
