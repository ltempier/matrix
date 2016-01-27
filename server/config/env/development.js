'use strict';

module.exports = {
    env: 'development',
    ip: '0.0.0.0',
    port: 1989,
    mongo: {
        url: 'mongodb://toor:2HLV3g2jNiB252o@ds045475.mongolab.com:45475/matrix'
    },
    firebase: {
        url: 'https://matrixdev.firebaseio.com/',
        secret: 'gIyaDWGE9aj8VeNJRfWrgcDwI0FJjcMmxaEh8ZIk',
        uid: 'server'
    },
    mqtt: {
        port: 1883,
        hostname: '195.154.118.152',
        //username: 'toor',
        //password: '2HLV3g2jNiB252o',
        protocol: 'mqtt',
        protocolId: 'MQIsdp',
        protocolVersion: 3
    }
};
