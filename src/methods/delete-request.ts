import { IncomingMessage, ServerResponse } from 'http';
import getBaseUrlAndID from '../utils/getBaseUrlAndID';
import checkID from '../utils/checkId';
import {users} from '../db/memoryDB';
import { VALIDATION_ERROR, ID_NOT_VALID, NOT_FOUND, USER_NOT_FOUND, ROUTE_NOT_FOUND } from '../utils/constants';

const deleteRequest = (req:IncomingMessage, res: ServerResponse) => {
    const { baseUrl, id } = getBaseUrlAndID(req.url || '');
    if(baseUrl === '/api/users' && id) {
        if (!checkID(id)) {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ title: VALIDATION_ERROR, message: ID_NOT_VALID }));
        } else if (baseUrl === '/api/users' && checkID(id)) {
            const index = users.findIndex(user => user.id === id);
            if (index === -1) {
                    res.statusCode = 404; 
                    res.setHeader("Content-Type", "application/json");
                    res.end(JSON.stringify({ title: NOT_FOUND, message: USER_NOT_FOUND }));
            } else {
                    users.splice(index, 1);
                    res.writeHead(204, {"Content-Type": "application/json"});
                    res.end();
            }
        }
    } else {
        res.statusCode = 404; 
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ title: NOT_FOUND, message: ROUTE_NOT_FOUND }));
    }
    
};

export default deleteRequest;