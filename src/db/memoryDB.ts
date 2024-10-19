import { User } from "../types";

export let users: User[] = [];

export const initialUsers = [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "username": "James Potter",
      "age": 21,
      "hobbies": "Quiddich"
    },
    {
      "id": "551e8400-e29b-41d4-a716-446655440000",
      "username": "Remus Lupin",
      "age": 38,
      "hobbies": "Reading"
    },
    {
      "id": "2f14a633-27e3-44c9-a2f0-6a969b9677ec",
      "username": "Sirius Black",
      "age": 36,
      "hobbies": "Muggle motorbikes.",
    }
]

export const initializeUsers = () => {
    users = initialUsers;
};