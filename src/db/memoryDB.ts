import { User } from "../types";

export let users: User[] = [];

export const initializeUsers = (initialUsers: User[] = []) => {
    users = initialUsers;
};