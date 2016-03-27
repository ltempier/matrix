'use strict';

module.exports = {
    env: 'development',
    ip: '0.0.0.0',
    port: 1989,
    firebase: {
        url: 'https://matrixled.firebaseio.com/',
        uid: 'server'
    },
    mqtt: {
        port: 1883,
        hostname: 'mosquitto',
        protocol: 'mqtt',
        protocolId: 'MQIsdp',
        protocolVersion: 3
    }
};
