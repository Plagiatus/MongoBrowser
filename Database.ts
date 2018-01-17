/**
 * Simple database insertion and query for MongoDB
 * @author: Jirka Dell'Oro-Friedl
 */
import * as Mongo from "mongodb";
console.log("Database starting");

let dbURL: string; // = "mongodb://localhost:27017";
let dbName: string; // = "Test";
let db: Mongo.Db;
let dbCollection: Mongo.Collection;

//if (process.env.NODE_ENV == "production") {
//    databaseURL = "mongodb://username:password@hostname:port/database";
dbURL = "mongodb://testuser:testpassword@ds129532.mlab.com:29532/eia2";
dbName = "eia2";
//}
export function connect(_user: string, _password: string, _address: string, _database: string, _collection: string, _callback: (out: string) => void): void {
    dbName = _database;
    if (_user)
        dbURL = "mongodb://" + _user + ":" + _password + "@" + _address;
    else
        dbURL = "mongodb://" + _address;
    console.log(dbURL);
    Mongo.MongoClient.connect(dbURL, { connectTimeoutMS: 8000 }, handleConnect);

    function handleConnect(_e: Mongo.MongoError, _mc: Mongo.MongoClient): void {
        if (_e) {
            let output: string = "Unable to connect to database, error: " + _e;
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

export function findAll(_callback: (out: string) => void): void {
    var cursor: Mongo.Cursor = dbCollection.find();
    cursor.toArray(prepareAnswer);

    function prepareAnswer(_e: Mongo.MongoError, result: Array<string>): void {
        if (_e)
            _callback("Error" + _e);
        else
            _callback(JSON.stringify(result));
    }
}
