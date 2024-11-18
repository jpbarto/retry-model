import { Server } from './server';
import { Client } from './client';

export class Reporter {
    server: Server;
    clients: Array<Client>;
    reportInterval: number;
    intervalId: any;

    constructor (server: Server, clients: Client[], reportInterval: number) {
        this.server = server;
        this.clients = clients;
        this.reportInterval = reportInterval*1000;
    }

    printReport () {
        console.log ('### Report', new Date().toLocaleString ());
        console.log (this.clients.length, 'Clients');
        console.log ('Connected clients:', this.server.clients);
    }

    startReporting () {
        this.printReport ();
        this.intervalId = setInterval(this.printReport, this.reportInterval);
    }

    stopReporting () {
        clearInterval(this.intervalId);
    }
}