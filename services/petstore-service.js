'use strict';

const seneca = require('seneca')({tag: 'petstore-service'});

seneca.use('entity');

seneca.use('mesh', {
    isbase: true,
    pin: 'api:v1,service:petstore'
});


seneca.add('api:v1,service:petstore,action:findById', (msg, reply) => {

    seneca.make( 'pets' ).load$( msg.id, ( err, data ) => {

        if ( err ){
            return reply( err );
        }

        if ( null === data ){
            reply({
                code: 404,
                body: {
                    code: 30002,
                    message : 'Not found'
                }
            })
        }

        delete data['entity$'];

        reply( null, data );
    } );

});


seneca.add('api:v1,service:petstore,action:list', (msg, reply) => {

    seneca.make( 'pets' ).list$(  ( err, data ) => {

        if ( err ){
            return reply( err );
        }

        for ( const p of data ){

            delete p['entity$']

        }

        reply( null, data );

    } );

});


seneca.add('api:v1,service:petstore,action:add', (msg, reply) => {

    const entity = seneca.make( 'pets' );

    entity.data$( msg.pet );

    entity.save$((err, result) => {

        delete result['entity$'];

        reply(err, result);

    });

});


seneca.add('api:v1,service:petstore,action:deleteById', (msg, reply) => {

    seneca.make( 'pets' ).load$( msg.id, ( err, data ) => {

        if ( err ){
            return reply( err );
        }

        if ( null === data ){
            return reply({
                code: 404,
                body: {
                    code: 30002,
                    message : 'Not found'
                }
            })
        }

        seneca.make( 'pets' ).remove$( msg.id, ( err ) => {

            //TODO: figure out how to know when an object wasn't found.

            if ( err ){
                return reply( err );
            }

            reply( { code : 204 } );

        } );

    } );

});