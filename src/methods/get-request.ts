import { IncomingMessage, ServerResponse } from 'http';

const getRequest = (req: IncomingMessage, res: ServerResponse) => {
    
    if(req.url === '/api/users') {
        console.log(req.url)
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.write(JSON.stringify(req.users));
        res.end();
    } else {
        res.writeHead(404, {"Content-Type": "application/json"});
        res.end(JSON.stringify({title: 'Not found', message: 'Route not found'}))
    }
};

export default getRequest;