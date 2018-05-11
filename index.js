'use strict';

const fs   = require('fs'),
    path   = require('path'),
    http   = require('http'),
    app    = require('connect')(),
    jsyaml = require('js-yaml'),
    swaggerTools = require('swagger-tools'),
    swaggerSenecaRouter = require('swagger-seneca-router');

const serverPort = 8888;

const spec = fs.readFileSync(path.join(__dirname, '/spec/petstore-simple.yaml'), 'utf8');
const swaggerDoc = jsyaml.safeLoad(spec);


// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {

    require('seneca')()
        .use('entity')
        .use('mesh')
        .ready( function() {

            //TODO add Auth support and harden App.

            app.use(middleware.swaggerMetadata());
            app.use(middleware.swaggerValidator());
            app.use(middleware.swaggerUi());

            app.use( swaggerSenecaRouter( {
                senecaClient              : this,
                patternNotFoundMode       : 'error',
                matchXSenecaPatternsOnly  : true,
                defaultErrorCode          : 500,
                senecaErrorMode : {
                    'default'           : 'error',
                    'act_not_found'     : 'next',
                    'no-current-target' : 'jsonic:{body:{errCode:3322,errMessage:"Oops, our servers appear to be down!"}}'
                }

            } ) );

            app.use( function (req, res, next) {
                res.writeHead(404, {});
                res.end( 'Not found');
            });

            // Start the server
            http.createServer(app).listen(serverPort, function () {
                console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
                console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
            });
        });

});