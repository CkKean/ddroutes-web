// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: "/ddroutes-modular",
  name: '',
  consoleEnabled: true,
  devMode: true,
  log: true,
  flags: {
    useNewHeader: true,
  },
  mapbox: {
    accessToken: 'pk.eyJ1IjoiY2hlZWtlYW4xOTk3IiwiYSI6ImNrbXoxa3I4MDA1bTkydmwydWtyMWoxZmgifQ.QiM6rCDgQTh5nNVFUO9CAA'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
