import { PrismaOrganizationsRepository } from '@/repositories/prisma/prisma-organizations-repository';
import { CreateOrganizationUseCase } from '../create-organization';

export function makeCreateOrganizationUseCase() {
  const prismaOrganizationsRepository = new PrismaOrganizationsRepository();
  const createOrganizationUseCase = new CreateOrganizationUseCase(prismaOrganizationsRepository);

  return createOrganizationUseCase;
}
