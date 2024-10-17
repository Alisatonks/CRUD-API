import path from "node:path";
import { promises as fs } from 'node:fs';
import { User } from "../types";

async function loadUsers(): Promise<User[]> {
    const __dirname = import.meta.dirname;
    const usersPath = path.join(__dirname, '..', 'data', 'users.json');
    const usersData = await fs.readFile(usersPath, 'utf-8');
    return JSON.parse(usersData);
}

export default loadUsers;