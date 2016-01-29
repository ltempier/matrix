'use strict';

module.exports = {
    env: 'production',
    ip: process.env.IP || '0.0.0.0',
    port: process.env.PORT,
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
    //mqtt: {
    //    url: 'mqtt://toor:2HLV3g2jNiB252o@m20.cloudmqtt.com:19793',
    //    port: 19793,
    //    hostname: 'm20.cloudmqtt.com',
    //    username: 'toor',
    //    password: '2HLV3g2jNiB252o',
    //    protocol: 'mqtt'
    //}
};
