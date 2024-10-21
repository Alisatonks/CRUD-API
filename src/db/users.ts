import { User, NewUser } from "../types";
import crypto from 'node:crypto';

export let users: User[] = [];

export const initialUsers = [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "username": "James Potter",
      "age": 21,
      "hobbies": ["Quiddich"]
    },
    {
      "id": "551e8400-e29b-41d4-a716-446655440000",
      "username": "Remus Lupin",
      "age": 38,
      "hobbies": ["Reading"]
    },
    {
      "id": "2f14a633-27e3-44c9-a2f0-6a969b9677ec",
      "username": "Sirius Black",
      "age": 36,
      "hobbies": ["Muggle motorbikes.", "Traveling"],
    }
]

export const initializeUsers = () => {
    users = initialUsers;
};

export const changeUsers = (newUsers: User[]) => {
  users=[...newUsers]
}

export const validateUser = (user: NewUser) => {
  const { username, age, hobbies } = user;

  return (
    typeof username === 'string' &&
    typeof age === 'number' &&
    Array.isArray(hobbies)
  );
};


export const createNewUser = (user: NewUser) => {
  const id = crypto.randomUUID();
  const newUser = {id, ...user};
  users.push(newUser);
  if (process.send) {
    process.send({ type: 'UPDATE_USERS', data: users });
}
  return newUser;
}

export const findUserIndex = (id: string) => {
 return users.findIndex(user => user.id === id);
} 

export const updateUser = (user: NewUser, id: string, index: number) => {
  const updatedUser = {id, ...user};

  users[index] = {
    ...users[index],
    id, 
    ...user
  };

  if (process.send) {
    process.send({ type: 'UPDATE_USERS', data: users });
}
  return updatedUser;
}

export const deleteUser = (index: number) => {
  users.splice(index, 1);
  if (process.send) {
    process.send({ type: 'UPDATE_USERS', data: users });
}
}