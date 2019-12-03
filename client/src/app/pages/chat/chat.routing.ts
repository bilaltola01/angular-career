import { ChatViewerComponent } from './chat-viewer/chat-viewer.component';
import { AuthGuard } from '../../guard/auth.guard';
import { Routes } from '@angular/router';

export const chatRoutes: Routes = [
  {
    path: '',
    component: ChatViewerComponent,
    canActivate: [AuthGuard]
  }
];
