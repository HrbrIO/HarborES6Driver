/*********************************

 File:       beacon.test.js
 Function:   Tests the main Beacon State Machine
 Copyright:  hrbr.io
 Date:       6/26/18 10:44 AM
 Author:     mkahn

 Enter detailed description

 **********************************/

const expect = require( "chai" ).expect;
const Beacon = require( '../../../src/beacon/beacon' );
const _ = require('lodash');


describe( 'Beacon Unit Tests', function () {

    describe( 'Initialize state checks', function () {

        Beacon.txOn = false; // for testing

        it( 'Fresh Beacon should be uninitialized.', function ( done ) {
            expect( Beacon.isInitialized ).to.equal(false);
            done();
        } );

        it( 'Un-initted Beacon should throw Error on transmit.', function ( done ) {
            expect( Beacon.transmit ).to.throw();
            done();
        } );

        it( 'Init of Beacon should change isInitialized.', function ( done ) {
            Beacon.initialize({ txOptions: { useLocalServer: true, apiKey: 'ABCD321099' } });
            expect( Beacon.isInitialized ).to.equal( true );
            done();
        } );

        it( 'Initted Beacon should NOT throw Error on transmit.', function ( done ) {
            expect( Beacon.transmit ).to.not.throw();
            // TODO: this should be in its own test, but there were sequencing issues...
            Beacon.beaconPostUrl = 'beer';
            expect(Beacon.beaconPostUrl).to.equal('beer');
            done();
        } );




    } );

    describe('Beacon transmit tests', function () {

        Beacon.txOn = true; // for testing

        it('Should send 10 beacons', function (done) {
            _.times(10, value => {
                Beacon.transmit({ message: value });
            });
            // TODO: Right now, pass/fail for this visual inspection of the Sails DB. Not great.
            done();
        });


    });


} );