/**
 * Created by mkahn on 10/14/17.
 */

const path = require( 'path' );
const webpack = require( 'webpack' );
const UglifyJSPlugin = require( 'uglifyjs-webpack-plugin' );


module.exports = {
    entry:     { app: [ './src/beaconEs6Proto.module.js'] },
    output:    {
        path:     path.resolve( __dirname, 'lib/' ),
        filename: 'beaconEs6Proto.all.js'
    },
    devtool:   'inline-source-map',
    module:    {
        rules: [
            // Javascript goes thru babel
            {
                test:    /\.js$/,
                loader:  "babel-loader",
                query:   {
                    presets: [ "babel-preset-es2015" ].map( require.resolve )
                },
                exclude: /node_modules/
            },
            // Not used, but here in case
            {
                test: /\.txt$/,
                use:  'raw-loader'
            },
            {
                test:   /\.(json|JSON)?$/,
                loader: 'file-loader'
            }
        ]

    },
    plugins:   [
        new UglifyJSPlugin( {
            sourceMap:     false,
            uglifyOptions: { mangle: false }
        } )
    ],
    // resolve: {
    //     alias: {
    //         //'@bab': path.resolve( __dirname, 'src/modules/babylon'),
    //         //'@test': path.resolve( __dirname, 'src/modules/testing' ),
    //         //'@barn': path.resolve( __dirname, 'src/modules/barn' ),
    //         //'@toyroom': path.resolve(__dirname, 'src/modules/toyroom'),
    //     }
    // }
}
