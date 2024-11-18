export class Server {
    clients: number,
    minConnectTime: number,
    maxConnectTime: number,

    constructor () {
        this.clients = 0;
        this.minConnectTime = 2;
        this.maxConnectTime = 60;
    }

    connect (handler) {
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