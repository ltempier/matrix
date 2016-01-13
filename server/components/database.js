"use strict";

const config = require('./../config/index'),
    MongoClient = require('mongodb').MongoClient;

class Database {
    constructor() {
    }

    init(callback) {
        MongoClient.connect(config.mongo.url, (err, db) => {
            if (err)
                return callback(err);
            this.db = db;
            this.pixels = db.collection('pixels');
            callback()
        });
    }

    savePixel(callback) {

    }

    saveMatrix(callback) {

    }

    save() {

    }
}

var singleton = new Database();
module.exports = singleton;