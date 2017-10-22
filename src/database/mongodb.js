const MongoClient = require("mongodb").MongoClient,
    assert = require("assert"),
    url = "mongodb://localhost:27017/adiWeather",
    collectionName = "forecasts";

/**
 * Database connection
 *
 * @type {Db}
 */
var db = null;

/**
 * Establish mongodb connection
 *
 * @param cb
 */
function connect(cb) {
    MongoClient.connect(url, function (err, database) {
        if (err !== null) {
            return console.log("Unable to connect to server", err);
        }
        console.log("Connected successfully to server");

        db = database;

        if (cb) cb();
    });
}

/**
 * Get data from mongodb by parameters
 *
 * @param data
 * @param cb
 */
function get(data, cb) {
    if (!data) {
        throw new Error("No data defined");
    }
    if (!cb) {
        throw new Error("No callback defined");
    }
    if (!db) {
        throw new Error("No database connection has been established")
    }

    db.collection(collectionName).find(data).limit(1).toArray(function(err, docs) {
        if (err) {
            return cb(null, err)
        }

        return cb(docs);
    });
}

/**
 * Save data to mongodb
 *
 * @param data
 * @param cb
 */
function save(data, cb) {
    if (!data) {
        throw new Error("No data defined");
    }
    if (!cb) {
        throw new Error("No callback defined");
    }
    if (!db) {
        throw new Error("No database connection has been established")
    }

    db.collection(collectionName).insertOne(data, function(err, r) {
        if (err) {
            return cb(null, err)
        }

        return cb(r);
    });
}

/**
 * Close db connection if it has been established
 */
function close() {
    if (!db) {
        throw new Error("Database connection has not been established")
    }

    db.close();
}

module.exports = {
    db: db,
    get: get,
    save: save,
    connect: connect,
    close: close
};