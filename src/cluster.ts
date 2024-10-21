import cluster from "node:cluster";
import os from 'node:os';
import startServer from "./server"; 
import dotenv from 'dotenv';
import http from 'node:http';
import { changeUsers, initializeUsers } from "./db/users";
import { ProcessMessage } from "./types";

const createCluster = () => {
    dotenv.config();

    const PORT = parseInt(process.env.PORT || '4000', 10);

    if (cluster.isPrimary) {

        const numCPUs = os.cpus().length - 1;
        initializeUsers();

        cluster.on('message', (worker, message) => {
            if (message.type === 'UPDATE_USERS') {
                // Update the users array in the primary process
                changeUsers(message.data);
                // Notify all workers of the updated state
                for (const id in cluster.workers) {
                    cluster.workers[id]?.send({ type: 'SYNC_USERS', data: message.data });
                }
            }
        });

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

            process.on('message', (message: ProcessMessage) => {
                if (message.type === 'SYNC_USERS') {
                    changeUsers(message.data);
                }
            });

            console.log(`Worker process PID: ${process.pid} running on http://localhost:${workerPort}`);
        } else {
            console.error('WORKER_PORT is not defined');
            process.exit(1);
        }
    }
}

export default createCluster;


