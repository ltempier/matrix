"use strict";

const config = require('./../config/index'),
    mqtt = require('mqtt');

class Mqtt {
    constructor() {
        this.log = true;
        this.isConnect = false;
        this.topics = ['/log', '/setup', 'callback/setPixel', 'callback/setMatrix', 'callback/setSize']
    }

    init(callback) {
        this.client = mqtt.connect(config.mqtt);
        this.client.on('connect', ()  => {

            this.topics.forEach((topic) => {
                this.client.subscribe(topic);
            });

            if (!this.isConnect) {
                this.isConnect = true;

                console.log('MQTT init');
                callback()
            }
        });

        this.client.on('message', (topic, message) => {

            if (this.log)
                console.log("MQTT <- " + topic + " " + message);

            switch (topic) {
                case '/log':
                    //this.onLog(message);
                    break;
                case '/setup':
                    require('./matrix').onSetupCallback();
                    break;
                case 'callback/setPixel':
                    require('./matrix').onSetPixelCallback(message);
                    break;
                case 'callback/setMatrix':
                    require('./matrix').onSetMatrixCallback(message);
                    break;
                case 'callback/setSize':
                    require('./matrix').onSetSizeCallback(message);
                    break;
            }
        });

        this.client.on('error', (err) => {
            console.error(err)
        })
    }

    sendMessage(topic, message, callback) {
        if (!callback || typeof callback !== 'function')
            callback = function (err) {
                if (err)
                    console.error(err);
            };

        if (!this.client)
            return callback(new Error('No mqtt client'));

        if (this.log)
            console.log("MQTT -> " + topic + " " + message);

        this.client.publish(topic, message, callback);
    }

    onLog(message) {
        console.log("log : " + message.toString());
    }
}

var singleton = new Mqtt();
module.exports = singleton;
