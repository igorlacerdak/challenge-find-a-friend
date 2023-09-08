import { app } from '@/app';
import { faker } from '@faker-js/faker';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Create pet (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to register a new pet', async () => {
    const authResponse = await request(app.server).post('/sessions').send({
      email: 'org01@hotmail.com',
      password: '123456',
    });

    const { token } = authResponse.body;

    console.log(token);

    const response = await request(app.server).post('/pets').set('Authorization', `Bearer ${token}`).send({
      name: faker.person.middleName(),
      biography: faker.person.bio(),
      age: 3,
      dogSize: 'MINI',
      energyLevel: 4,
      independenceLevel: 3,
    });

    expect(response.statusCode).toEqual(201);
  });
});
