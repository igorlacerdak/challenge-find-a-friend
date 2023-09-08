import { OrganizationsRepository } from '@/repositories/interface/organizations-repository';
import { PetsRepository, fetchByParamsInterface } from '@/repositories/interface/pets-repository';
import { Pet } from '@prisma/client';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

interface FetchPetByParamsUseCaseRequest extends fetchByParamsInterface {}

interface FetchPetByParamsUseCaseResponse {
  pet: Pet[];
}

export class FetchPetByParamsUseCase {
  constructor(private petRepository: PetsRepository) {}

  public async execute({
    city,
    page,
    age,
    dogSize,
    energyLevel,
    independenceLevel,
  }: FetchPetByParamsUseCaseRequest): Promise<FetchPetByParamsUseCaseResponse> {
    const pet = await this.petRepository.fetchByParams({
      city,
      page,
      age,
      dogSize,
      energyLevel,
      independenceLevel,
    });

    if (!pet || pet.length === 0) {
      throw new ResourceNotFoundError();
    }

    return { pet };
  }
}
