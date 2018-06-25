#BeaconES6Proto

Prototype/Sabdbox for developing the Beacon Architecture.

##Publishing New Versions

Steps:
- Once you're ready to publish `webpack` it. The config is currently setup for inline source map and no uglification 
since this is very much WIP.
- Update the `package.json` to the appropriate rev level.
- `npm publish`

##Using in an Web App

In the source folder, add an npm dependency:

`npm install -D beacon-es6-proto`

In the main module for the app, add:

`import beaconES6Proto from 'beacon-es6-proto';`

##Angular Usage
And where you define the main module be sure to inject `beaconES6Proto`:

`const ngModule = angular.module( 'ngApp', [ ourglassAPI, ngAnimate, ngTouch, uirouter, beaconES6Proto ] );`


