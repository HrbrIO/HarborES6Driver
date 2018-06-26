const expect = require( "chai" ).expect;
const BeaconTx = require( '../../../src/tx/beacon-tx' );
const magicApiKey = require( '../../environment' ).magicApiKey;
const testApiKey = 'BeerAndChickenWings';


describe( 'Beacon-TX Unit Tests', function () {

    describe( 'Endpoints', function () {

        it( 'should return a local URL string', function ( done ) {
            const btx = new BeaconTx( { useLocalServer: true } );
            expect( btx.beaconPostUrl ).to.equal( 'http://localhost:1337/v2/beacon' );
            expect( btx.isUsingLocal ).to.equal( true );
            done();
        } );

        it( 'should return a cloud URL string', function ( done ) {
            const btx = new BeaconTx();
            expect( btx.beaconPostUrl ).to.equal( 'http://cloud.hrbr.io/v2/beacon' );
            expect( btx.isUsingLocal ).to.equal( false );
            done();
        } );


    } );

    describe( 'API Key', function () {

        it( 'should return the magic api key when no key is passed', function ( done ) {
            const btx = new BeaconTx();
            expect( btx.apiKey ).to.equal( magicApiKey );
            done();
        } );

        it( 'should return the api key when a specific key is passed', function ( done ) {
            const btx = new BeaconTx( { apiKey: testApiKey } );
            expect( btx.apiKey ).to.equal( testApiKey );
            done();
        } );

    } );

    describe( 'HTTP TX to Local Server', function () {

        it( 'should return a 200 if the local server is running', function ( done ) {
            const btx = new BeaconTx( { useLocalServer: true } );
            btx.post( { cpuUtil: 0.98 } )
                .then( response => {
                    expect( response ).to.be.an( 'object' );
                    done();
                } )
                .catch( err => {
                    console.error( "Can't post, check to make sure REST endpoint is up" );
                } );
        } );

    } );

    describe( 'Static debug methods/getters/etc.', function () {

        it( 'should return the local Harbor services URL', function ( done ) {
            expect( BeaconTx.localHarborServicesUrl ).to.equal( 'http://localhost:1337/v2/beacon' );
            expect( BeaconTx.cloudHarborServicesUrl ).to.equal( 'http://cloud.hrbr.io/v2/beacon' );
            done();
        } );

    } );

} );