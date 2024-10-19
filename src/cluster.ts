import cluster from "node:cluster";
import os from 'node:os';
import startServer from "./server"; 
import dotenv from 'dotenv';
import http from 'node:http';

const createCluster = () => {
    dotenv.config();

    const PORT = parseInt(process.env.PORT || '4000', 10);

    if (cluster.isPrimary) {

        const numCPUs = os.cpus().length - 1;

        for (let i = 0; i < numCPUs; i++) {
            cluster.fork({ WORKER_PORT: PORT + i + 1 });
        }

        console.log(`Primary process ${process.pid} is running and listening for requests on port ${PORT}`);

        const roundRobin = (() => {
            let current = 0;
            const workerPorts = Array.from({ length: numCPUs }, (_, i) => PORT + i + 1);
            return () => workerPorts[current++ % workerPorts.length];
        })();

        http.createServer((req, res) => {
            const targetPort = roundRobin();
            const options = {
                hostname: 'localhost',
                port: targetPort,
                path: req.url,
                method: req.method,
                headers: req.headers,
            };

            const proxy = http.request(options, (response) => {
                res.writeHead(response.statusCode || 500, response.headers);
                response.pipe(res, { end: true });
            });

            req.pipe(proxy, { end: true });
        }).listen(PORT);

    } else {
        const workerPort = process.env.WORKER_PORT;

        if (workerPort) {
            startServer(workerPort);
            console.log(`Worker process PID: ${process.pid} running on http://localhost:${workerPort}`);
        } else {
            console.error('WORKER_PORT is not defined');
            process.exit(1);
        }
    }
}



export default createCluster;



