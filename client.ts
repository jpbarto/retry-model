import { Server } from "./server";
import { trace, Span, metrics } from '@opentelemetry/api';
import bunyan from 'bunyan';

const clientMeter = metrics.getMeter('retry-model.client', '0.1');
const tracer = trace.getTracer('retry-model.client', '0.1');
const logger = bunyan.createLogger({ name: 'retry-model.client' });

function uuidv4() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
        (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    );
}

export class Client {
    clientId: string;
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
    retryCounter: any;

    constructor(server: Server, retryTime: number, retryLimit: number) {
        this.clientId = uuidv4();
        this.server = server;
        this.retryBase = retryTime;
        this.retryLimit = retryLimit;
        this.retryTimes = clientMeter.createHistogram('retry-model.client.retry-delay');
        this.retryCounter = clientMeter.createCounter('retry-model.client.retry-count');
    }

    connect() {
        if (!this.connected && !this.connecting) {
            if (!this.waitForRetry) {
                tracer.startActiveSpan('connect', (span: Span) => {
                    span.setAttribute ('client-id', this.clientId);
                    span.setAttribute ('retry-count', this.retryCount);
                    this.connecting = true;
                    this.server.connect(this.connectHandler.bind(this));
                    logger.info({clientId: this.clientId}, 'Client ' + this.clientId + ' attempting to connect to server...');
                    span.end();
                });
            } else {
                if (Date.now() >= this.nextRetryAt) {
                    this.retryCount++;
                    this.retryCounter.add(1, { clientId: this.clientId });
                    this.waitForRetry = false;
                }
            }
        }
    }

    connectHandler(result: boolean) {
        this.connecting = false;

        tracer.startActiveSpan('connectHandler', (span: Span) => {
            span.setAttribute ('client-id', this.clientId);
            span.setAttribute ('connect-result', result);
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
                this.retryTimes.record(retryDelay, { clientId: this.clientId });
                span.setAttribute ('retry-time', retryDelay);
                logger.info ({clientId: this.clientId}, "Connect request denied, will try again in "+ retryDelay +" sec");
            }
            span.end();
        });
    }
}