import { IncomingMessage, ServerResponse } from 'http';
import { NOT_FOUND, ROUTE_NOT_FOUND, BODY_NOT_VALID, VALIDATION_ERROR } from '../utils/constants';
import bodyParser from '../utils/bodyParser';
import { NewUser } from '../types';
import {validateUser, createNewUser} from '../db/users';
import getBaseUrlAndID from '../utils/getBaseUrlAndID';


const postRequest = async (req: IncomingMessage, res: ServerResponse) => {
    const { baseUrl } = getBaseUrlAndID(req.url || '');

    if(baseUrl === '/api/users') {
        try{
            const body = await bodyParser(req) as NewUser;
            if (!validateUser(body)) {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ title: VALIDATION_ERROR, message: BODY_NOT_VALID }));
                return;
            }
            const newUser = createNewUser(body);
            res.statusCode = 201;
            res.setHeader("Content-Type", "application/json");
            res.write(JSON.stringify(newUser));
            res.end(); 
        } catch(e) {
            console.error(e)
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