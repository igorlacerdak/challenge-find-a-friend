import { app } from '@/app';
import { prisma } from '@/db/prisma';
import { faker } from '@faker-js/faker';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Fetch Profile Pet Details(e2e)', () => {
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

    const org = await prisma.organization.findFirstOrThrow();

    const pet = await prisma.pet.create({
      data: {
        name: faker.person.middleName(),
        biography: faker.lorem.sentences(4),
        age: 3,
        dog_size: 'MEDIUM',
        energy_level: 5,
        independence_level: 2,
        organization_id: org.id,
      },
    });

    const response = await request(app.server).get(`/pets/${pet.id}`).set('Authorization', `Bearer ${token}`).send();

    expect(response.statusCode).toEqual(200);
  });
});
