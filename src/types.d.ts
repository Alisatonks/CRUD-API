export interface User {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}

declare module 'http' {
  interface IncomingMessage {
    users?: User[];
  }
}

export type NewUser = Omit<User, 'id'>;

type ProcessMessage = 
    | { type: 'SYNC_USERS'; data: User[] }
    | { type: 'UPDATE_USERS'; data: User[] };

