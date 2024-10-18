import { IncomingMessage, ServerResponse } from 'http';

const bodyParser = (req: IncomingMessage) => {

    return new Promise((resolve, reject) => {
        let body = '';

        req.on('data', chunk => body += chunk);

        req.on('end', () => {
            try {
                const parsedBody = JSON.parse(body);
                resolve(parsedBody);
            } catch(e) {
                console.error('Error parsing request body:', e);
                reject(e);
            }
        });

        req.on('error', (err) => {
            console.error('Request error:', err);
            reject(err)
        });
    })
    
}

export default bodyParser;