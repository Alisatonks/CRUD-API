import http from 'http';
import dotenv from 'dotenv';
import getRequest from './methods/get-request';
import deleteRequest from './methods/delete-request';
import putRequest from './methods/put-request';
import postRequest from './methods/post-request';
import { IncomingMessage, ServerResponse } from 'http';
import loadUsers from './utils/loadUsers';
import { users } from './db/memoryDB';
import { SERVER_ERROR, SERVER_ERROR_MSG } from './utils/constants';

dotenv.config();

const PORT = process.env.PORT || 4002;

async function startServer() {
    try {
        await loadUsers();
        const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
            req.users = users; 

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

        server.listen(PORT, () => {
            console.log(`Server started on PORT: ${PORT}`);
        });
    } catch (error) {
        console.error('Error starting the server:', error);
    }
}

startServer();