import crypto from 'node:crypto';
import { IncomingMessage, ServerResponse } from 'http';
import { USER_CREATED, SUCCESS, FAIL, INVALID_DATA, SERVER_ERROR, NOT_FOUND, ROUTE_NOT_FOUND, BODY_NOT_VALID, VALIDATION_ERROR } from '../utils/constants';
import bodyParser from '../utils/bodyParser';
import { User } from '../types';
import writeUser from '../utils/writeUser';
import {users} from '../db/memoryDB';

const postRequest = async (req: IncomingMessage, res: ServerResponse) => {
    if(req.url === '/api/users') {
        try{
            const body = await bodyParser(req) as Partial<User>;
            body.id = crypto.randomUUID();
            const newUser = body as User;
            users.push(newUser);
            res.writeHead(201, {"Content-Type": "application/json"});
            res.end(); 
        } catch(e) {
            console.log(e)
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ title: VALIDATION_ERROR, message: BODY_NOT_VALID }));
        }
    } else {
        console.log(req.url);
        res.statusCode = 404;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ title: NOT_FOUND, message: ROUTE_NOT_FOUND }));
    }
};

export default postRequest;