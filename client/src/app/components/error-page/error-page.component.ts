import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.scss']
})

export class ErrorPageComponent implements OnInit {
  // initially we assume that the user is more likely to specify unused url in browser's url bar ( 404 )
  // instead of trying to fake the token data ( 401 )
  public statusCode = 404;

  constructor(private activatedRoute: ActivatedRoute) {
  }

  public ngOnInit(): void {
    const routeSnapshot: number =
      Number(
        this.activatedRoute.snapshot.queryParams['status-code'] ||
        this.activatedRoute.snapshot.params['status-code'] ||
        '404');

    // If routeSnapshot is > 0 this means that we have a route parameter, otherwise use the initial 404 value
    if (routeSnapshot > 0) {
      this.statusCode = routeSnapshot;
    }
  }
}
