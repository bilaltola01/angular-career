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
  application_service: 'application_service',
  api_version: 'v1'
};

/*
 * In development mode, for easier debugging, you can ignore zone related error
 * stack frames such as `zone.run`/`zoneDelegate.invokeTask` by importing the
 * below file. Don't forget to comment it out in production mode
 * because it will have a performance impact when errors are thrown
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
