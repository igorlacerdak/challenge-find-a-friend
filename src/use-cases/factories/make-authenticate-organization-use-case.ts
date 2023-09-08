import { PrismaOrganizationsRepository } from '@/repositories/prisma/prisma-organizations-repository';
import { AuthenticateOrganizationUseCase } from '../authenticate-organization';

export function makeAuthenticateOrganizationUseCase() {
  const prismaOrganizationsRepository = new PrismaOrganizationsRepository();
  const authenticateOrganizationUseCase = new AuthenticateOrganizationUseCase(prismaOrganizationsRepository);

  return authenticateOrganizationUseCase;
}
