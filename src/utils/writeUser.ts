import path from 'node:path';
import { promises as fs } from 'node:fs';
import { User } from '../types';

const writeUser = async(users: User[]) => {
    const __dirname = import.meta.dirname;
    const filePath = path.join(__dirname, '..', 'data/users.json');
    await fs.writeFile(filePath, JSON.stringify(users, null, 2), 'utf-8');
}

export default writeUser;