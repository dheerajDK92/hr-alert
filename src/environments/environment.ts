// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: "localhost:3000/login",
  dummyOTP: 123456,
  perssionName: "permissionaForHRAlert",
  Appname: "Alert Care",
  hrEmail: "hr@alertltd.com",
  resendOTPTime: 5,
  TOKEN_KEY: "auth-token",
  firstTime: "isFirstTime",
  protocol: "http://",
  googleMapKey: "AIzaSyB_K6mynZl9o1SbTGOBSy6hudZZH63IrMA",
  // apiURL: "localhost:3000/api/v1",
  apiURL: "185.196.3.147:3000/api/v1",
  geoCodingRever:"https://us1.locationiq.com/v1/reverse.php?key=f3b511a93f4e53&format=json"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
