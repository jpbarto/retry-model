import opentelemetry, { UpDownCounter } from '@opentelemetry/api';

const serverMeter = opentelemetry.metrics.getMeter('retry.client', '0.1');

export class Server {
    connectedClients: number = 0;
    connectingClients: number = 0;
    connectAttempts: number = 0;
    minConnectTime: number;
    maxConnectTime: number;
    connLimit: number;
    connectingUDCounter: any;

    constructor(minConnectTime: number, maxConnectTime: number, connLimit: number) {
        this.minConnectTime = minConnectTime;
        this.maxConnectTime = maxConnectTime;
        this.connLimit = connLimit;
        this.connectingUDCounter = serverMeter.createUpDownCounter('retry.server.connecting');
    }

    connect(handler: (result: boolean) => any) {
        this.connectAttempts++;

        if (this.connectingClients >= this.connLimit) {
            setTimeout(() => {
                handler(false);
            }, 0);
        } else {
            const connectTime = (this.minConnectTime +
                (this.maxConnectTime - this.minConnectTime) * Math.random())
                * 1000;

            setTimeout(() => {
                this.connectingUDCounter.add(-1);
                this.connectingClients--;
                this.connectedClients++;
                handler(true);
            }, connectTime);

            this.connectingUDCounter.add(1);
            this.connectingClients++;
        }
    }
}