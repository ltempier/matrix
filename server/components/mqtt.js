"use strict";

const config = require('./../config/index'),
    mqtt = require('mqtt'),
    database = require('./database');

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

        this.client.on('message', (topic, message, packet) => {
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
        console.log("SetPixel : " + message);
    }

    onSetMatrixCallback(message) {
        console.log("SetMatrix : " + message);
    }
}

var singleton = new Mqtt();
module.exports = singleton;
