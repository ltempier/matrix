"use strict";

const config = require('./../config/index'),
    mqtt = require('mqtt');

class Mqtt {
    constructor() {
        this.isConnect = false;
    }

    init(callback) {
        this.client = mqtt.connect(config.mqtt);
        this.client.on('connect', ()  => {

            this.client.subscribe('/log');
            this.client.subscribe('callback/setPixel');
            this.client.subscribe('callback/setMatrix');

            if (!this.isConnect) {
                this.isConnect = true;
                callback()
            }
        });

        this.client.on('message', (topic, message) => {
            switch (topic) {
                case '/log':
                    this.onLog(message);
                    break;
                case 'callback/setPixel':
                    this.onSetPixelCallback(message);
                    break;
                case 'callback/setMatrix':
                    this.onSetMatrixCallback(message);
                    break;
            }
        });
    }

    sendMessage(topic, message, callback) {
        if (!callback || typeof callback !== 'function')
            callback = function (err) {
                if (err)
                    console.error(err);
            };

        if (!this.client)
            return callback(new Error('No mqtt client'));

        this.client.publish(topic, message, callback);
    }

    onLog(message) {
        console.log("log : " + message);
    }

    onSetPixelCallback(message) {
        var pixel = require('./matrix').parseMqttSetPixelMessage(message);
        require('./database').setPixel(pixel)
    }

    onSetMatrixCallback(message) {
        console.log("callback : " + message);
    }
}

var singleton = new Mqtt();
module.exports = singleton;
