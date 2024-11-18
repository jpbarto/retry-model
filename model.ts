import { Server } from "./server";
import { Client } from "./client";

const CLIENT_COUNT = 10;

const server = new Server ();
const clients = Client[];

for (var i = 0; i < CLIENT_COUNT; i++) {
    clients.push (new Client (server));
}

function tick () {
    var connectCount = 0;

    for (const client of clients) {
        client.connect ();
        if (client.connected) {
            connectCount++;
        }
    }

    if (connectCount < CLIENT_COUNT) {
        setTimeout(tick, 0);
    }else{
        console.log ('Model complete');
    }
}

console.log ('Model running...');

tick ();