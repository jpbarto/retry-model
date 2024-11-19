export class Server {
    connectedClients: number = 0;
    connectingClients: number = 0;
    connectAttempts: number = 0;
    minConnectTime: number;
    maxConnectTime: number;
    connLimit: number;

    constructor (minConnectTime: number, maxConnectTime: number, connLimit: number) {
        this.minConnectTime = minConnectTime;
        this.maxConnectTime = maxConnectTime;
        this.connLimit = connLimit;
    }

    connect (handler: (result: boolean) => any) {
        this.connectAttempts++;

        if (this.connectingClients >= this.connLimit) {
            setTimeout(() => {
                handler(false);
            }, 0);
        }else{
            const connectTime = (this.minConnectTime + 
                (this.maxConnectTime - this.minConnectTime)*Math.random())
                *1000;

            setTimeout(() => {
                this.connectingClients--;
                this.connectedClients++;
                handler (true);
            }, connectTime);

            this.connectingClients++;
        }
    }
}