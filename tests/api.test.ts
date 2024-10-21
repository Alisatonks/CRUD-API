import request from 'supertest';
import { Server } from 'http';
import startServer from '../src/server';
import { ID_NOT_VALID, BODY_NOT_VALID, ROUTE_NOT_FOUND, VALIDATION_ERROR } from '../src/utils/constants';

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
  it('GET /api/users should respond with empty array', async () => {
    const response = await request(server).get('/api/users');
    expect(response.body).toEqual([]);
  });

  it('GET /api/users should respond with status 200', async () => {
    const response = await request(server).get('/api/users');
    expect(response.status).toBe(200);
  });

  it('POST /api/users should create a new user', async () => {
    const newUser = {
      username: 'Harry Potter',
      age: 17,
      hobbies: ['Quidditch']
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

  it('POST /api/notValidRoute should return rout not found error', async () => {
    const newUser = {
      username: 'Harry Potter',
      age: 17,
      hobbies: ['Quidditch']
    };

    const response = await request(server)
      .post('/api/notValidRoute')
      .send(newUser)
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(404);
    expect(response.body.message).toBe(ROUTE_NOT_FOUND);
    
  });

  it('POST /api/users should return not valid body error when username is a number', async () => {
    const newUser = {
      username: 123,
      age: 17,
      hobbies: ['Quidditch']
    };

    const response = await request(server)
      .post('/api/users')
      .send(newUser)
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(BODY_NOT_VALID);
    
  });

  it('DELETE /api/users/:id should delete a user', async () => {

    const newUser = {
      username: 'Harry Potter',
      age: 17,
      hobbies: ['Quidditch']
    };

    const res = await request(server)
      .post('/api/users')
      .send(newUser)
      .set('Content-Type', 'application/json');

      const id = res.body.id;

    const response = await request(server).delete(`/api/users/${id}`);
    expect(response.status).toBe(204);

    const usersResponse = await request(server).get(`/api/users/${id}`);
    expect(usersResponse.status).toBe(404);
  });

  it('DELETE /api/users/:id should return 400 status', async () => {

    const response = await request(server).delete(`/api/users`);
    expect(response.status).toBe(400);
  });
  
  it('DELETE /api/users should return 400 status', async () => {

    const response = await request(server).delete(`/api/users`);
    expect(response.status).toBe(400);
  });

  it('DELETE /api/users/:non-existing-id ID should return 404 status', async () => {

    const response = await request(server).delete(`/api/users/26fb7415-8d3a-4385-a1d4-ba184e0a2936`);
    expect(response.status).toBe(404);
  });

  it('PUT /api/users/:id should update a user', async () => {

    const newUser = {
      username: 'Harry Potter',
      age: 17,
      hobbies: ['Quidditch']
    };

    const res = await request(server)
      .post('/api/users')
      .send(newUser)
      .set('Content-Type', 'application/json');

      const id = res.body.id;

    const updatedUser = {
      username: 'Updated',
      age: 17,
      hobbies: ['some hobby']
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

  it('PUT /api/users/:invalid-id should return not valid id error', async () => {

    const newUser = {
      username: 'Harry Potter',
      age: 17,
      hobbies: ['Quidditch']
    };

    const res = await request(server)
      .post('/api/users')
      .send(newUser)
      .set('Content-Type', 'application/json');

      const id = 123;

    const updatedUser = {
      username: 'Updated',
      age: 17,
      hobbies: ['some hobby']
    };

    const response = await request(server).put(`/api/users/${id}`).send(updatedUser).set('Content-Type', 'application/json');

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(ID_NOT_VALID);
  });

  it('PUT /api/users/:id should return not valid body error when key: hobbies is missing', async () => {

    const newUser = {
      username: 'Harry Potter',
      age: 17,
      hobbies: ['Quidditch']
    };

    const res = await request(server)
      .post('/api/users')
      .send(newUser)
      .set('Content-Type', 'application/json');

      const id = res.body.id;

    const updatedUser = {
      username: 'Updated',
      age: 17,
    };

    const response = await request(server).put(`/api/users/${id}`).send(updatedUser).set('Content-Type', 'application/json');

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(BODY_NOT_VALID);
  });

});

