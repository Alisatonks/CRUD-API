import { IncomingMessage, ServerResponse } from 'http';
import bodyParser from '../utils/bodyParser';
import { User } from '../types';
import { users} from '../db/memoryDB';
import { VALIDATION_ERROR, BODY_NOT_VALID, NOT_FOUND, ROUTE_NOT_FOUND, ID_NOT_VALID, USER_NOT_FOUND, SERVER_ERROR, USER_ID_MISSING } from '../utils/constants';
import getBaseUrlAndID from '../utils/getBaseUrlAndID';
import checkID from '../utils/checkId';


const putRequest = async(req: IncomingMessage, res: ServerResponse) => {

    const { baseUrl, id } = getBaseUrlAndID(req.url || '');
    
    if(baseUrl === '/api/users') {
        if(id) {
            if (!checkID(id)) {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ title: VALIDATION_ERROR, message: ID_NOT_VALID }));
            } else if (checkID(id)) {
                const index = users.findIndex(user => user.id === id);
                if (index === -1) {
                        res.statusCode = 404; 
                        res.setHeader("Content-Type", "application/json");
                        res.end(JSON.stringify({ title: NOT_FOUND, message: USER_NOT_FOUND }));
                } else {
                    try {
                        const body = await bodyParser(req) as Partial<User>;
            
                        if (!body.username || !body.age || !body.hobbies) {
                            res.statusCode = 400;
                            res.setHeader("Content-Type", "application/json");
                            res.end(JSON.stringify({ title: VALIDATION_ERROR, message: BODY_NOT_VALID }));
                            return;
                        }
            
                        users[index] = {
                            ...users[index],
                            ...body, 
                            id 
                        };
            
                        res.writeHead(204, { "Content-Type": "application/json" });
                        res.end();
                    } catch (error) {
                        res.statusCode = 500;
                        res.setHeader("Content-Type", "application/json");
                        res.end(JSON.stringify({ title: SERVER_ERROR, message: SERVER_ERROR }));
                    }
                }
            }
        } else {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ title: 'Error', message: USER_ID_MISSING }));
        }
       
    } else {
        res.statusCode = 404; 
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ title: NOT_FOUND, message: ROUTE_NOT_FOUND }));
    }
};

export default putRequest;