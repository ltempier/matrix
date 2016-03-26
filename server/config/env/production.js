'use strict';

module.exports = {
    env: 'production',
    ip: process.env.IP || '0.0.0.0',
    port: process.env.PORT,
    firebase: {
        url: 'https://matrixled.firebaseio.com/',
        uid: 'server'
    },
    mqtt: {
        port: 1883,
        hostname: '195.154.118.152',
        protocol: 'mqtt',
        protocolId: 'MQIsdp',
        protocolVersion: 3
    }
};
