"use strict";
/**
 * Simple server managing between client and database
 * @author: Jirka Dell'Oro-Friedl
 */
Object.defineProperty(exports, "__esModule", { value: true });
var Http = require("http");
var Url = require("url");
var Database = require("./Database");
console.log("Server starting");
var port = parseInt(process.env.PORT);
if (isNaN(port))
    port = 8100;
var server = Http.createServer();
server.addListener("listening", handleListen);
server.addListener("request", handleRequest);
server.listen(port);
function handleListen() {
    console.log("Listening on port: " + port);
}
function handleRequest(_request, _response) {
    console.log("Request received");
    var query = Url.parse(_request.url, true).query;
    //var command: string = query["command"];
    var output;
    var username = query["u"];
    var password = query["p"];
    var address = query["a"];
    var database = query["n"];
    var collection = query["c"];
    var missingParameters = false;
    output = "<head><style>table,th,td {border: 1px solid lightblue; border-collapse:collapse;padding:0px 10px}</style></head>";
    output += "<body><h1>mongoDBrowser</h1>";
    output += "<h3>Query parameters</h3><table><tr>";
    output += "<th>key</th><th>current value</th><th>description</th><th>remark</th></tr><tr>";
    output += "<td>u=</td><td>" + username + "</td><td>username</td><td>(may be omitted for local database)</td></tr><tr>";
    output += "<td>p=</td>" + ifMissing(username && !password, password) + "<td>password</td><td>(required when username given)</td></tr><tr>";
    output += "<td>a=</td>" + ifMissing(!address, address) + "<td>database address</td><td>(required, everything right of '@')</td></tr><tr>";
    output += "<td>n=</td>" + ifMissing(!database, database) + "<td>database name</td><td>(required)</td></tr><tr>";
    output += "<td>c=</td>" + ifMissing(!collection, collection) + "<td>collection</td><td>(required)</td></tr>";
    output += "</table>";
    output += "<p>Example: <a href='https://mongodbnetbrowser.herokuapp.com/?u=user&p=123456user&a=eia2-57vpd.mongodb.net&n=eia2&c=students'>Click here</a></p>";
    if (missingParameters) {
        respond(_response, "");
        return;
    }
    else {
        output += "<h3>Result</h3>";
        Database.connect(username, password, address, database, collection, processDatabaseResult);
    }
    function ifMissing(_missing, _notMissing) {
        missingParameters = missingParameters || _missing;
        return "<td>" + ((_missing) ? "<strong>missing</strong>" : _notMissing) + "</td>";
    }
    function processDatabaseResult(_result) {
        console.log(_result);
        respond(_response, _result);
    }
    function respond(_response, _text) {
        //console.log("Preparing response: " + _text);
        _response.setHeader("Access-Control-Allow-Origin", "*");
        _response.setHeader("content-type", "text/html; charset=utf-8");
        _response.write(output + _text + "</body>");
        _response.end();
    }
}
//# sourceMappingURL=Server.js.map