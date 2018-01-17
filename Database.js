"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Simple database insertion and query for MongoDB
 * @author: Jirka Dell'Oro-Friedl
 */
var Mongo = require("mongodb");
console.log("Database starting");
var dbURL; // = "mongodb://localhost:27017";
var dbName; // = "Test";
var db;
var dbCollection;
//if (process.env.NODE_ENV == "production") {
//    databaseURL = "mongodb://username:password@hostname:port/database";
dbURL = "mongodb://testuser:testpassword@ds129532.mlab.com:29532/eia2";
dbName = "eia2";
//}
function connect(_user, _password, _address, _database, _collection, _callback) {
    dbName = _database;
    if (_user)
        dbURL = "mongodb://" + _user + ":" + _password + "@" + _address;
    else
        dbURL = "mongodb://" + _address;
    console.log(dbURL);
    Mongo.MongoClient.connect(dbURL, { connectTimeoutMS: 8000 }, handleConnect);
    function handleConnect(_e, _mc) {
        if (_e) {
            var output = "Unable to connect to database, error: " + _e;
            console.log(output);
            _callback(output);
        }
        else {
            console.log("Connected to database!");
            db = _mc.db(dbName);
            dbCollection = db.collection(_collection);
            findAll(_callback);
        }
    }
}
exports.connect = connect;
function findAll(_callback) {
    var cursor = dbCollection.find();
    cursor.toArray(prepareAnswer);
    function prepareAnswer(_e, result) {
        if (_e)
            _callback("Error" + _e);
        else
            _callback(JSON.stringify(result));
    }
}
exports.findAll = findAll;
//# sourceMappingURL=Database.js.map