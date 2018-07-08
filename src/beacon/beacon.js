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
const assignIn = require('lodash').assignIn;

let buffer;
let formatter;
let tx;
let txLoopRunning = false;
let isBeaconInitialized = false;
let interMessageDelayMs;
let maxRetries = 3;
let currentRetryCount;
let isRetry = false;
let verbose = true;
let txOn = true; // disables transmit, used mostly for testing
let drainedCallback;
let allowNullMessageType = false;

function log(msg) {
    if (verbose) console.log(new Date() + ':' + msg);
}

function postNextToHarbor() {

    if (!txOn) return;

    const nextUp = buffer.top;
    txLoopRunning = true;
    tx.post(nextUp)
        .then(resp => {
            log('Beacon message sent successfully');
            buffer.pull();
            // reset the retries
            isRetry = false;
            currentRetryCount = maxRetries;
            if (buffer.entries) {
                setTimeout(postNextToHarbor, interMessageDelayMs);
            } else {
                txLoopRunning = false; // end the loop, nothing to do
                if (drainedCallback) drainedCallback(); // call the drained callback, if one.
            }
        })
        .catch(err => {
            log('Beacon message failed...Status: ' + err.status);

            if (!err.status && err.code === 'ECONNREFUSED') err.status = 999; // flag for server down

            switch (err.status) {

                // TODO: This is gross :D
                case 403:
                    log('Forbidden error, check API Key');
                    break;

                case 999: //server down
                    log('Harbor server refused connection, may be down');
                default:
                    // TODO: retry counting
                    log('Unhandled error, retyring');
                    isRetry = true;
                    if (currentRetryCount--) {
                        setTimeout(postNextToHarbor, interMessageDelayMs);
                    } else {
                        log('Retry limit exceeded, but this is needs work so retry anyway');
                        setTimeout(postNextToHarbor, interMessageDelayMs);
                    }
            }

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
     * @param {Object} options
     * @param {String} options.apiKey  your api key. Required.
     * @param {Boolean} [options.allowNullMessageType=false ] allow null message type (bypass error)
     * @param {String} [options.beaconVersionId=null]  overrides the built in beaconVersionId.
     * @param {String} [options.appVersionId=null]  concatenated appId plus version. Example: io.hrbr.superapp:1.2.1
     * @param {String} [options.beaconInstanceId=null] unique Id for this instance, usually tied to the H/W or VM, etc.
     * @param {Object} [options.bufferOptions=null] allows direct setting of the Buffer block's options. See Buffer class.
     * @param {Object} [options.txOptions=null] allows direct setting of the Transmitter block's options. See Beacon-TX class.
     * @param {Number} [options.interMessageDelayMs=5]  ms between messages. Defaults to 5ms.
     * @param {Function} [options.drainedCb=null]  callback for when the message queue is drained. Useful for testing.
     * @param {Object} [options.formatter=null]  allows direct setting of the Formatter block's options. See Beacon-TX class.
     *
     */
    initialize: function (options) {
        // TODO: add in authentication?

        // Error out if no API Key
        if (!options.apiKey) throw new Error("Missing apiKey");

        buffer = new Buffer(options && options.bufferOptions);
        formatter = new Formatter(options && options.formatterOptions);

        let txOptions = ( options && options.txOptions ) || {};
        txOptions = assignIn(txOptions, {
            apiKey: options.apiKey,
            appVersionId: options.appVersionId,
            beaconInstanceId: options.beaconInstanceId,
            beaconVersionId: options.beaconVersionId
        });
        tx = new Tx(txOptions);

        interMessageDelayMs = ( options && options.interMessageDelayMs ) || 5;
        drainedCallback = options.drainedCb;
        isBeaconInitialized = true;
    },

    /**
     * @param {Object} [beaconObject=null] Beacon object
     * @param {String} [beaconObject.beaconMessageType=null]  beacon message type
     * @param { Object } [beaconObject.data = null ]  beacon data
     */
    transmit: function (beaconObject) {

        if (!self.isInitialized) {
            throw new Error('Cannot transmit on uninitialized beacon.');
        }

        const msgType = beaconObject && beaconObject.beaconMessageType;
        const data = beaconObject && beaconObject.data;

        let formattedBeaconObject = formatter.format(msgType, data);
        buffer.push(formattedBeaconObject);
        // if nothing is being transmitted, kick tx off
        if (!txLoopRunning) postNextToHarbor();

    },

    set beaconPostUrl(overridenUrl) {
        tx.beaconPostUrl = overridenUrl;
    },

    get beaconPostUrl() {
        return tx.beaconPostUrl;
    }


}