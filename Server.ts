/**
 * Simple server managing between client and database
 * @author: Jirka Dell'Oro-Friedl
 */

import * as Http from "http";
import * as Url from "url";
import * as Database from "./Database";
import { ParsedUrlQuery } from "querystring";

console.log("Server starting");

let port: number = parseInt(process.env.PORT);
if (isNaN(port))
    port = 8100;

let server: Http.Server = Http.createServer();
server.addListener("listening", handleListen);
server.addListener("request", handleRequest);
server.listen(port);


function handleListen(): void {
    console.log("Listening on port: " + port);
}

function handleRequest(_request: Http.IncomingMessage, _response: Http.ServerResponse): void {
    console.log("Request received");
    let query: ParsedUrlQuery = Url.parse(_request.url, true).query;
    //var command: string = query["command"];
    var output: string;
    let username: string = <string>query["u"];
    let password: string = <string>query["p"];
    let address: string = <string>query["a"];
    let database: string = <string>query["n"];
    let collection: string = <string>query["c"];
    let missingParameters: boolean = false;
    output = "<head><style>table,th,td {border: 1px solid lightblue; border-collapse:collapse;padding:0px 10px}</style></head>";
    output += "<body><h1>mongoDBrowser</h1>";
    output += "<h3>Query parameters</h3><table><tr>";
    output += "<th>key</th><th>current value</th><th>description</th><th>remark</th></tr><tr>";
    output += "<td>u=</td><td>" + username + "<td>username</td><td>(may be omitted for local database)</td></tr><tr>";
    output += "<td>p=</td>" + ifMissing(username && !password, password) + "<td>password</td><td>(required when username given)</td></tr><tr>";
    output += "<td>a=</td>" + ifMissing(!address, address) + "<td>database address</td><td>(required, everything right of '@')</td></tr><tr>";
    output += "<td>n=</td>" + ifMissing(!database, database) + "<td>database name</td><td>(required)</td></tr><tr>";
    output += "<td>c=</td>" + ifMissing(!collection, collection) + "<td>collection</td><td>(required)</td></tr>";
    output += "</table>";
    output += "<p>Example: <a href='https://mongodbrowser.herokuapp.com/?u=testuser&p=testpassword&a=ds129532.mlab.com:29532/eia2&n=eia2&c=students'>Click here</a></p>";
    if (missingParameters) {
        respond(_response, "");
        return;
    }
    else {
        output += "<h3>Result</h3>";
        Database.connect(username, password, address, database, collection, processDatabaseResult);
    }

    function ifMissing(_missing: boolean, _notMissing: string): string {
        missingParameters = missingParameters || _missing;
        return "<td>" + ((_missing) ? "<strong>missing</strong>" : _notMissing) + "</td>";
    }

    function processDatabaseResult(_result: string): void {
        console.log(_result);
        respond(_response, _result);
    }

    function respond(_response: Http.ServerResponse, _text: string): void {
        //console.log("Preparing response: " + _text);
        _response.setHeader("Access-Control-Allow-Origin", "*");
        _response.setHeader("content-type", "text/html; charset=utf-8");
        _response.write(output + _text + "</body>");
        _response.end();
    }
}
