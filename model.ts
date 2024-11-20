import { Server } from "./server";
import { Client } from "./client";
import { Reporter } from "./reporter";

const CLIENT_COUNT = 400;   // number of clients to simulate
const MIN_CONN_TIME = 19.57;   // min time it takes a client to connect (in sec)
const MAX_CONN_TIME = 120.61;   // max time it takes a client to connect (in sec)
const SKEW_CONN_TIME = 2.25;   // skew for on connect time distribution
const CONN_LIMIT = 30;      // max number of clients that can connect at once
const RETRY_BASE = 3;      // time a client waits before reattempting to connect
const RETRY_LIMIT = 120;     // max time to wait before retrying to connect
const REPORT_INTERVAL = 5;  // how often to report metrics

const server = new Server(MIN_CONN_TIME, MAX_CONN_TIME, SKEW_CONN_TIME, CONN_LIMIT);
const clients = new Array<Client>();

for (var i = 0; i < CLIENT_COUNT; i++) {
    clients.push(new Client(server, RETRY_BASE, RETRY_LIMIT));
}

const reporter = new Reporter(server, clients, REPORT_INTERVAL);
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
        reporter.printFinalReport();
    }
}

console.log('Model running...');

tick();