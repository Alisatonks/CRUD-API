import http from 'http';
import getRequest from './methods/get-request';
import deleteRequest from './methods/delete-request';
import putRequest from './methods/put-request';
import postRequest from './methods/post-request';
import { IncomingMessage, ServerResponse } from 'http';
import { initializeUsers } from './db/memoryDB';
import { users } from './db/memoryDB';
import { SERVER_ERROR, SERVER_ERROR_MSG } from './utils/constants';

function startServer(port: string | number): Promise<http.Server> {

    return new Promise(async (resolve, reject) => {
        try {
            initializeUsers();
            const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
                (req as any).users = users;

                res.setHeader('X-Worker-Port', port.toString());

                try {
                    switch (req.method) {
                        case 'GET':
                            getRequest(req, res);
                            break;
                        case 'POST':
                            postRequest(req, res);
                            break;
                        case 'PUT':
                            putRequest(req, res);
                            break;
                        case 'DELETE':
                            deleteRequest(req, res);
                            break;
                        default:
                            res.statusCode = 404;
                            res.setHeader('Content-Type', 'application/json');
                            res.end(JSON.stringify({ title: 'Not found', message: 'Route not found' }));
                    }
                } catch(error) {
                    console.error(SERVER_ERROR, error);
                    res.statusCode = 500;
                    res.setHeader("Content-Type", "application/json");
                    res.end(JSON.stringify({
                        title: SERVER_ERROR,
                        message: SERVER_ERROR_MSG
                    }));
                } 
            });

            server.listen(port, () => {
                console.log(`Server started on PORT: ${port}`);
                resolve(server);
            });

            server.on('error', (error) => {
                reject(error);
            });
        } catch (error) {
            console.error('Error starting the server:', error);
            reject(error);
        }
    });
}

export default startServer;