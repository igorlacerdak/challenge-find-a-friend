import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository';
import { FetchProfilePetUseCase } from '../fetch-profile-pet';

export function makeFetchProfileUseCase() {
  const prismaPetsRepository = new PrismaPetsRepository();
  const fetchProfileUseCase = new FetchProfilePetUseCase(prismaPetsRepository);

  return fetchProfileUseCase;
}
