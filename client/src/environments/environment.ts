// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import settings from './../../../settings.json';

export const environment = {
  production: false,
  serverUrl: settings['URLS']['LOCAL_DOCKER']['GATEWAY'],
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

/*
 * In development mode, for easier debugging, you can ignore zone related error
 * stack frames such as `zone.run`/`zoneDelegate.invokeTask` by importing the
 * below file. Don't forget to comment it out in production mode
 * because it will have a performance impact when errors are thrown
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
