export class Server {
    clients: number = 0;
    minConnectTime: number;
    maxConnectTime: number;

    constructor () {
        this.minConnectTime = 2;
        this.maxConnectTime = 60;
    }

    connect (handler: () => any) {
        const connectTime = (this.minConnectTime + 
            (this.maxConnectTime - this.minConnectTime)*Math.random())
            *1000;

        setTimeout(() => {
            this.clients++;
            handler ();
        }, connectTime);

        return true;
    }
}