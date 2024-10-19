import crypto from 'node:crypto';
import { IncomingMessage, ServerResponse } from 'http';
import { NOT_FOUND, ROUTE_NOT_FOUND, BODY_NOT_VALID, VALIDATION_ERROR } from '../utils/constants';
import bodyParser from '../utils/bodyParser';
import { User } from '../types';
import {users} from '../db/memoryDB';

const postRequest = async (req: IncomingMessage, res: ServerResponse) => {
    if(req.url === '/api/users') {
        try{
            const body = await bodyParser(req) as Partial<User>;
            if (!body.username || !body.age || !body.hobbies) {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ title: VALIDATION_ERROR, message: BODY_NOT_VALID }));
                return;
            }
            body.id = crypto.randomUUID();
            const newUser = body as User;
            users.push(newUser);
            res.statusCode = 201;
            res.setHeader("Content-Type", "application/json");
            res.write(JSON.stringify(newUser));
            res.end(); 
        } catch(e) {
            console.log(e)
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ title: VALIDATION_ERROR, message: BODY_NOT_VALID }));
        }
    } else {
        res.statusCode = 404;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ title: NOT_FOUND, message: ROUTE_NOT_FOUND }));
    }
};

export default postRequest;