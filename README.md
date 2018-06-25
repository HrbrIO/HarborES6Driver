#BeaconES6Proto

Prototype/Sandbox for developing the Beacon Architecture.

This version will be written primarily for use in NodeJS apps, but the repo will include the ability to run Browserfy to 
spit out a browser-usable version (I hope). The idea is to be generic and not dependant on Angular, React, etc. networking
libraries. We may well write framework specific version later.

##Publishing New Versions to NPM

Steps:
- Once you're ready to publish `webpack` it. The config is currently setup for inline source map and no uglification 
since this is very much WIP.
- Update the `package.json` to the appropriate rev level.
- `npm publish`




