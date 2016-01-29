'use strict';

module.exports = {
    env: 'development',
    ip: '0.0.0.0',
    port: 1989,
    firebase: {
        url: 'https://matrixled.firebaseio.com/',
        secret: '2XFZUirWPGqLVuuCQTngHpVVFZXNa6N8UOlA3eJZ',
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
