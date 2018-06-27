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

const Buffer = require('../buffer/buffer');
const Formatter = require('../formatter/formatter');
const Tx = require('../tx/beacon-tx');


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


let buffer;
let formatter;
let tx;
let txLoopRunning = false;
let isBeaconInitialized = false;
let interMessageDelayMs = 500;
let verbose = true;
let txOn = true; // disables transmit, used mostly for testing

function log(msg) {
    if (verbose) console.log(msg);
}

function postNextToHarbor() {

    if (!txOn) return;

    const nextUp = buffer.top;
    txLoopRunning = true;
    tx.post(nextUp)
        .then(resp => {
            log('Beacon message sent successfully');
            buffer.pull();
            if (buffer.entries) {
                setTimeout(postNextToHarbor, interMessageDelayMs);
            } else {
                txLoopRunning = false; // end the loop, nothing to do
            }
        })
        .catch(err => {
            log('Beacon message failed...retrying');
            // TODO: retry counting
            setTimeout(postNextToHarbor, interMessageDelayMs);
        });


}

const self = module.exports = {

    get isInitialized() {
        return isBeaconInitialized;
    },

    set txOn(shouldTransmit) {
        txOn = shouldTransmit;
    },

    get pendingTxCount() {
        return buffer.entries;
    },

    /**
     *
     * @param options
     */
    initialize: function (options) {
        // TODO: add in authentication stuff
        buffer = new Buffer(options && options.bufferOptions);
        formatter = new Formatter(options && options.formatterOptions);
        tx = new Tx(options && options.txOptions);

        isBeaconInitialized = true;


    },

    transmit: function (beaconObject, bypassFormatting) {

        if (!self.isInitialized) {
            throw new Error('Cannot transmit on uninitialized beacon.');
        }

        let formattedBeaconObject = formatter.format(beaconObject, bypassFormatting);
        buffer.push(formattedBeaconObject);
        // if nothing is being transmitted, kick tx off
        if (!txLoopRunning) postNextToHarbor();

    },


}