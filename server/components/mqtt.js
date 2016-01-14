"use strict";

const config = require('./../config/index'),
    mqtt = require('mqtt');

class Mqtt {
    constructor() {

    }

    init(callback) {
        var client = mqtt.connect(config.mqtt);
        client.on('connect', ()  => {
            client.subscribe('/log', () => {
                client.on('message', this.onMessage);
            });
            this.client = client;
            callback()
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

    onMessage(topic, message, packet) {
        console.log("Received '" + message + "' on '" + topic + "'");
    }
}

var singleton = new Mqtt();
module.exports = singleton;
