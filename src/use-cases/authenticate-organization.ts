import { OrganizationsRepository } from '@/repositories/interface/organizations-repository';
import { Organization } from '@prisma/client';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';
import { compare } from 'bcryptjs';

interface AuthenticateOrganizationUseCaseRequest {
  email: string;
  password: string;
}

interface AuthenticateOrganizationUseCaseResponse {
  organization: Organization;
}

export class AuthenticateOrganizationUseCase {
  constructor(private organizationsRepository: OrganizationsRepository) {}

  public async execute({
    email,
    password,
  }: AuthenticateOrganizationUseCaseRequest): Promise<AuthenticateOrganizationUseCaseResponse> {
    const organization = await this.organizationsRepository.findByEmail(email);

    if (!organization) {
      throw new InvalidCredentialsError();
    }

    const doesPasswordMatches = await compare(password, organization.password_hash);

    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError();
    }

    return { organization };
  }
}
