import settings from './../../../settings.json';

export const environment = {
  production: true,
  serverUrl: settings['URLS']['PRODUCTION']['GATEWAY'],
  auth_service: 'auth-service',
  user_service: 'user-service',
  api_version: 'v1'
};
