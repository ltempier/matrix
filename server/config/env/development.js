'use strict';

module.exports = {
    env: 'development',
    ip: '0.0.0.0',
    port: 1989,
    mongo: {
        url: 'mongodb://toor:2HLV3g2jNiB252o@ds045475.mongolab.com:45475/matrix'
    },
    firebase: {
        url: 'https://matrixled.firebaseio.com/',
        secret: '2XFZUirWPGqLVuuCQTngHpVVFZXNa6N8UOlA3eJZ',
        uid: 'server'
    },
    mqtt: {
        url: 'mqtt://toor:2HLV3g2jNiB252o@m20.cloudmqtt.com:19793',
        port: 19793,
        hostname: 'm20.cloudmqtt.com',
        username: 'toor',
        password: '2HLV3g2jNiB252o',
        protocol: 'mqtt'
    }
};
