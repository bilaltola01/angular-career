import { Component, OnInit } from '@angular/core';
import { AlertsService, UserService } from '../../../services';
import { Subject } from 'rxjs';
// import { Companies, CompanyModel } from '../../../models';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

class CompanySize {
  id: number;
  name: string;
}

@Component({
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss']
})

export class CompaniesComponent implements OnInit {
    public ngOnInit(): void {
    }

}
