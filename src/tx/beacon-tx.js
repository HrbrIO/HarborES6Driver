const request = require('superagent');
const BEACON_ENDPOINT = '/v2/beacon';

let LOCAL_HARBOR_SERVICES_URL = 'http://localhost:2010' + BEACON_ENDPOINT;
let CLOUD_HARBOR_SERVICES_URL = 'http://cloud.hrbr.io' + BEACON_ENDPOINT;
let MAGIC_API_KEY = 'ABCD321099'; // Magic key for testing with local Sails mockup

module.exports = class BeaconTX {

    /**
     *
     * @param {Object} options - Options for the transmitter
     * @param {Boolean} options.useLocalServer - Transmit to a local mockup server
     * @param {String} options.apiKey - API key for this client. If not specified, the test API key is used
     * @param {String} [ options.beaconVersionId ] - Version of this particular beacon
     * @param {String} [ options.appVersionId ] - Concatenated app bundle Id and version Id.
     * @param {String} [ options.beaconInstanceId ] - Normally a UDID for the device/VM.
     */
    constructor(options) {
        this.beaconPostUrl = options && options.useLocalServer ? LOCAL_HARBOR_SERVICES_URL : CLOUD_HARBOR_SERVICES_URL;
        this.isUsingLocal = !!(options && options.useLocalServer);
        this.apiKey = (options && options.apiKey) || MAGIC_API_KEY;
        this.beaconVersionId = options && options.beaconVersionId;
        this.appVersionId = options && options.appVersionId;
        this.beaconInstanceId = options && options.beaconInstanceId;
    }

    /**
     *
     * @param { Object } message - object to post to Harbor Services
     * @param {Object}  [ message.data ] - the payload for this beacon message
     * @param {Number} [ message.dataTimestamp ] - the timestamp for when the data was captured
     * @returns { Promise }
     */
    post(message) {

        // set guaranteed fields....
        let req = request.post(this.beaconPostUrl)
            .send(message.data)
            .set('apikey', this.apiKey)
            .set('Accept', 'application/json');

        // You can't set a header field to null, so we need to do this for every optional field.
        if (message.beaconMessageType)
            req = req.set('beaconMessageType', message.beaconMessageType);

        if (message.dataTimestamp)
            req = req.set('dataTimestamp', message.dataTimestamp);

        if (this.beaconVersionId)
            req = req.set('beaconVersionId', this.beaconVersionId);

        if (this.appVersionId)
            req = req.set('appVersionId', this.appVersionId);

        if (this.beaconInstanceId)
            req = req.set('beaconInstanceId', this.beaconInstanceId);

        return req;

    }

    /**
     *
     * @returns {string}
     */
    static get localHarborServicesUrl() {
        return LOCAL_HARBOR_SERVICES_URL;
    }

    /**
     *
     * @returns {string}
     */
    static get cloudHarborServicesUrl() {
        return CLOUD_HARBOR_SERVICES_URL;
    }


}