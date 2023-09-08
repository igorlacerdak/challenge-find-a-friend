import { hash } from 'bcryptjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository';
import { FetchProfilePetUseCase } from './fetch-profile-pet';
import { InMemoryOrganizationsRepository } from '@/repositories/in-memory/in-memory-organizations-repository';

let petsRepository: InMemoryPetsRepository;
let organizationsRepository: InMemoryOrganizationsRepository;
let sut: FetchProfilePetUseCase;

describe('Fetch Profile Pet Use Case', () => {
  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository();
    organizationsRepository = new InMemoryOrganizationsRepository();
    sut = new FetchProfilePetUseCase(petsRepository);
  });

  it('should be able to get a pet by Id', async () => {
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

    const createdPet = await petsRepository.create({
      name: 'Snoopy',
      biography: 'Biography of Snoopy',
      age: 2,
      dog_size: 'MEDIUM',
      energy_level: 3,
      independence_level: 1,
      organization_id: 'org-01',
    });

    const { pet } = await sut.execute({
      id: createdPet.id,
    });

    expect(pet.id).toEqual(expect.any(String));
    expect(pet.age).toEqual(2);
  });

  it('should not be able to get pet profile with wrong id', async () => {
    await expect(() =>
      sut.execute({
        id: 'wrong',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
