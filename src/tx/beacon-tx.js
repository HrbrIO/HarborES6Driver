const request = require( 'superagent' );
const BEACON_ENDPOINT = '/v2/beacon';

let LOCAL_HARBOR_SERVICES_URL = 'http://localhost:1337' + BEACON_ENDPOINT;
let CLOUD_HARBOR_SERVICES_URL = 'http://cloud.hrbr.io' + BEACON_ENDPOINT;
let MAGIC_API_KEY = 'ABCD321099'; // Magic key for testing with local Sails mockup

module.exports = class BeaconTX {

    /**
     *
     * @param {Object} options - Options for the transmitter
     * @param {Boolean} options.useLocalServer - Transmit to a local mockup server
     */
    constructor( options ) {
        this.beaconPostUrl = options && options.useLocalServer ? LOCAL_HARBOR_SERVICES_URL : CLOUD_HARBOR_SERVICES_URL;
        this.isUsingLocal = !!(options && options.useLocalServer);
        this.apiKey = (options && options.apiKey) || MAGIC_API_KEY;
    }

    post( message ) {

        return request
            .post( this.beaconPostUrl )
            .send( message )
            .set( 'apikey', this.apiKey )
            .set( 'Accept', 'application/json' );

    }

    static get localHarborServicesUrl() {
        return LOCAL_HARBOR_SERVICES_URL;
    }

    static get cloudHarborServicesUrl() {
        return CLOUD_HARBOR_SERVICES_URL;
    }


}