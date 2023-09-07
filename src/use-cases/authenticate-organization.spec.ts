import { compare, hash } from 'bcryptjs';
import { expect, describe, it, beforeEach } from 'vitest';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';
import { InMemoryOrganizationsRepository } from '@/repositories/in-memory/in-memory-organizations-repository';
import { AuthenticateOrganizationUseCase } from './authenticate-organization';

let organizationsRepository: InMemoryOrganizationsRepository;
let sut: AuthenticateOrganizationUseCase;

describe('Authenticate Organization Use Case', () => {
  beforeEach(() => {
    organizationsRepository = new InMemoryOrganizationsRepository();
    sut = new AuthenticateOrganizationUseCase(organizationsRepository);
  });

  it('Should to able to autheticate a organization', async () => {
    await organizationsRepository.create({
      admin_name: 'John Doe',
      org_name: 'My Org',
      email: 'johndoe@org.com',
      password_hash: await hash('123456', 8),
      cep: '00000-000',
      address_name: 'John Doe Street',
      phone: '000000000',
    });

    const { organization } = await sut.execute({
      email: 'johndoe@org.com',
      password: '123456',
    });

    expect(organization.id).toEqual(expect.any(String));
  });

  it('Should not be able to autheticate with wrong email', async () => {
    expect(
      async () =>
        await sut.execute({
          email: 'johndoe@example.com',
          password: '123456',
        }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it('Should not be able to autheticate with wrong password', async () => {
    await organizationsRepository.create({
      admin_name: 'John Doe',
      org_name: 'My Org',
      email: 'myorg@hotmail.com',
      password_hash: await hash('123456', 8),
      cep: '00000-000',
      address_name: 'John Doe Street',
      phone: '000000000',
    });

    expect(
      async () =>
        await sut.execute({
          email: 'johndoe@example.com',
          password: '22156',
        }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
