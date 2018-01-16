// Node-Http-Modul importieren
import * as Http from "http";
// Node-Url-Modul importieren
import * as Url from "url";

namespace ServerTest {
    // Neuer Datentyp AssocStringString: homogenes, assoziatives Array.
    interface AssocStringString {
        [key: string]: string;
    }

    // Port vom Process-Objekt erfragen 
    let port: number = process.env.PORT;
    // Port nicht definiert -> lokale Maschine, Port selbst definieren
    if (port == undefined)
        port = 8100;

    // Server-Objekt kreieren
    let server: Http.Server = Http.createServer();
    // Event-Handler installieren
    server.addListener("listening", handleListen);
    server.addListener("request", handleRequest);
    // Auf dem Port horchen
    server.listen(port);

    // Listening-Event: Rückmeldung wenn horchen läuft
    function handleListen(): void {
        console.log("Server listening on port " + port);
    }

    // Request-Event: Verarbeiten der Request und erstellen der Response
    function handleRequest(_request: Http.IncomingMessage, _response: Http.ServerResponse): void {
        console.log("Ich höre Stimmen!!");
        // Header: Antwort kommt im HTML-Format mit uft-8
        _response.setHeader("content-type", "text/html; charset=utf-8");
        // Header: ?
        _response.setHeader("Access-Control-Allow-Origin", "*");

        // Response-Body
        _response.write("Ich höre Stimmen!!<br>");
        _response.write("Port: " + port + "<br>");
        _response.write("Method: " + _request.method + "<br>");
        _response.write("Url: " + _request.url + "<br>");
        _response.write("Headers: " + _request.headers + "<br>");

        // ?
        let query: AssocStringString = Url.parse(_request.url, true).query;
        // ?
        for (let key in query)
            _response.write(key + ": " + query[key]);

        // Antwort abschließen und abschicken
        _response.end();
    }
}