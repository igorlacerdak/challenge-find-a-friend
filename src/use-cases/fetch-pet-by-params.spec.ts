import { hash } from 'bcryptjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository';
import { InMemoryOrganizationsRepository } from '@/repositories/in-memory/in-memory-organizations-repository';
import { FetchPetByParamsUseCase } from './fetch-pet-by-params';
import { faker } from '@faker-js/faker';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

let petsRepository: InMemoryPetsRepository;
let organizationsRepository: InMemoryOrganizationsRepository;
let sut: FetchPetByParamsUseCase;

describe('Fetch Pet By Params Use Case', () => {
  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository();
    organizationsRepository = new InMemoryOrganizationsRepository();
    sut = new FetchPetByParamsUseCase(petsRepository);
  });

  it('should be able to fetch a list of pets by params', async () => {
    await organizationsRepository.create({
      id: 'org-01',
      admin_name: 'Fulano',
      org_name: 'My Org',
      email: 'myorg@hotmail.com',
      password_hash: await hash('123456', 6),
      cep: '00000-000',
      address_name: 'John Doe Street',
      phone: '000000000',
    });

    for (let i = 1; i <= 25; i++) {
      await petsRepository.create({
        name: faker.person.middleName(),
        biography: faker.person.bio(),
        age: 3,
        dog_size: 'MEDIUM',
        energy_level: 3,
        independence_level: 1,
        organization_id: 'org-01',
      });
    }

    const { pet } = await sut.execute({
      page: 1,
      city: 'Araxa',
    });

    expect(pet).toHaveLength(20);
  });

  it('should be able to fetch a paginated list of pets by params', async () => {
    for (let i = 1; i <= 25; i++) {
      await petsRepository.create({
        name: faker.person.middleName(),
        biography: faker.person.bio(),
        age: 3,
        dog_size: 'MEDIUM',
        energy_level: 3,
        independence_level: 1,
        organization_id: 'org-01',
      });
    }

    const { pet } = await sut.execute({
      page: 2,
      city: 'Araxa',
    });

    expect(pet).toHaveLength(5);
  });

  it('it shouldnt be possible to get the list of pets when there are no filters', async () => {
    await expect(() =>
      sut.execute({
        city: 'Ibia',
        page: 3,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
