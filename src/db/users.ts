import { User, NewUser } from "../types";
import crypto from 'node:crypto';

export let users: User[] = [];

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