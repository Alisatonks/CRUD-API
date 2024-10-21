# Simple CRUD API

This is a simple CRUD API using an in-memory database. Note that any data stored in memory (except initial users) will be lost upon system reboot. The server starts with three initial users.

## Installation

1. Clone the repository to your local machine.
2. Switch to the `develop` branch:
   ```bash
   git checkout develop
3. Install the necessary dependencies:
   ```bash
   npm install

## User's guide

1. Add .env file with the following content PORT={PORT_NUMBER} (example: PORT=4000). If the PORT is not set in .env file, the server will start on port 4000.

2. Once the setup is complete, you have four modes to start the application:

- To run application in development mode:
  ```
  npm run start:dev
  ```
- To run application in production mode:
  ```
  npm run start:prod
  ```
- To run application with multiple instances in development mode:
  ```
  npm run start:dev-multi
  ```
- To run application with multiple instances in production mode:
  ```
  npm run start:prod-multi
  ```

3. To run test cases:
   ```
   npm run test
   ```

## Endpoints

- `GET api/users` - returns all users
- `GET api/users/${userId}` - returns a specific user's details if it exists
- `POST api/users` - creates new user
- `PUT api/users/{userId}` - updates existing user
- `DELETE api/users/${userId}` - deletes existing user