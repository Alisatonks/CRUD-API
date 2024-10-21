import { IncomingMessage, ServerResponse } from 'http';
import getBaseUrlAndID from '../utils/getBaseUrlAndID';
import checkID from '../utils/checkId';
import { VALIDATION_ERROR, 
    ID_NOT_VALID, NOT_FOUND, 
    ROUTE_NOT_FOUND, 
    USER_NOT_FOUND} from '../utils/constants';

const getRequest = (req: IncomingMessage, res: ServerResponse) => {
    
        const { baseUrl, id } = getBaseUrlAndID(req.url || '');

        if (baseUrl === '/api/users') {
            if (!id) {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.write(JSON.stringify(req.users));
                res.end();
            } else {
                if (!checkID(id)) {
                    res.statusCode = 400;
                    res.setHeader("Content-Type", "application/json");
                    res.end(JSON.stringify({ title: VALIDATION_ERROR, message: ID_NOT_VALID }));
                } else if (checkID(id)) {
                    const filteredUsers = req.users?.filter(user => user.id === id);
                    if (filteredUsers && filteredUsers.length > 0) {
                        res.statusCode = 200; 
                        res.setHeader("Content-Type", "application/json");
                        res.write(JSON.stringify(filteredUsers[0])); 
                        res.end();
                    } else {
                        res.statusCode = 404; 
                        res.setHeader("Content-Type", "application/json");
                        res.end(JSON.stringify({ title: NOT_FOUND, message: USER_NOT_FOUND }));
                    }
                }
            }
        } else { 
            res.statusCode = 404; 
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ title: NOT_FOUND, message: ROUTE_NOT_FOUND }));
        }
};

export default getRequest;