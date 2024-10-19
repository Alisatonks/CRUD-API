import request from 'supertest';
import { Server } from 'http';
import startServer from '../src/server';
import { initialUsers } from '../src/db/memoryDB';

let server: Server;

beforeAll(async () => {
  server = await startServer(3000);
});

afterAll((done) => {
  server.close(() => {
    done();
  });
});

describe('User API', () => {
  it('GET /api/users should respond with initialUsers', async () => {
    const response = await request(server).get('/api/users');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(initialUsers);
  });

  it('POST /api/users should create a new user', async () => {
    const newUser = {
      username: 'Harry Potter',
      age: 17,
      hobbies: 'Quidditch'
    };

    const response = await request(server)
      .post('/api/users')
      .send(newUser)
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(201);

    expect(response.body).toEqual(expect.objectContaining({
      username: newUser.username,
      age: newUser.age,
      hobbies: newUser.hobbies,
      id: expect.any(String),
  }));

    const usersResponse = await request(server).get('/api/users');
    expect(usersResponse.status).toBe(200);
    expect(usersResponse.body).toContainEqual(expect.objectContaining(newUser));
  });

  it('DELETE /api/users/:id should delete a user', async () => {

    const id = initialUsers[0].id;

    const response = await request(server).delete(`/api/users/${id}`);
    expect(response.status).toBe(204);

    const usersResponse = await request(server).get(`/api/users/${id}`);
    expect(usersResponse.status).toBe(404);
  });

  it('PUT /api/users/:id should update a user', async () => {

    const id = initialUsers[0].id;

    const updatedUser = {
      username: 'Updated',
      age: 17,
      hobbies: 'some hobby'
    };

    const response = await request(server).put(`/api/users/${id}`).send(updatedUser).set('Content-Type', 'application/json');

    expect(response.status).toBe(200);

    expect(response.body).toEqual(expect.objectContaining({
      id,
      ...updatedUser
  }));

    const usersResponse = await request(server).get(`/api/users/${id}`);
    expect(usersResponse.body).toEqual(expect.objectContaining({ id, ...updatedUser }));
  });

});

