import { app } from '@/app';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Create Organization (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to create a organization', async () => {
    const response = await request(app.server).post('/orgs').send({
      adminName: 'John Doe',
      orgName: 'Org 01',
      email: 'org01@hotmail.com',
      password: '123456',
      addressName: 'Araxa',
      cep: '00000-000',
      phone: '00 000000000',
    });

    expect(response.statusCode).toEqual(201);
  });
});
