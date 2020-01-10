import { AuthGuard } from './auth.guard';
import { UnauthGuard } from './unauth.guard';
import { RecruiterGuard } from './role.guard';

export const guards = [
  AuthGuard,
  UnauthGuard,
  RecruiterGuard
];
