/*********************************

 File:       beacon.js
 Function:   Main Beacon Object
 Copyright:  hrbr.io
 Date:       6/26/18 5:27 PM
 Author:     mkahn

 I've gone around the mental horn several times trying to decide whether this should be a *true* Node singleton
 or not. Out of the box, NodeJS `required` objects are not guaranteed to be true singletons. See the discussion
 in the link: https://derickbailey.com/2016/03/09/creating-a-true-singleton-in-node-js-with-es6-symbols/.

 For now, I am going to keep it light, and not go the extra mile with the fancy Singletons...

 **********************************/


let isBeaconInitialized = false;

let beaconStatus = {
    lastPost: 0,
    lastError: null,
    authenticated: false
};

const DEFAULT_OPTIONS = {
    bypassFormatter: false,
    useBestPractices: true,
    apiKey: 'ABCD321099'
};

const BEACON_STATES = [ 'not-initialized', 'initialized' ];

const self = module.exports = {

    get isInitialized(){
        return isBeaconInitialized;
    },

    get status(){
        return { happy: true }

    },

    initialize: function( options ){

        isBeaconInitialized = true;
    },

    transmit: function( beaconObject, bypassFormatting ){
        if (!self.isInitialized) {
            throw new Error('Cannot transmit on uninitialized beacon.');
        }
    },





}