import { AuthGuard } from './auth.guard';
import { UnauthGuard } from './unauth.guard';

export const guards = [
  AuthGuard,
  UnauthGuard
];
