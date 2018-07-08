# BeaconES6Proto

Prototype/Sandbox for developing the Beacon Architecture.

This version will be written primarily for use in NodeJS apps, but the repo will include the ability to run Browserfy to 
spit out a browser-usable version (I hope). The idea is to be generic and not dependant on Angular, React, etc. networking
libraries. We may write framework specific version later.

## Installation for NodeJS Apps (and Beaconflood.js)

- Install Node.js if it is not already installed.
    - Node version must support ES6 features, especially closures.
    - This was developed using Node version 8.9.3, and tested to 10.x+. Stock Ubuntu installs the ancient 4.x version which DOES NOT work. Follow the directions for your platform to get a recent version.
- After cloning the repo, go into the root folder (with `package.json` in it) and `npm install`
- Test installation by going to `tests/performance` and running `node beaconflood.js`. If there are no nasty Node errors, you should be cool.

## Running Beaconflood on Hieroku

`node beaconflood.js -r -k 1234-5678-8765-4321 -c 10 -l 5`

`-r` = run remote
`-k` = api key
`-c` = how many beacons to send
`-l` = inter-beacon loop delay in ms


## Publishing New Versions to NPM

Steps:
- Update the `package.json` to the appropriate rev level.
- `npm publish`




