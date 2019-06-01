import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-style-guide',
  templateUrl: './style-guide.component.html',
  styleUrls: ['./style-guide.component.scss']
})
export class StyleGuideComponent implements OnInit {

  constructor(private data: DataService) { }


  ngOnInit() {
    this.data.getTest().subscribe(
      dataJson => {
        console.log('TCL: StyleGuideComponent -> ngOnInit -> dataJson', dataJson);
      },
      error => console.log(error)
    );
  }



}
