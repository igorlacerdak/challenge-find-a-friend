import { hash } from 'bcryptjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository';
import { InMemoryOrganizationsRepository } from '@/repositories/in-memory/in-memory-organizations-repository';
import { CreatePetUseCase } from './create-pet';

let petsRepository: InMemoryPetsRepository;
let organizationsRepository: InMemoryOrganizationsRepository;
let sut: CreatePetUseCase;

describe('Create (register) pet use case', () => {
  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository();
    organizationsRepository = new InMemoryOrganizationsRepository();
    sut = new CreatePetUseCase(petsRepository, organizationsRepository);
  });

  it('should be able to register a new pet', async () => {
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

    const { pet } = await sut.execute({
      name: 'Snoopy',
      biography: 'Biography of Snoopy',
      age: 2,
      dogSize: 'MEDIUM',
      energyLevel: 3,
      independenceLevel: 1,
      organizationId: 'org-01',
    });

    await sut.execute({
      name: 'Carrapato',
      biography: 'Summary of Carrapato',
      age: 3,
      dogSize: 'MINI',
      energyLevel: 5,
      independenceLevel: 1,
      organizationId: 'org-01',
    });

    expect(pet.id).toEqual(expect.any(String));
    expect(petsRepository.items).toHaveLength(2);
  });

  it('should not be able to register a new pet in a inexistent organization', async () => {
    await expect(() =>
      sut.execute({
        name: 'Fulaninho',
        biography: 'Biography of a Fulaninho',
        age: 2,
        dogSize: 'MEDIUM',
        energyLevel: 3,
        independenceLevel: 1,
        organizationId: 'org-01',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
