import { metrics, trace, Span, UpDownCounter } from '@opentelemetry/api';
import bunyan from 'bunyan';

const serverMeter = metrics.getMeter('retry-model.server', '0.1');
const tracer = trace.getTracer('retry-model.server', '0.1');
const logger = bunyan.createLogger ({name: 'retry-model.server' });

function randomNormal(min: number, max: number, skew: number) {
    let u = 0, v = 0;
    while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while (v === 0) v = Math.random();
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

    num = num / 10.0 + 0.5; // Translate to 0 -> 1
    if (num > 1 || num < 0)
        num = randomNormal(min, max, skew); // resample between 0 and 1 if out of range
    else {
        num = Math.pow(num, skew); // Skew
        num *= max - min; // Stretch to fill range
        num += min; // offset to min
    }
    return num;
}

export class Server {
    connectedClients: number = 0;
    connectingClients: number = 0;
    connectAttempts: number = 0;
    minConnectTime: number;
    maxConnectTime: number;
    skewConnectTime: number;
    connLimit: number;
    connectingUDCounter: any;
    connectTimes: any;
    connectedCount: any;

    constructor(minConnectTime: number, maxConnectTime: number, skewConnectTime: number, connLimit: number) {
        this.minConnectTime = minConnectTime;
        this.maxConnectTime = maxConnectTime;
        this.skewConnectTime = skewConnectTime;
        this.connLimit = connLimit;
        this.connectingUDCounter = serverMeter.createUpDownCounter('retry-model.server.connecting');
        this.connectTimes = serverMeter.createHistogram('retry-model.server.connect-times');
        this.connectedCount = serverMeter.createCounter('retry-model.server.connected-users');

        logger.info ('Server created with configuration '+ {
            minConnectTime: minConnectTime,
            maxConnectTime: maxConnectTime,
            skewConnectTime: skewConnectTime,
            connLimit: connLimit
        });
    }

    connect(handler: (result: boolean) => any) {
        this.connectAttempts++;

        tracer.startActiveSpan('server-connect', (span: Span) => {
            span.setAttribute ('connecting-client-count', this.connectingClients);
            span.setAttribute ('connecting-clients-limit', this.connLimit);

            if (this.connectingClients >= this.connLimit) {
                setTimeout(() => {
                    handler(false);
                }, 0);
            } else {
                // const connectTime = (this.minConnectTime +
                //     (this.maxConnectTime - this.minConnectTime) * Math.random())
                //     * 1000;

                const connectTime = randomNormal(this.minConnectTime, this.maxConnectTime, this.skewConnectTime) * 1000;
                this.connectTimes.record(connectTime);
                span.setAttribute ('client-connect-time', connectTime);

                setTimeout(() => {
                    this.connectingClients--;
                    this.connectingUDCounter.add(-1);
                    this.connectedCount.add(1);
                    this.connectedClients++;
                    handler(true);
                }, connectTime);

                this.connectingClients++;
                this.connectingUDCounter.add(1);

                logger.info ("Accepted connection from client with a connect time of "+ connectTime +' ms');
            }

            span.end ();
        });
    }
}