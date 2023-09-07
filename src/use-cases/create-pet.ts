import { OrganizationsRepository } from '@/repositories/interface/organizations-repository';
import { PetsRepository } from '@/repositories/interface/pets-repository';
import { Pet } from '@prisma/client';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

interface CreatePetUseCaseRequest {
  name: string;
  biography: string;
  age: number;
  dogSize: 'MINI' | 'SMALL' | 'MEDIUM' | 'BIG' | 'GIANT';
  energyLevel: number;
  independenceLevel: number;
  organizationId: string;
}

interface CreatePetUseCaseResponse {
  pet: Pet;
}

export class CreatePetUseCase {
  constructor(private petRepository: PetsRepository, private organizationRepository: OrganizationsRepository) {}

  public async execute({
    name,
    biography,
    age,
    dogSize,
    energyLevel,
    independenceLevel,
    organizationId,
  }: CreatePetUseCaseRequest): Promise<CreatePetUseCaseResponse> {
    const organization = await this.organizationRepository.findById(organizationId);

    if (!organization) {
      throw new ResourceNotFoundError();
    }

    const pet = await this.petRepository.create({
      name,
      biography,
      age,
      dog_size: dogSize,
      energy_level: energyLevel,
      independence_level: independenceLevel,
      organization_id: organizationId,
    });

    return { pet };
  }
}
