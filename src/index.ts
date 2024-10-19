import startServer from './server';
import dotenv from 'dotenv';
import createCluster from './cluster';

dotenv.config();

const arg = process.argv.slice(2)[0]
const multi = arg && arg.includes('multi')

if(multi) {
    createCluster();
} else {
    startServer(process.env.PORT || 4000)
}

