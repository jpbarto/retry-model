import { Server } from "./server";
import opentelemetry from '@opentelemetry/api';

const clientMeter = opentelemetry.metrics.getMeter('retry-model.client', '0.1');

export class Client {
    server: Server;
    connected: boolean = false;
    connecting: boolean = false;
    retryCount: number = 0;
    retryBase: number = 0;
    retryLimit: number = 0;
    nextRetryAt: number = 0;
    waitForRetry: boolean = false;
    timeWaiting: number = 0;
    retryTimes: any;

    constructor(server: Server, retryTime: number, retryLimit: number) {
        this.server = server;
        this.retryBase = retryTime;
        this.retryLimit = retryLimit;
        this.retryTimes = clientMeter.createHistogram ('client.retry-delay');
    }

    connect() {
        if (!this.connected && !this.connecting) {
            if (!this.waitForRetry) {
                this.connecting = true;
                this.server.connect(this.connectHandler.bind(this));
            } else {
                if (Date.now() >= this.nextRetryAt) {
                    this.retryCount++;
                    this.waitForRetry = false;
                }
            }
        }
    }

    connectHandler(result: boolean) {
        this.connecting = false;
        if (result) {
            this.connected = true;
        } else {
            this.waitForRetry = true;

            var retryDelay = Math.pow(this.retryBase, this.retryCount);
            if (retryDelay > this.retryLimit) {
                retryDelay = this.retryLimit;
            }

            this.timeWaiting += retryDelay;

            this.nextRetryAt = Date.now() + (retryDelay * 1000);
            this.retryTimes.record (retryDelay);
        }
    }
}