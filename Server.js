"use strict";
/**
 * Simple server managing between client and database
 * @author: Jirka Dell'Oro-Friedl
 */
Object.defineProperty(exports, "__esModule", { value: true });
var Http = require("http");
var Url = require("url");
console.log("Server starting");
var port = process.env.PORT;
if (port == undefined)
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
    if (!query["u"] || !query["p"] || !query["d"] || !query["n"]) {
        output = "<strong>Query parameters u [username], p [password], d [database address] and n [database name] are required<br>";
        output += "c [collection] is optional<strong>";
        respond(_response, output);
        return;
    }
    /*
        switch (command) {
            case "insert":
                let student: StudentData = {
                    name: query["name"],
                    firstname: query["firstname"],
                    matrikel: parseInt(query["matrikel"])
                };
                Database.insert(student);
                respond(_response, "storing data");
                break;
            case "find":
                Database.findAll(function (json: string): void {
                    respond(_response, json);
                });
                break;
            default:
                respond(_response, "unknown command: " + command);
                break;
        }
    */
}
function respond(_response, _text) {
    //console.log("Preparing response: " + _text);
    _response.setHeader("Access-Control-Allow-Origin", "*");
    _response.setHeader("content-type", "text/html; charset=utf-8");
    _response.write(_text);
    _response.end();
}
//# sourceMappingURL=Server.js.map