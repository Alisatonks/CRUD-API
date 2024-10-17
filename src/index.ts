import http from 'http';
import dotenv from 'dotenv';
import getRequest from './methods/get-request';
import deleteRequest from './methods/delete-request';
import putRequest from './methods/put-request';
import postRequest from './methods/post-request';
import { User } from './types';
import { IncomingMessage } from 'http';
import loadUsers from './utils/loadUsers';

dotenv.config();

const PORT = process.env.PORT || 4002;

const server = http.createServer(async (req: IncomingMessage, res) => {
    try {
        
        req.users = await loadUsers();

        switch(req.method) {
            case "GET":
                getRequest(req, res);
                break;
            case "POST":
                postRequest(req, res);
                break;
            case "PUT":
                putRequest(req, res);
                break;
            case "DELETE":
                deleteRequest(req, res);
                break;
            default:
                res.statusCode = 404;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({title: 'Not found', message: 'Route not found'}));
        }
    } catch(e) {
        console.error('Error handling request:', e);
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({title: 'Server Error', message: 'An unexpected error occurred'}));
    }
});

server.listen(PORT, () => {
    console.log(`Server started on PORT: ${PORT}`);
});

console.log('Starting CRUD API!');