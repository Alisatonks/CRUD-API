import path from "node:path";
import { promises as fs } from 'node:fs';
import { User } from "../types";
import {initializeUsers} from '../db/memoryDB';

async function loadUsers() {
    try {
        const __dirname = import.meta.dirname;
        const usersPath = path.join(__dirname, '..', 'data', 'users.json');
        const usersData = await fs.readFile(usersPath, 'utf-8');
        const initialUsers = JSON.parse(usersData);
        initializeUsers(initialUsers); 
    } catch (e) {
        console.error('Error loading initial users:', e);
        initializeUsers([]); 
    }
    
}

export default loadUsers;