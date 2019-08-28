import settings from './../../../settings.json';

export const environment = {
  production: true,
  serverUrl: settings['URLS']['PRODUCTION']['GATEWAY'],
  auth_service: 'auth-service',
  user_service: 'user-service',
  autocomplete_service: 'autocomplete-service',
  application_service: 'application-service',
  position_service: 'position-service',
  cart_service: 'cart-service',
  company_service: 'companies-service',
  api_version: 'v1'
};
