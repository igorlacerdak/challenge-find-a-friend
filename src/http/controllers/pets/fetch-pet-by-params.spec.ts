import { app } from '@/app';
import { prisma } from '@/db/prisma';
import { faker } from '@faker-js/faker';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Fetch pets by params (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to fetch a list of pets by params', async () => {
    const authResponse = await request(app.server).post('/sessions').send({
      email: 'org01@hotmail.com',
      password: '123456',
    });

    const { token } = authResponse.body;

    const org = await prisma.organization.findFirst({ where: { email: 'org01@hotmail.com' } });

    console.log(org);

    await prisma.pet.create({
      data: {
        name: faker.person.middleName(),
        biography: faker.lorem.sentences(4),
        age: 3,
        dog_size: 'BIG',
        energy_level: 3,
        independence_level: 2,
        organization_id: org!.id,
      },
    });

    await prisma.pet.create({
      data: {
        name: faker.person.middleName(),
        biography: faker.lorem.sentences(4),
        age: 3,
        dog_size: 'SMALL',
        energy_level: 3,
        independence_level: 2,
        organization_id: org!.id,
      },
    });

    const response = await request(app.server)
      .get('/pets')
      .set('Authorization', `Bearer ${token}`)
      .query({ city: 'Blumenau', dogSize: 'SMALL' })
      .send();

    expect(response.statusCode).toEqual(200);
  });
});
