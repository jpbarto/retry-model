import { Server } from './server';
import { Client } from './client';

export class Reporter {
    server: Server;
    clients: Array<Client>;
    reportInterval: number;
    intervalId: any;
    firstReport: number = 0;

    constructor(server: Server, clients: Array<Client>, reportInterval: number) {
        this.server = server;
        this.clients = clients;
        this.reportInterval = reportInterval * 1000;
    }

    printReport() {
        if (this.firstReport == 0) {
            this.firstReport = Date.now();
        }

        var retryCount = 0;
        for (const client of this.clients) {
            retryCount += client.retryCount;
        }
        console.log('### Report', new Date().toLocaleString());
        console.log(this.clients.length, 'Clients');
        console.log("Connection attempts:", this.server.connectAttempts);
        console.log('Connected clients:', this.server.connectedClients);
        console.log("Retries:", retryCount);
    }

    printFinalReport() {
        this.printReport();
        console.log("All clients connected in ", Date.now() - this.firstReport, "ms");
    }

    startReporting() {
        this.printReport();
        this.intervalId = setInterval(this.printReport.bind(this), this.reportInterval);
    }

    stopReporting() {
        clearInterval(this.intervalId);
    }
}