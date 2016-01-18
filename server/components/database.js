"use strict";

const config = require('./../config/index'),
    Firebase = require('firebase'),
    FirebaseTokenGenerator = require('firebase-token-generator');

class Database {
    constructor() {
        this.ref = new Firebase(config.firebase.url);

        this.refSize = this.ref.child('size');
        this.refPixels = this.ref.child('pixels');

        this.tokenGenerator = new FirebaseTokenGenerator(config.firebase.secret);
    }

    init(callback) {
        this.token = this.tokenGenerator.createToken({
            uid: config.firebase.uid
        });
        this.ref.authWithCustomToken(this.token, callback)
    }

    setSize(object) {
        this.refSize.set(object, function (err) {
            if (err)
                console.error(err)
        })
    }

    setPixel(pixel) {
        this.refPixels.child(pixel.id).set(pixel.toJSON(), function (err) {
            if (err)
                console.error(err)
        })
    }
}

var singleton = new Database();
module.exports = singleton;
