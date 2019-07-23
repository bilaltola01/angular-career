import { Routes } from '@angular/router';
import { AuthGuard } from '../../guard/auth.guard';
import { ReadMoreComponent } from './read-more.component';

export const readMoreRouting: Routes = [
  {
    path: '',
    component: ReadMoreComponent
  }
];
