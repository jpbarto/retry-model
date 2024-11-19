import { Server } from "./server";

export class Client {
    server: Server;
    connected: boolean = false;
    connecting: boolean = false;
    retryCount: number = 0;
    retryTime: number = 0;
    nextRetryAt: number = 0;
    waitForRetry: boolean = false;

    constructor(server: Server, retryTime: number) {
        this.server = server;
        this.retryTime = retryTime;
    }

    connect() {
        if (!this.connected) {
            if (!this.connecting) {
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
    }

    connectHandler(result: boolean) {
        this.connecting = false;
        if (result) {
            this.connected = true;
        } else {
            this.waitForRetry = true;
            this.nextRetryAt = Date.now() + (this.retryTime * 1000);
        }
    }
}