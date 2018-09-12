/*********************************

 File:       beaconflood.js
 Function:   Light performance testing
 Copyright:  hrbr.io
 Date:       6/27/18 1:20 PM
 Author:     mkahn

 Floods harbor-services as fast as it can go.

 **********************************/

 /*

 wss://harbor-services-staging.herokuapp.com/socket/194368bc-e2e7-1004-8690-f47503f49f41:PRIMARY:PROD_io.hrbr.beaconflood:0.3.0:BEACON_FLOOD_MSG
  */

const request = require('superagent');
const util = require('util');
const _ = require('lodash');
const Beacon = require('../../index');
const colors = require('colors');
const args = require('minimist')(process.argv.slice(2));

const loopDelay = args.l || 5000;
const apiKey = args.k || 'ABCD4949';
const beaconInstanceId = args.i || 'some-system-in-calif';
const appVersionId = args.a || 'io.hrbr.beaconflood:0.3.0';
const loopCount = args.c || 10;
const useRemoteServer = !!(args.r);

let startTime;

function drained() {
    const endTime = new Date().getTime();
    const deltaTsecs = (endTime - startTime) / 1000;
    console.log('TX time for 1000 messages: ' + deltaTsecs +'sec ( '+ 1000/deltaTsecs + ' msec per msg)');
}

function sendBeacons() {
    startTime = new Date().getTime();
    _.times(loopCount, (seqNum) => {
        Beacon.transmit({
            beaconMessageType: 'BEACON_FLOOD_MSG',
            data: {source: 'beaconflood.js', random: Math.random(), seqNum: seqNum}
        });
    });
}

if (!args.h){

    Beacon.initialize({
        apiKey: apiKey,
        appVersionId: appVersionId,
        beaconVersionId: appVersionId, //'beacon-es6-proto:0.3.0',
        beaconInstanceId: beaconInstanceId,
        txOptions: {
            useLocalServer: !useRemoteServer
        },
        bufferOptions: {
            lengthLimit: 100000
        },
        interMessageDelayMs: loopDelay,
        drainedCb: drained
    });

    if (args.r){
        console.log('Flooding remote server'.green);
        request
            .get('https://harbor-services-staging.herokuapp.com/ping')
            .set('apikey', apiKey)
            .then((resp)=>{
                console.log(resp.text);
                console.log('Remote server wakeup issued. Waiting 5 seconds.'.green);
                return new Promise(resolve => setTimeout(resolve, 5000))
            })
            .then(sendBeacons)
            .catch((err)=>{
                console.log('Error waking up hieroku server!'.red);
                console.log(util.inspect(err).red);
            });
    } else {
        console.log('Flooding local server'.green);
        sendBeacons();
    }

} else {
    console.log("-l".green+" loop delay in ms (default 5000ms)");
    console.log("-k".green + " API key (default ABCD4949)");
    console.log("-i".green + " beacon instance ID (default 'some-system-in-calif'");
    console.log("-a".green + " lapp version ID (default 'io.hrbr.beaconflood:0.2.0')");
    console.log("-c".green + " loop count (default: 10)");
    console.log("-r".green + " use remote server (default: false/use local)");


}







