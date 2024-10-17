import { IncomingMessage } from 'http';

export interface User {
  id: number;
  username: string;
  age: number;
  hobbies: string;
}

declare module 'http' {
  interface IncomingMessage {
    users?: User[];
  }
}

