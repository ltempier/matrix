"use strict";

const config = require('./../config/index'),
    mqtt = require('mqtt');

class Mqtt {
    constructor() {
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
                callback()
            }
        });

        this.client.on('message', (topic, message) => {
            switch (topic) {
                case '/log':
                    this.onLog(message);
                    break;
                case '/setup':
                    this.onSetup();
                    break;
                case 'callback/setPixel':
                    this.onSetPixelCallback(message);
                    break;
                case 'callback/setMatrix':
                    this.onSetMatrixCallback(message);
                    break;
                case 'callback/setSize':
                    this.onSetSizeCallback(message);
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
        console.log("log : " + message.toString());
    }

    onSetup() {
        require('./matrix').setup()
    }

    onSetPixelCallback(message) {
        var pixel = require('./matrix').parseMqttSetPixelMessage(message);
        require('./database').setPixel(pixel)
    }

    onSetMatrixCallback(message) {
        var matrix = require('./matrix').parseMqttSetMatrixMessage(message);
        require('./database').setMatrix(matrix)
    }

    onSetSizeCallback(message) {
        var size = require('./matrix').parseMqttSetSizeMessage(message);
        require('./database').setSize(size)
    }
}

var singleton = new Mqtt();
module.exports = singleton;
