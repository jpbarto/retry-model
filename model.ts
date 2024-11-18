import { Server } from "./server";
import { Client } from "./client";
import { Reporter } from "./reporter";

const CLIENT_COUNT = 10;

const server = new Server();
const clients = new Array<Client> ();

for (var i = 0; i < CLIENT_COUNT; i++) {
    clients.push(new Client(server));
}

const reporter = new Reporter(server, clients, 5);
reporter.startReporting();

function tick() {
    var connectCount = 0;

    for (const client of clients) {
        client.connect();
        if (client.connected) {
            connectCount++;
        }
    }

    if (connectCount < CLIENT_COUNT) {
        setTimeout(tick, 0);
    } else {
        console.log('Model complete');
        reporter.stopReporting();
        reporter.printReport();
    }
}

console.log('Model running...');

tick();