"use strict";

const config = require('./../config/index'),
    Firebase = require('firebase'),
    FirebaseTokenGenerator = require('firebase-token-generator');

class Database {
    constructor() {
        this.ref = new Firebase(config.firebase.url);

        this.refSize = this.ref.child('size');
        this.refPixels = this.ref.child('pixels');

    }

    init(callback) {
        if (config.firebase.secret) {
            this.tokenGenerator = new FirebaseTokenGenerator(config.firebase.secret);
            this.token = this.tokenGenerator.createToken({
                uid: config.firebase.uid
            });
            this.ref.authWithCustomToken(this.token, function (err) {
                if (err)
                    return callback(err);
                console.log('Firebase init');
                callback()
            })
        } else
            return callback();

    }

    setSize(size) {
        this.refSize.set(size, function (err) {
            if (err)
                console.error(err)
        })
    }

    setPixel(pixel) {
        if (pixel.id.indexOf("NaN") < 0)
            this.refPixels.child(pixel.id).set(pixel.toJSON(), function (err) {
                if (err)
                    console.error(err)
            })
    }

    setMatrix(matrix) {
        matrix.forEach((pixel) => {
            this.setPixel(pixel)
        })
    }
}

var singleton = new Database();
module.exports = singleton;
