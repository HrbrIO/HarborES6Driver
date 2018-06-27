/*********************************

 File:       beaconflood.js
 Function:   Light performance testing
 Copyright:  hrbr.io
 Date:       6/27/18 1:20 PM
 Author:     mkahn

 Floods harbor-services as fast as it can go.

 **********************************/

const _ = require('lodash');
const Beacon = require('../../src/beacon/beacon');

function drained() {
    const endTime = new Date().getTime();
    const deltaTsecs = (endTime - startTime) / 1000;
    console.log('TX time for 1000 messages: ' + deltaTsecs +'sec ( '+ 1000/deltaTsecs + ' msec per msg)');
}

// Set near-minimum message delay
Beacon.initialize({
    txOptions: {
        useLocalServer: true,
        apiKey: 'ABCD321099',
        interMessageDelayMs: 1
    },
    bufferOptions: {
        lengthLimit: 100000
    },
    drainedCb: drained
});

const startTime = new Date().getTime();
_.times(1000, (seqNum) => {
    Beacon.transmit({source: 'beaconflood.js', random: Math.random(), seqNum: seqNum });
});



