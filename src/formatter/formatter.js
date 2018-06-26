/*********************************

 File:       formatter.js
 Function:   Add additional fields to every beacon message, if so configured
 Copyright:  hrbr.io
 Date:       6/25/18 8:54 PM
 Author:     mkahn

Adds "stock" ( and/or best practices) fields to a JSON beacon message before it moves on to the Cache and TX blocks

 **********************************/

const isObject = require('lodash').isObject;
const assignIn = require('lodash').assignIn;

module.exports = class Formatter {

    /**
     *
     * @param {Object} options - Options for the formatter
     * @param {Boolean} options.disableAllFormatting - Don't attach any supplemental fields
     * @param {Boolean} options.disableBestPractices - Don't attach best practice fields
     * @param {Object} options.commonFields - Fields that should be attached at the root of every beacon message
     */
    constructor( options ) {
        this.disableAllFormatting = !!( options && options.disableAllFormatting );
        this.disableBestPractices = !!( options && options.disableBestPractices );
        // check for common fields and check that they are actually an object
        const cf = options && options.commonFields;
        if (cf && isObject(cf)){
            this.commonFields = options && options.commonFields;
        } else if ( cf && !isObject(cf)){
            throw 'commonFields parameter must be an object';
        }
    }

    /**
     *
     * @param { Object } message - object to Format
     * @param {Boolean} skipFormatting - override formatting for this message *only*
     * @returns { Object }
     */
    format( message, skipFormatting ) {

        if (skipFormatting || this.disableAllFormatting ) return message;

        message = this.disableBestPractices ? message: assignIn(message, Formatter.bestPracticeFields);
        // if the user doesn't want common fields, don't pass any. There is no need for explicit disable.
        message = assignIn(message, this.commonFields);
        return message;

    }

    /**
     *
     * @returns {Object}
     */
    static get bestPracticeFields() {
        return { recordedAt: Date.now() };
    }




}