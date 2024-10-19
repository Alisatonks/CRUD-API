import { User } from "../types";

export let users: User[] = [];

export const initialUsers = [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "username": "Alisa Tonks",
      "age": 38,
      "hobbies": "Crocheting"
    },
    {
      "id": "551e8400-e29b-41d4-a716-446655440000",
      "username": "Volha Haiduk",
      "age": 39,
      "hobbies": "Traveling"
    },
    {
      "username": "Pavel Haiduk",
      "age": 39,
      "hobbies": "Cars",
      "id": "2f14a633-27e3-44c9-a2f0-6a969b9677ec"
    }
]

export const initializeUsers = () => {
    users = initialUsers;
};