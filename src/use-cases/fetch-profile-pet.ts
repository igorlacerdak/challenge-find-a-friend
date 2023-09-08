import { OrganizationsRepository } from '@/repositories/interface/organizations-repository';
import { PetsRepository } from '@/repositories/interface/pets-repository';
import { Pet } from '@prisma/client';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

interface FetchProfilePetUseCaseRequest {
  id: string;
}

interface FetchProfilePetUseCaseResponse {
  pet: Pet;
}

export class FetchProfilePetUseCase {
  constructor(private petRepository: PetsRepository) {}

  public async execute({ id }: FetchProfilePetUseCaseRequest): Promise<FetchProfilePetUseCaseResponse> {
    const pet = await this.petRepository.findById(id);

    if (!pet) {
      throw new ResourceNotFoundError();
    }

    return { pet };
  }
}
