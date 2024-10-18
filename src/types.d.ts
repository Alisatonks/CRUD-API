export interface User {
  id: string;
  username: string;
  age: number;
  hobbies: string;
}

declare module 'http' {
  interface IncomingMessage {
    users?: User[];
  }
}

