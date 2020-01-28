import settings from './../../../settings.json';

export const environment = {
  production: true,
  serverUrl: settings['URLS']['PRODUCTION']['GATEWAY'],
  auth_service: 'auth-service',
  user_service: 'user-service',
  autocomplete_service: 'autocomplete-service',
  application_service: 'application-service',
  position_service: 'position-service',
  position_management_service: 'position-management-service',
  cart_service: 'cart-service',
  careerfair_service: 'careerfair-service',
  matching_service: 'matching-service',
  company_service: 'companies-service',
  score_service: 'score-service',
  recruiter_service: 'recruiter-service',
  company_admin_service: 'company-admin-service',
  api_version: 'v1',
  firebase: {
    apiKey: 'AIzaSyDixV2JhwZ6ztWJZvyibry_nvhy0lyXmlA',
    authDomain: 'cf-chat-8efa4.firebaseapp.com',
    databaseURL: 'https://cf-chat-8efa4.firebaseio.com',
    projectId: 'cf-chat-8efa4',
    storageBucket: 'cf-chat-8efa4.appspot.com',
    messagingSenderId: '1008369027673',
    appId: '1:1008369027673:web:88618bb4db6787f6053f48',
    measurementId: 'G-MQ5MTB2RJV'
  }
};
