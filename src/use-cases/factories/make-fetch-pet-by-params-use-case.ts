import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository';
import { FetchPetByParamsUseCase } from '../fetch-pet-by-params';

export function makeFetchPetByParamsUseCase() {
  const prismaPetsRepository = new PrismaPetsRepository();
  const fetchPetByParamsUseCase = new FetchPetByParamsUseCase(prismaPetsRepository);

  return fetchPetByParamsUseCase;
}
