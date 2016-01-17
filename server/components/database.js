"use strict";

const config = require('./../config/index'),
    Firebase = require('firebase'),
    FirebaseTokenGenerator = require('firebase-token-generator');

class Database {
    constructor() {
        this.ref = new Firebase(config.firebase.url);
        this.tokenGenerator = new FirebaseTokenGenerator(config.firebase.secret);
    }

    init(callback) {
        this.token = this.tokenGenerator.createToken({
            uid: config.firebase.uid
        });
        this.ref.authWithCustomToken(this.token, callback)
    }

    set(object) {
        this.ref.set(object, function (err) {
            if (err)
                console.error(err)
        })
    }
}

var singleton = new Database();
module.exports = singleton;
