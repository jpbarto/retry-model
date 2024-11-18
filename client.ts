import { Server } from "./server";

export class Client {
    server: Server;
    connected: boolean = false;

    constructor (server: Server) {
        this.server = server;
    }

    connect () {
        if (! this.connected) {
            this.server.connect (this.connectHandler.bind (this));
        }
    }

    connectHandler () {
        this.connected = true;
    }
}