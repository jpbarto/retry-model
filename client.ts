import { Server } from "./server";

export class Client {
    server: Server,
    connected: boolean,

    constructor (server: Server) {
        this.server = server;
        this.connected = false;
    }

    connect () {
        if (! this.connected) {
            this.server.connect (this.connectHandler);
        }
    }

    connectHandler () {
        this.connected = true;
    }
}